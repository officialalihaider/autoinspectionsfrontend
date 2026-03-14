// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { ChecklistSection, RatingsSection } from '../components/forms/ChecklistSection';
// import CarDiagram from '../components/common/CarDiagram';
// import { inspectionAPI } from '../utils/api';
// import { useAuth } from '../context/AuthContext';

// const STEPS=[{id:0,label:'Vehicle',icon:'🚗'},{id:1,label:'Diagram',icon:'🗺️'},{id:2,label:'Exterior',icon:'🔧'},{id:3,label:'Interior',icon:'🪑'},{id:4,label:'Electrics',icon:'⚡'},{id:5,label:'Mechanic',icon:'⚙️'},{id:6,label:'Heating',icon:'❄️'},{id:7,label:'Tyres',icon:'🛞'},{id:8,label:'Ratings',icon:'⭐'}];

// export default function EditInspection() {
//   const {id}=useParams(); const navigate=useNavigate(); const {user}=useAuth();
//   const [step,setSt]=useState(0); const [loading,setLd]=useState(true);
//   const [saving,setSv]=useState(false); const [form,setForm]=useState(null);

//   useEffect(()=>{ if(user&&user.role!=='admin'){navigate('/');toast.error('Admin only');} },[user]);
//   useEffect(()=>{
//     inspectionAPI.getOne(id)
//       .then(r=>setForm({diagramZones:{},...r.data.data}))
//       .catch(()=>{toast.error('Not found');navigate('/inspections');})
//       .finally(()=>setLd(false));
//   },[id]);

//   const setF=useCallback((k,v)=>setForm(p=>({...p,[k]:v})),[]);
//   const updateList=useCallback(lk=>(idx,f,v)=>setForm(p=>({...p,[lk]:p[lk].map((it,i)=>i===idx?{...it,[f]:v}:it)})),[]);
//   const setRating=useCallback((k,v)=>setForm(p=>({...p,ratings:{...p.ratings,[k]:v}})),[]);
//   const diagZone=useCallback(z=>{if(z.newStatus!==undefined)setForm(p=>({...p,diagramZones:{...(p.diagramZones||{}),[z.id]:z.newStatus}}));},[]);

//   const save=async status=>{
//     setSv(true);
//     try{await inspectionAPI.update(id,{...form,status});toast.success('✅ Updated!');navigate(`/view/${id}`);}
//     catch{toast.error('Update failed');}finally{setSv(false);}
//   };

//   if(loading) return <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading...</p></div>;
//   if(!form) return null;

//   const FI=({label,fk,type='text',placeholder='',col='col-12 col-sm-6 col-md-4'})=>(
//     <div className={col}><div className="mb-3">
//       <label className="form-label">{label}</label>
//       <input className="form-control" type={type} placeholder={placeholder} value={form[fk]||''} onChange={e=>setF(fk,e.target.value)}/>
//     </div></div>
//   );
//   const FS=({label,fk,opts,col='col-12 col-sm-6 col-md-4'})=>(
//     <div className={col}><div className="mb-3">
//       <label className="form-label">{label}</label>
//       <select className="form-select" value={form[fk]||''} onChange={e=>setF(fk,e.target.value)}>
//         {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
//       </select>
//     </div></div>
//   );

//   const renderStep=()=>{
//     switch(step){
//       case 0:return(
//         <>
//           <div className="card mb-4" style={{borderLeft:'4px solid var(--primary)'}}>
//             <div className="card-header"><span style={{fontSize:'22px'}}>🚗</span> Vehicle</div>
//             <div className="card-body"><div className="row g-0">
//               <FI label="Make *" fk="vehicleMake"/><FI label="Model" fk="vehicleModel"/><FI label="Year" fk="modelYear"/>
//               <FI label="Engine" fk="engineCapacity"/><FI label="Chassis" fk="chassisNo"/><FI label="Reg No." fk="registrationNo"/>
//               <FI label="Color" fk="exteriorColor"/><FI label="Date" fk="inspectionDate" type="date"/>
//               <FS label="Transmission" fk="transmissionType" opts={[['manual','Manual'],['automatic','Automatic']]}/>
//               <FS label="Drive" fk="driveType" opts={[['2wd','2WD'],['4wd','4WD'],['awd','AWD']]}/>
//               <FS label="Fuel" fk="engineType" opts={[['petrol','Petrol'],['diesel','Diesel'],['cng','CNG'],['electric','Electric'],['hybrid','Hybrid']]}/>
//             </div></div>
//           </div>
//           <div className="card mb-4" style={{borderLeft:'4px solid #448aff'}}>
//             <div className="card-header"><span style={{fontSize:'22px'}}>👤</span> Customer</div>
//             <div className="card-body"><div className="row g-0">
//               <FI label="Name" fk="customerName" col="col-12 col-sm-6"/>
//               <FI label="Phone" fk="customerPhone" col="col-12 col-sm-6"/>
//               <FI label="Email" fk="customerEmail" type="email" col="col-12"/>
//             </div></div>
//           </div>
//           <div className="card mb-4" style={{borderLeft:'4px solid var(--warn)'}}>
//             <div className="card-header"><span style={{fontSize:'22px'}}>🔍</span> Inspector</div>
//             <div className="card-body"><div className="row g-0">
//               <FI label="Inspector Name" fk="inspectorName"/><FI label="Signature" fk="inspectorSign"/><FI label="Stamp" fk="inspectorStamp"/>
//             </div></div>
//           </div>
//           <div className="card" style={{borderLeft:'4px solid var(--ok)'}}>
//             <div className="card-header"><span style={{fontSize:'22px'}}>📝</span> Notes</div>
//             <div className="card-body">
//               <textarea className="form-control" rows="3" value={form.notes||''} onChange={e=>setF('notes',e.target.value)}/>
//             </div>
//           </div>
//         </>
//       );
//       case 1:return<div className="card"><div className="card-body"><CarDiagram zones={form.diagramZones||{}} onZoneClick={diagZone}/></div></div>;
//       case 2:return<ChecklistSection title="1. Exterior Details" icon="🔧" items={form.exteriorDetails} onChange={updateList('exteriorDetails')}/>;
//       case 3:return<ChecklistSection title="2. Interior & Comfort" icon="🪑" items={form.interiorComfort} onChange={updateList('interiorComfort')}/>;
//       case 4:return<ChecklistSection title="3. Electrical" icon="⚡" items={form.electrical} onChange={updateList('electrical')}/>;
//       case 5:return<ChecklistSection title="4. Mechanical" icon="⚙️" items={form.mechanical} onChange={updateList('mechanical')}/>;
//       case 6:return<ChecklistSection title="5. Heating & Cooling" icon="❄️" items={form.heatingCooling} onChange={updateList('heatingCooling')} type="heating"/>;
//       case 7:return<ChecklistSection title="6. Tyres & Shocks" icon="🛞" items={form.tyresShocks} onChange={updateList('tyresShocks')} type="tyres"/>;
//       case 8:return<RatingsSection ratings={form.ratings} onChange={setRating}/>;
//       default:return null;
//     }
//   };
//   const pct=Math.round((step/(STEPS.length-1))*100);
//   return(
//     <div>
//       <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
//         <div><h5 className="fw-bold mb-0">✏️ Edit: {form.vehicleMake} {form.vehicleModel}</h5><p className="text-muted-ag mb-0">{form.registrationNo||'—'}</p></div>
//         <button className="btn btn-outline-secondary" onClick={()=>navigate(`/view/${id}`)}>← Back</button>
//       </div>
//       <div className="progress mb-3"><div className="progress-bar" style={{width:`${pct}%`}}/></div>
//       <div className="steps-wrap mb-4"><div className="steps-bar">
//         {STEPS.map(s=><div key={s.id} className={`step-item ${step===s.id?'active':step>s.id?'done':''}`} onClick={()=>setSt(s.id)}>
//           <span className="step-icon">{step>s.id?'✓':s.icon}</span><div className="step-label">{s.label}</div>
//         </div>)}
//       </div></div>
//       {renderStep()}
//       <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4 pt-3" style={{borderTop:'1px solid var(--border)'}}>
//         <div>{step>0&&<button className="btn btn-outline-secondary" onClick={()=>setSt(s=>s-1)}>← Back</button>}</div>
//         <div className="d-flex gap-3 flex-wrap">
//           <button className="btn btn-outline-secondary" onClick={()=>save('draft')} disabled={saving}>💾 Draft</button>
//           {step<STEPS.length-1
//             ?<button className="btn btn-danger" onClick={()=>setSt(s=>s+1)}>Next →</button>
//             :<button className="btn btn-success btn-lg" onClick={()=>save('completed')} disabled={saving}>
//               {saving?<><span className="spinner-sm me-2"/>Saving...</>:'✅ Save & Complete'}</button>
//           }
//         </div>
//       </div>
//     </div>
//   );
// }









import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChecklistSection, RatingsSection } from '../components/forms/ChecklistSection';
import CarDiagram from '../components/common/CarDiagram';
import { inspectionAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { id: 0, label: 'Vehicle',   icon: '🚗' },
  { id: 1, label: 'Diagram',   icon: '🗺️' },
  { id: 2, label: 'Exterior',  icon: '🔧' },
  { id: 3, label: 'Interior',  icon: '🪑' },
  { id: 4, label: 'Electrics', icon: '⚡' },
  { id: 5, label: 'Mechanic',  icon: '⚙️' },
  { id: 6, label: 'Heating',   icon: '❄️' },
  { id: 7, label: 'Tyres',     icon: '🛞' },
  { id: 8, label: 'Ratings',   icon: '⭐' },
];

// ✅ Outside component — fixes uncontrolled input
const FI = ({ label, fk, type = 'text', placeholder = '', span = 1, form, setF }) => (
  <div className={`ni-field ni-field-${span}`}>
    <label className="ni-label">{label}</label>
    <input
      className="ni-input"
      type={type}
      placeholder={placeholder}
      value={form[fk] || ''}
      onChange={e => setF(fk, e.target.value)}
    />
  </div>
);

const FS = ({ label, fk, opts, span = 1, form, setF }) => (
  <div className={`ni-field ni-field-${span}`}>
    <label className="ni-label">{label}</label>
    <select
      className="ni-input ni-select"
      value={form[fk] || ''}
      onChange={e => setF(fk, e.target.value)}
    >
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  </div>
);

export default function EditInspection() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const [step, setSt] = useState(0);
  const [loading, setLd] = useState(true);
  const [saving, setSv]  = useState(false);
  const [form, setForm]  = useState(null);

  useEffect(() => {
    if (user && user.role !== 'admin') { navigate('/'); toast.error('Admin only'); }
  }, [user]);

  useEffect(() => {
    inspectionAPI.getOne(id)
      .then(r => setForm({ diagramZones: {}, ...r.data.data }))
      .catch(() => { toast.error('Not found'); navigate('/inspections'); })
      .finally(() => setLd(false));
  }, [id]);

  const setF       = useCallback((k, v) => setForm(p => ({ ...p, [k]: v })), []);
  const updateList = useCallback(lk => (idx, f, v) =>
    setForm(p => ({ ...p, [lk]: p[lk].map((it, i) => i === idx ? { ...it, [f]: v } : it) })), []);
  const setRating  = useCallback((k, v) => setForm(p => ({ ...p, ratings: { ...p.ratings, [k]: v } })), []);
  const diagZone   = useCallback(z => {
    if (z.newStatus !== undefined)
      setForm(p => ({ ...p, diagramZones: { ...(p.diagramZones || {}), [z.id]: z.newStatus } }));
  }, []);

  const save = async status => {
    setSv(true);
    try {
      await inspectionAPI.update(id, { ...form, status });
      toast.success('✅ Updated!');
      navigate(`/view/${id}`);
    } catch { toast.error('Update failed'); }
    finally { setSv(false); }
  };

  if (loading) return (
    <div className="ni-empty">
      <div style={{ fontSize: 52, marginBottom: 12 }}>⏳</div>
      <p>Loading...</p>
    </div>
  );
  if (!form) return null;

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <>
          <div className="ni-card" style={{ '--accent': 'var(--primary, #e63946)' }}>
            <div className="ni-card-head"><span>🚗</span> Vehicle Information</div>
            <div className="ni-grid">
              <FI label="Make *"          fk="vehicleMake"       placeholder="Toyota, Honda..."     form={form} setF={setF} />
              <FI label="Model"           fk="vehicleModel"      placeholder="Corolla, Civic..."    form={form} setF={setF} />
              <FI label="Year"            fk="modelYear"         placeholder="2020"                 form={form} setF={setF} />
              <FI label="Engine Capacity" fk="engineCapacity"    placeholder="1300cc, 1800cc"       form={form} setF={setF} />
              <FI label="Chassis No."     fk="chassisNo"                                            form={form} setF={setF} />
              <FI label="Reg No."         fk="registrationNo"    placeholder="ABC-123"              form={form} setF={setF} />
              <FI label="Color"           fk="exteriorColor"     placeholder="White, Silver..."     form={form} setF={setF} />
              <FI label="Inspection Date" fk="inspectionDate"    type="date"                        form={form} setF={setF} />
              <FS label="Transmission"    fk="transmissionType"  opts={[['manual','Manual'],['automatic','Automatic']]}           form={form} setF={setF} />
              <FS label="Drive Type"      fk="driveType"         opts={[['2wd','2WD'],['4wd','4WD'],['awd','AWD']]}               form={form} setF={setF} />
              <FS label="Fuel Type"       fk="engineType"        opts={[['petrol','Petrol'],['diesel','Diesel'],['cng','CNG'],['electric','Electric'],['hybrid','Hybrid']]} form={form} setF={setF} />
            </div>
          </div>

          <div className="ni-card" style={{ '--accent': '#448aff' }}>
            <div className="ni-card-head"><span>👤</span> Customer Details</div>
            <div className="ni-grid">
              <FI label="Customer Name"  fk="customerName"  placeholder="Full name"            span={1} form={form} setF={setF} />
              <FI label="Phone Number"   fk="customerPhone" placeholder="+92 300 0000000"      span={1} form={form} setF={setF} />
              <FI label="Customer Email" fk="customerEmail" type="email" placeholder="customer@email.com" span={2} form={form} setF={setF} />
            </div>
          </div>

          <div className="ni-card" style={{ '--accent': 'var(--warn, #f4a261)' }}>
            <div className="ni-card-head"><span>🔍</span> Inspector Details</div>
            <div className="ni-grid">
              <FI label="Inspector Name"    fk="inspectorName"  placeholder="Inspector full name" form={form} setF={setF} />
              <FI label="Signature (text)"  fk="inspectorSign"  placeholder="e.g. Ali Haider"     form={form} setF={setF} />
              <FI label="Stamp / Badge No." fk="inspectorStamp" placeholder="e.g. AG-001"         form={form} setF={setF} />
            </div>
          </div>

          <div className="ni-card" style={{ '--accent': 'var(--ok, #2a9d8f)' }}>
            <div className="ni-card-head"><span>📝</span> Inspector Notes</div>
            <div className="ni-grid">
              <div className="ni-field ni-field-2">
                <label className="ni-label">Notes</label>
                <textarea
                  className="ni-input"
                  rows="4"
                  placeholder="Additional observations, test drive notes..."
                  value={form.notes || ''}
                  onChange={e => setF('notes', e.target.value)}
                  style={{ height: 'auto', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>
        </>
      );
      case 1: return (
        <div>
          <div className="ni-card" style={{ '--accent': '#6c757d' }}>
            <div className="ni-card-head"><span>🗺️</span> Car Diagram</div>
            <div style={{ padding: '16px' }}>
              <CarDiagram zones={form.diagramZones || {}} onZoneClick={diagZone} />
            </div>
          </div>
          <div className="ni-alert ni-alert-danger">
            💡 Click any zone on the car to mark it <strong>OK ✓</strong> or <strong>Issue ✗</strong>. This diagram appears in the PDF report.
          </div>
        </div>
      );
      case 2: return <ChecklistSection title="1. Exterior Details" icon="🔧" items={form.exteriorDetails} onChange={updateList('exteriorDetails')} />;
      case 3: return <ChecklistSection title="2. Interior & Comfort" icon="🪑" items={form.interiorComfort} onChange={updateList('interiorComfort')} />;
      case 4: return <ChecklistSection title="3. Electrical" icon="⚡" items={form.electrical} onChange={updateList('electrical')} />;
      case 5: return <ChecklistSection title="4. Mechanical" icon="⚙️" items={form.mechanical} onChange={updateList('mechanical')} />;
      case 6: return <ChecklistSection title="5. Heating & Cooling" icon="❄️" items={form.heatingCooling} onChange={updateList('heatingCooling')} type="heating" />;
      case 7: return <ChecklistSection title="6. Tyres & Shocks" icon="🛞" items={form.tyresShocks} onChange={updateList('tyresShocks')} type="tyres" />;
      case 8: return <RatingsSection ratings={form.ratings} onChange={setRating} />;
      default: return null;
    }
  };

  const pct = Math.round((step / (STEPS.length - 1)) * 100);

  return (
    <div className="ni-root">
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .ni-root  { width: 100%; max-width: 100%; overflow-x: hidden; }
        .ni-empty { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; color: #adb5bd; }

        /* ── Page header ── */
        .ni-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }
        .ni-page-title  { font-size: 18px; font-weight: 800; color: #212529; margin: 0; }
        .ni-page-sub    { font-size: 13px; color: #adb5bd; margin: 3px 0 0; }
        .ni-btn-back-page {
          height: 40px; padding: 0 18px; border-radius: 10px;
          border: 1.5px solid #dee2e6; background: #fff; color: #495057;
          font-size: 14px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px;
          transition: all 0.18s; white-space: nowrap; flex-shrink: 0;
        }
        .ni-btn-back-page:hover { background: #f8f9fa; border-color: #adb5bd; }

        /* ── Progress ── */
        .ni-progress {
          height: 8px; background: #f1f3f5;
          border-radius: 99px; margin-bottom: 24px; overflow: hidden;
        }
        .ni-progress-fill {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, var(--primary, #e63946), #ff6b6b);
          transition: width 0.4s cubic-bezier(.4,0,.2,1);
        }

        /* ── Steps ── */
        .ni-steps-scroll {
          overflow-x: auto; -webkit-overflow-scrolling: touch;
          scrollbar-width: none; margin-bottom: 28px; padding-bottom: 4px;
        }
        .ni-steps-scroll::-webkit-scrollbar { display: none; }
        .ni-steps-track {
          display: flex; align-items: flex-start;
          position: relative; min-width: max-content; padding: 4px 8px 0;
        }
        .ni-steps-track::before {
          content: ''; position: absolute;
          top: 31px; left: 44px; right: 44px;
          height: 2px; background: #dee2e6; z-index: 0;
        }
        .ni-step {
          display: flex; flex-direction: column; align-items: center;
          cursor: pointer; padding: 0 14px; min-width: 80px;
          position: relative; z-index: 1;
          -webkit-tap-highlight-color: transparent; user-select: none;
        }
        .ni-step-circle {
          width: 58px; height: 58px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; border: 2.5px solid #dee2e6; background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.25s cubic-bezier(.4,0,.2,1);
        }
        .ni-step.done .ni-step-circle   { background: var(--ok,#2a9d8f); border-color: var(--ok,#2a9d8f); color:#fff; font-size:22px; }
        .ni-step.active .ni-step-circle { background: var(--primary,#e63946); border-color: var(--primary,#e63946); box-shadow:0 4px 20px rgba(230,57,70,0.4); transform:scale(1.14); }
        .ni-step-label {
          margin-top: 8px; font-size: 11px; font-weight: 700;
          color: #adb5bd; text-transform: uppercase; letter-spacing: 0.5px;
          white-space: nowrap; transition: color 0.2s;
        }
        .ni-step.done .ni-step-label   { color: var(--ok,#2a9d8f); }
        .ni-step.active .ni-step-label { color: var(--primary,#e63946); }

        /* ── Card ── */
        .ni-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e9ecef; border-left: 5px solid var(--accent,#ccc);
          box-shadow: 0 2px 14px rgba(0,0,0,0.05); margin-bottom: 24px; overflow: hidden;
        }
        .ni-card-head {
          padding: 16px 20px; border-bottom: 1px solid #f1f3f5;
          font-size: 16px; font-weight: 700; color: #212529;
          display: flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, color-mix(in srgb, var(--accent,#ccc) 8%, transparent), transparent);
        }

        /* ── Responsive Grid ── */
        .ni-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px 20px;
          padding: 20px;
        }
        @media (max-width: 768px) {
          .ni-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .ni-grid { grid-template-columns: 1fr; gap: 12px; padding: 16px; }
        }
        .ni-field-2 { grid-column: 1 / -1; }
        .ni-field-1 { grid-column: span 1; }
        .ni-field   { display: flex; flex-direction: column; }

        /* ── Inputs ── */
        .ni-label {
          font-size: 12px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.6px; color: #6c757d; margin-bottom: 7px;
        }
        .ni-input {
          width: 100%; height: 48px; font-size: 15px;
          border-radius: 10px; border: 1.5px solid #dee2e6;
          padding: 0 14px; color: #212529; background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none; appearance: none;
        }
        .ni-input:focus {
          border-color: var(--primary,#e63946);
          box-shadow: 0 0 0 3px rgba(230,57,70,0.13);
          outline: none;
        }
        .ni-select { cursor: pointer; }
        textarea.ni-input { height: auto; padding: 12px 14px; }

        /* ── Alert ── */
        .ni-alert { border-radius: 10px; padding: 12px 16px; font-size: 13px; line-height: 1.5; }
        .ni-alert-danger { background:#fff3f3; border:1px solid #ffcdd2; color:#c0392b; margin: 14px 0 0; }

        /* ── Action bar ── */
        .ni-action-bar {
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 12px; margin-top: 28px;
          padding-top: 20px; border-top: 1px solid #e9ecef;
        }
        .ni-btn {
          display: inline-flex; align-items: center; gap: 6px;
          border: none; border-radius: 12px; cursor: pointer;
          font-weight: 600; font-size: 15px; height: 48px; padding: 0 24px;
          transition: all 0.2s; white-space: nowrap;
        }
        .ni-btn-back    { background:#fff; border:1.5px solid #dee2e6; color:#495057; }
        .ni-btn-back:hover { background:#f8f9fa; border-color:#adb5bd; }
        .ni-btn-draft   { background:#fff; border:1.5px solid #dee2e6; color:#495057; }
        .ni-btn-draft:hover:not(:disabled) { background:#f8f9fa; }
        .ni-btn-draft:disabled { opacity:.6; cursor:not-allowed; }
        .ni-btn-next    { background:var(--primary,#e63946); color:#fff; padding:0 32px; box-shadow:0 4px 14px rgba(230,57,70,.3); }
        .ni-btn-next:hover { filter:brightness(1.08); transform:translateY(-1px); }
        .ni-btn-complete { background:linear-gradient(135deg,#2a9d8f,#21867a); color:#fff; padding:0 36px; height:52px; font-size:16px; border-radius:14px; box-shadow:0 4px 16px rgba(42,157,143,.35); }
        .ni-btn-complete:hover:not(:disabled) { filter:brightness(1.08); transform:translateY(-1px); }
        .ni-btn-complete:disabled { opacity:.7; cursor:not-allowed; }

        @media (max-width: 480px) {
          .ni-step        { min-width: 68px; padding: 0 8px; }
          .ni-step-circle { width: 48px; height: 48px; font-size: 20px; }
          .ni-step-label  { font-size: 10px; }
          .ni-steps-track::before { top: 25px; }
          .ni-btn         { height: 44px; font-size: 14px; padding: 0 18px; }
          .ni-btn-complete { height: 48px; font-size: 15px; }
          .ni-card-head   { font-size: 15px; padding: 14px 16px; }
          .ni-page-title  { font-size: 16px; }
        }
      `}</style>

      {/* Page Header */}
      <div className="ni-page-header">
        <div>
          <p className="ni-page-title">✏️ Edit: {form.vehicleMake} {form.vehicleModel}</p>
          <p className="ni-page-sub">{form.registrationNo || '—'}</p>
        </div>
        <button className="ni-btn-back-page" onClick={() => navigate(`/view/${id}`)}>← Back</button>
      </div>

      {/* Progress */}
      <div className="ni-progress">
        <div className="ni-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {/* Steps */}
      <div className="ni-steps-scroll">
        <div className="ni-steps-track">
          {STEPS.map(s => (
            <div
              key={s.id}
              className={`ni-step ${step === s.id ? 'active' : step > s.id ? 'done' : ''}`}
              onClick={() => setSt(s.id)}
            >
              <div className="ni-step-circle">{step > s.id ? '✓' : s.icon}</div>
              <div className="ni-step-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      {renderStep()}

      {/* Action bar */}
      <div className="ni-action-bar">
        <div>
          {step > 0 && (
            <button className="ni-btn ni-btn-back" onClick={() => setSt(s => s - 1)}>← Back</button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="ni-btn ni-btn-draft" onClick={() => save('draft')} disabled={saving}>
            💾 Save Draft
          </button>
          {step < STEPS.length - 1 ? (
            <button className="ni-btn ni-btn-next" onClick={() => setSt(s => s + 1)}>Next →</button>
          ) : (
            <button className="ni-btn ni-btn-complete" onClick={() => save('completed')} disabled={saving}>
              {saving ? <><span className="spinner-sm me-1" />Saving...</> : '✅ Save & Complete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
