import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { inspectionAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const rc = r=>r>=7?'var(--ok)':r>=4?'var(--warn)':'var(--primary2)';

function ResolveModal({ item, onClose, onDone }) {
  const [reply, setReply] = useState('');
  const [loading, setLd] = useState(false);
  const submit = async () => {
    if (!reply.trim()) return toast.error('Reply required');
    setLd(true);
    try { await inspectionAPI.resolveIssue(item._id, reply); toast.success('Resolved!'); onDone(); onClose(); }
    catch { toast.error('Failed'); }
    finally { setLd(false); }
  };
  return (
    <div className="modal show d-block" style={{background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">⚠️ Reported Issue</h5>
            <button className="btn-close" onClick={onClose}/>
          </div>
          <div className="modal-body">
            <div className="p-3 rounded mb-3" style={{background:'var(--pbg)',border:'1px solid rgba(229,57,53,0.2)'}}>
              <div className="text-muted-ag mb-1">From: {item.customerEmail||item.customerName}</div>
              <div className="fw-bold">{item.vehicleMake} {item.vehicleModel} — {item.registrationNo}</div>
              <div className="mt-2" style={{fontSize:'14px'}}>{item.reportedIssue?.message}</div>
            </div>
            <div className="mb-0">
              <label className="form-label">Your Reply / Clarification</label>
              <textarea className="form-control" rows="3" value={reply} onChange={e=>setReply(e.target.value)} placeholder="Explain correction or provide details..."/>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-danger" onClick={submit} disabled={loading}>
              {loading?<><span className="spinner-sm me-2"/>Saving...</>:'✓ Mark Resolved'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLd]    = useState(true);
  const [resolve, setRes]   = useState(null);
  const navigate            = useNavigate();
  const { user }            = useAuth();

  const load = () => { setLd(true); inspectionAPI.getStats().then(r=>setStats(r.data.data)).catch(()=>toast.error('Failed')).finally(()=>setLd(false)); };
  useEffect(()=>load(),[]);

  if (loading) return <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading dashboard...</p></div>;

  const statCards = [
    {label:'Total Inspections',value:stats?.total||0,icon:'📋',c:'red',  sub:'All time'},
    {label:'Completed',        value:stats?.completed||0,icon:'✅',c:'green',sub:'Finalized'},
    {label:'Drafts',           value:stats?.draft||0,   icon:'📝',c:'blue', sub:'In progress'},
    {label:'Avg. Rating',      value:stats?.avgRating||0,icon:'⭐',c:'orange',sub:'Out of 10'},
  ];
  const pie = [{name:'Completed',value:stats?.completed||0,color:'var(--ok)'},{name:'Draft',value:stats?.draft||0,color:'var(--warn)'}];
  const bar = (stats?.recent||[]).map(i=>({name:(i.vehicleMake||'').slice(0,7),r:i.ratings?.overall||0}));

  return (
    <div>
      {/* Stats */}
      <div className="row g-3 mb-4">
        {statCards.map(({label,value,icon,c,sub})=>(
          <div key={label} className="col-6 col-xl-3">
            <div className="stat-card">
              <div className={`stat-stripe ${c}`}/>
              <div className={`stat-icon ${c}`}>{icon}</div>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
              <div className="stat-sub">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin notifications */}
      {user?.role==='admin' && stats?.pendingReports?.length>0 && (
        <div className="card mb-4" style={{borderLeft:'4px solid var(--primary)'}}>
          <div className="card-header d-flex align-items-center gap-2">
            <span style={{fontSize:'22px'}}>🔔</span>
            <span>Reported Issues</span>
            <span className="badge bg-danger ms-1">{stats.pendingReports.length}</span>
          </div>
          <div className="card-body">
            {stats.pendingReports.map(item=>(
              <div key={item._id} className="notif-item">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                  <div>
                    <div className="fw-bold" style={{fontSize:'15px'}}>{item.vehicleMake} {item.vehicleModel} — {item.registrationNo||'N/A'}</div>
                    <div className="text-muted-ag mt-1">{item.reportedIssue?.message}</div>
                    <div className="text-muted-ag" style={{fontSize:'12px',marginTop:'3px'}}>By: {item.customerEmail||item.customerName}</div>
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-outline-secondary btn-sm" onClick={()=>navigate(`/view/${item._id}`)}>👁 View</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>setRes(item)}>Reply & Resolve</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts + Recent */}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>🕐 Recent Inspections</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={()=>navigate('/inspections')}>View All</button>
            </div>
            <div className="card-body p-0">
              {!stats?.recent?.length
                ? <div className="empty-state" style={{padding:'40px'}}>
                    <div className="empty-icon">🚗</div>
                    <p className="mb-3">No inspections yet</p>
                    {user?.role==='admin'&&<button className="btn btn-danger btn-sm" onClick={()=>navigate('/new')}>+ Create First</button>}
                  </div>
                : stats.recent.map(insp=>(
                  <div key={insp._id} onClick={()=>navigate(`/view/${insp._id}`)} className="d-flex justify-content-between align-items-center px-3 py-3"
                    style={{borderBottom:'1px solid var(--border)',cursor:'pointer',transition:'background 0.12s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--pbg)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <div>
                      <div className="fw-bold" style={{fontSize:'15px'}}>{insp.vehicleMake} {insp.vehicleModel}</div>
                      <div className="text-muted-ag">{insp.registrationNo||'No Reg'} · {new Date(insp.inspectionDate).toLocaleDateString('en-PK')}</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{fontSize:'24px',fontWeight:'900',color:rc(insp.ratings?.overall||0)}}>{insp.ratings?.overall||0}</span>
                      <span className={`badge ${insp.status==='completed'?'bg-success':'bg-warning text-dark'}`}>{insp.status}</span>
                    </div>
                  </div>
                ))
              }
            </div>
            {user?.role==='admin' && (
              <div className="card-body pt-2">
                <button className="btn btn-danger w-100" onClick={()=>navigate('/new')}>➕ New Inspection</button>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header">📊 Analytics Overview</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <p className="text-muted-ag mb-2">Status Split</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart><Pie data={pie} cx="50%" cy="50%" innerRadius={42} outerRadius={66} dataKey="value" paddingAngle={3}>
                      {pie.map((e,i)=><Cell key={i} fill={e.color}/>)}
                    </Pie><Legend wrapperStyle={{fontSize:'12px'}}/><Tooltip contentStyle={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'10px',fontSize:'13px'}}/></PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="col-12 col-sm-6">
                  <p className="text-muted-ag mb-2">Ratings</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={bar} barSize={20}>
                      <XAxis dataKey="name" tick={{fill:'var(--text2)',fontSize:11}} axisLine={false} tickLine={false}/>
                      <YAxis domain={[0,10]} tick={{fill:'var(--text2)',fontSize:11}} axisLine={false} tickLine={false}/>
                      <Tooltip contentStyle={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'10px',fontSize:'13px'}} cursor={{fill:'rgba(255,255,255,0.04)'}}/>
                      <Bar dataKey="r" radius={[5,5,0,0]}>{bar.map((e,i)=><Cell key={i} fill={rc(e.r)}/>)}</Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {resolve && <ResolveModal item={resolve} onClose={()=>setRes(null)} onDone={load}/>}
    </div>
  );
}
