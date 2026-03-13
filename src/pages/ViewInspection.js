import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { inspectionAPI, getPDFUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import CarDiagram from '../components/common/CarDiagram';

const rc = r => r>=7?'var(--ok)':r>=4?'var(--warn)':'var(--primary2)';
const rl = r => r>=8?'Excellent':r>=6?'Good':r>=4?'Average':'Poor';

function StatusBadge({ s }) {
  const map = {
    ok:          ['bg-success','✓ OK'],
    not_ok:      ['bg-danger', '✗ Not OK'],
    excellent:   ['bg-success','★ Excellent'],
    moderate:    ['bg-warning text-dark','◎ Moderate'],
    not_working: ['bg-danger', '✗ Not Working'],
    alloys:      ['bg-primary', '◆ Alloys'],
    normal:      ['bg-secondary','◇ Normal'],
    na:          ['bg-secondary','—'],
  };
  const [cls, txt] = map[s] || ['bg-secondary','—'];
  return <span className={`badge ${cls}`} style={{fontSize:'12px'}}>{txt}</span>;
}

function CheckView({ title, icon, items }) {
  if (!items?.length) return null;
  const ok  = items.filter(i=>['ok','excellent','alloys'].includes(i.status)).length;
  const bad = items.filter(i=>['not_ok','not_working'].includes(i.status)).length;
  return (
    <div className="card mb-4">
      <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <span style={{fontSize:'22px'}}>{icon}</span><span>{title}</span>
        </div>
        <div className="d-flex gap-2">
          {ok>0  && <span className="badge bg-success">✓ {ok} OK</span>}
          {bad>0 && <span className="badge bg-danger">✗ {bad} Issues</span>}
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead><tr>
            <th style={{width:'40%'}}>Item</th>
            <th style={{width:'20%'}}>Status</th>
            <th>Remarks</th>
          </tr></thead>
          <tbody>
            {items.map((it,i)=>(
              <tr key={i}>
                <td className="fw-500" style={{fontSize:'14px'}}>{it.name}</td>
                <td><StatusBadge s={it.status}/></td>
                <td className="text-muted-ag">{it.remarks||'—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportIssueModal({ id, onClose }) {
  const [msg, setMsg] = useState('');
  const [loading, setLd] = useState(false);
  const submit = async () => {
    if (!msg.trim()) return toast.error('Message required');
    setLd(true);
    try { await inspectionAPI.reportIssue(id, msg); toast.success('Issue reported to admin!'); onClose(true); }
    catch { toast.error('Failed'); }
    finally { setLd(false); }
  };
  return (
    <div className="modal show d-block" style={{background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header"><h5 className="modal-title">⚠️ Report an Issue</h5><button className="btn-close" onClick={()=>onClose(false)}/></div>
          <div className="modal-body">
            <p className="text-muted-ag mb-3">Describe what seems incorrect. Admin will be notified and will reply.</p>
            <label className="form-label">Issue Description</label>
            <textarea className="form-control" rows="4" value={msg} onChange={e=>setMsg(e.target.value)}
              placeholder="e.g. Engine was marked OK but there is actually an oil leak..."/>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={()=>onClose(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={submit} disabled={loading}>
              {loading?<><span className="spinner-sm me-2"/>Sending...</>:'Send Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ViewInspection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData]         = useState(null);
  const [loading, setLd]        = useState(true);
  const [delModal, setDel]      = useState(false);
  const [issueModal, setIssue]  = useState(false);

  const load = () => {
    setLd(true);
    inspectionAPI.getOne(id)
      .then(r => setData(r.data.data))
      .catch(() => navigate('/inspections'))
      .finally(() => setLd(false));
  };
  useEffect(() => { load(); }, [id]);

  if (loading) return <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading...</p></div>;
  if (!data)   return null;

  const del = async () => {
    try { await inspectionAPI.delete(id); toast.success('Deleted'); navigate('/inspections'); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      {/* Action buttons */}
      <div className="d-flex flex-wrap gap-2 mb-4 align-items-center">
        <button className="btn btn-outline-secondary" onClick={()=>navigate('/inspections')}>← Back</button>
        <div className="ms-auto d-flex flex-wrap gap-2">
          {user?.role==='admin' && <>
            <button className="btn btn-outline-secondary" onClick={()=>navigate(`/edit/${id}`)}>✏️ Edit</button>
            <button className="btn btn-outline-danger" onClick={()=>setDel(true)}>🗑 Delete</button>
          </>}
          <button className="btn btn-success" onClick={()=>window.open(getPDFUrl(id),'_blank')}>📄 Download PDF</button>
          {user?.role==='user' && !data.reportedIssue?.hasIssue && (
            <button className="btn btn-outline-danger" onClick={()=>setIssue(true)}>⚠️ Report Issue</button>
          )}
        </div>
      </div>

      {/* Issue banners */}
      {data.reportedIssue?.isResolved && data.reportedIssue?.adminReply && (
        <div className="alert alert-success d-flex gap-2 mb-4">
          <span style={{fontSize:'20px'}}>✅</span>
          <div><strong>Issue Resolved by Admin</strong><p className="mb-0 mt-1">{data.reportedIssue.adminReply}</p></div>
        </div>
      )}
      {data.reportedIssue?.hasIssue && !data.reportedIssue?.isResolved && (
        <div className="alert alert-danger d-flex gap-2 mb-4">
          <span style={{fontSize:'20px'}}>⏳</span>
          <div><strong>Issue Reported — Pending Admin Review</strong><p className="mb-0 mt-1">{data.reportedIssue.message}</p></div>
        </div>
      )}

      {/* Vehicle header */}
      <div className="card mb-4" style={{borderLeft:'4px solid var(--primary)'}}>
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between gap-3 align-items-start">
            <div style={{flex:1,minWidth:'200px'}}>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <h3 className="fw-bold mb-0" style={{fontSize:'22px'}}>{data.vehicleMake} {data.vehicleModel}</h3>
                <span className={`badge ${data.status==='completed'?'bg-success':'bg-warning text-dark'}`} style={{fontSize:'13px'}}>
                  {data.status==='completed'?'✅ Completed':'📝 Draft'}
                </span>
              </div>
              <div className="row g-2">
                {[['Year',data.modelYear],['Engine',data.engineCapacity],['Reg No.',data.registrationNo],['Chassis',data.chassisNo],['Color',data.exteriorColor],['Transmission',data.transmissionType],['Drive',data.driveType?.toUpperCase()],['Fuel',data.engineType],['Date',new Date(data.inspectionDate).toLocaleDateString('en-PK')]].filter(([,v])=>v).map(([l,v])=>(
                  <div key={l} className="col-6 col-sm-4 col-md-3">
                    <div style={{fontSize:'11px',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.5px'}}>{l}</div>
                    <div style={{fontSize:'14px',fontWeight:'600',textTransform:'capitalize'}}>{v}</div>
                  </div>
                ))}
              </div>
              {data.customerName && (
                <div className="mt-3 p-3 rounded" style={{background:'var(--bg3)',border:'1px solid var(--border)'}}>
                  <div className="d-flex flex-wrap gap-3 align-items-center">
                    <span style={{fontSize:'18px'}}>👤</span>
                    <span className="fw-bold" style={{fontSize:'15px'}}>{data.customerName}</span>
                    {data.customerPhone && <span className="text-muted-ag">📞 {data.customerPhone}</span>}
                    {data.customerEmail && <span className="text-muted-ag">✉️ {data.customerEmail}</span>}
                  </div>
                </div>
              )}
            </div>
            <div className="text-center p-3 rounded" style={{background:'var(--bg3)',border:'1px solid var(--border)',minWidth:'100px'}}>
              <div style={{fontSize:'12px',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'6px'}}>Overall</div>
              <div style={{fontSize:'52px',fontWeight:'900',color:rc(data.ratings?.overall||0),lineHeight:1}}>{data.ratings?.overall||0}</div>
              <div className="text-muted-ag">/10</div>
              <div style={{fontSize:'13px',fontWeight:'700',color:rc(data.ratings?.overall||0)}}>{rl(data.ratings?.overall||0)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings */}
      <div className="card mb-4">
        <div className="card-header"><span style={{fontSize:'22px'}}>📊</span> Category Ratings</div>
        <div className="card-body">
          <div className="row g-3">
            {[['🚗 Exterior',data.ratings?.exterior||0],['🪑 Interior',data.ratings?.interior||0],['⚡ Electrical',data.ratings?.electrical||0],['⚙️ Mechanical',data.ratings?.mechanical||0],['❄️ Heating/AC',data.ratings?.heatingCooling||0],['🛞 Tyres/Shocks',data.ratings?.tyresShocks||0]].map(([l,v])=>(
              <div key={l} className="col-6 col-md-4">
                <div className="p-3 rounded text-center" style={{background:'var(--bg3)',border:'1px solid var(--border)'}}>
                  <div className="text-muted-ag mb-2" style={{fontSize:'13px'}}>{l}</div>
                  <div style={{fontSize:'28px',fontWeight:'900',color:rc(v)}}>{v}</div>
                  <div style={{background:'var(--border)',borderRadius:'4px',height:'6px',marginTop:'8px'}}>
                    <div style={{background:rc(v),width:`${v*10}%`,height:'6px',borderRadius:'4px'}}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Car Diagram */}
      {data.diagramZones && Object.keys(data.diagramZones).length > 0 && (
        <div className="card mb-4">
          <div className="card-header"><span style={{fontSize:'22px'}}>🗺️</span> Car Diagram</div>
          <div className="card-body"><CarDiagram zones={data.diagramZones} readOnly/></div>
        </div>
      )}

      {/* Checklists */}
      <CheckView title="1. Exterior Details" icon="🔧" items={data.exteriorDetails}/>
      <CheckView title="2. Interior & Comfort" icon="🪑" items={data.interiorComfort}/>
      <CheckView title="3. Electrical Systems" icon="⚡" items={data.electrical}/>
      <CheckView title="4. Mechanical & Driving" icon="⚙️" items={data.mechanical}/>

      {/* Heating */}
      {data.heatingCooling?.length > 0 && (
        <div className="card mb-4">
          <div className="card-header"><span style={{fontSize:'22px'}}>❄️</span> 5. Heating & Cooling</div>
          <div className="card-body">
            <div className="row g-3">
              {data.heatingCooling.map((item,i)=>(
                <div key={i} className="col-12 col-sm-4">
                  <div className="text-center p-3 rounded" style={{background:'var(--bg3)',border:'1px solid var(--border)'}}>
                    <div className="fw-bold mb-2" style={{fontSize:'15px'}}>{item.name}</div>
                    <StatusBadge s={item.status}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tyres & Shocks */}
      <CheckView title="6. Tyres & Shocks" icon="🛞" items={data.tyresShocks}/>

      {/* Inspector */}
      {(data.inspectorName || data.inspectorSign) && (
        <div className="card mb-4" style={{borderLeft:'4px solid var(--warn)'}}>
          <div className="card-header"><span style={{fontSize:'22px'}}>🔍</span> Inspector Details</div>
          <div className="card-body">
            <div className="row g-3">
              {data.inspectorName && <div className="col-12 col-sm-4"><div className="text-muted-ag mb-1">Name</div><div className="fw-bold" style={{fontSize:'15px'}}>{data.inspectorName}</div></div>}
              {data.inspectorSign && <div className="col-12 col-sm-4"><div className="text-muted-ag mb-1">Signature</div><div className="fw-bold" style={{fontSize:'15px'}}>{data.inspectorSign}</div></div>}
              {data.inspectorStamp && <div className="col-12 col-sm-4"><div className="text-muted-ag mb-1">Stamp/Badge</div><div className="fw-bold" style={{fontSize:'15px'}}>{data.inspectorStamp}</div></div>}
            </div>
          </div>
        </div>
      )}

      {data.notes && (
        <div className="alert alert-warning d-flex gap-2">
          <span style={{fontSize:'20px'}}>📝</span>
          <div><strong>Notes</strong><p className="mb-0 mt-1">{data.notes}</p></div>
        </div>
      )}

      {/* Delete Modal */}
      {delModal && (
        <div className="modal show d-block" style={{background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">⚠️ Delete Inspection?</h5><button className="btn-close" onClick={()=>setDel(false)}/></div>
              <div className="modal-body"><p style={{fontSize:'15px'}}>This action cannot be undone.</p></div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={()=>setDel(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={del}>🗑 Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {issueModal && <ReportIssueModal id={id} onClose={(r)=>{setIssue(false);if(r)load();}}/>}
    </div>
  );
}
