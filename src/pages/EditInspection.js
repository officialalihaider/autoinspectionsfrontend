import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChecklistSection, RatingsSection } from '../components/forms/ChecklistSection';
import CarDiagram from '../components/common/CarDiagram';
import { inspectionAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STEPS=[{id:0,label:'Vehicle',icon:'🚗'},{id:1,label:'Diagram',icon:'🗺️'},{id:2,label:'Exterior',icon:'🔧'},{id:3,label:'Interior',icon:'🪑'},{id:4,label:'Electrics',icon:'⚡'},{id:5,label:'Mechanic',icon:'⚙️'},{id:6,label:'Heating',icon:'❄️'},{id:7,label:'Tyres',icon:'🛞'},{id:8,label:'Ratings',icon:'⭐'}];

export default function EditInspection() {
  const {id}=useParams(); const navigate=useNavigate(); const {user}=useAuth();
  const [step,setSt]=useState(0); const [loading,setLd]=useState(true);
  const [saving,setSv]=useState(false); const [form,setForm]=useState(null);

  useEffect(()=>{ if(user&&user.role!=='admin'){navigate('/');toast.error('Admin only');} },[user]);
  useEffect(()=>{
    inspectionAPI.getOne(id)
      .then(r=>setForm({diagramZones:{},...r.data.data}))
      .catch(()=>{toast.error('Not found');navigate('/inspections');})
      .finally(()=>setLd(false));
  },[id]);

  const setF=useCallback((k,v)=>setForm(p=>({...p,[k]:v})),[]);
  const updateList=useCallback(lk=>(idx,f,v)=>setForm(p=>({...p,[lk]:p[lk].map((it,i)=>i===idx?{...it,[f]:v}:it)})),[]);
  const setRating=useCallback((k,v)=>setForm(p=>({...p,ratings:{...p.ratings,[k]:v}})),[]);
  const diagZone=useCallback(z=>{if(z.newStatus!==undefined)setForm(p=>({...p,diagramZones:{...(p.diagramZones||{}),[z.id]:z.newStatus}}));},[]);

  const save=async status=>{
    setSv(true);
    try{await inspectionAPI.update(id,{...form,status});toast.success('✅ Updated!');navigate(`/view/${id}`);}
    catch{toast.error('Update failed');}finally{setSv(false);}
  };

  if(loading) return <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading...</p></div>;
  if(!form) return null;

  const FI=({label,fk,type='text',placeholder='',col='col-12 col-sm-6 col-md-4'})=>(
    <div className={col}><div className="mb-3">
      <label className="form-label">{label}</label>
      <input className="form-control" type={type} placeholder={placeholder} value={form[fk]||''} onChange={e=>setF(fk,e.target.value)}/>
    </div></div>
  );
  const FS=({label,fk,opts,col='col-12 col-sm-6 col-md-4'})=>(
    <div className={col}><div className="mb-3">
      <label className="form-label">{label}</label>
      <select className="form-select" value={form[fk]||''} onChange={e=>setF(fk,e.target.value)}>
        {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
      </select>
    </div></div>
  );

  const renderStep=()=>{
    switch(step){
      case 0:return(
        <>
          <div className="card mb-4" style={{borderLeft:'4px solid var(--primary)'}}>
            <div className="card-header"><span style={{fontSize:'22px'}}>🚗</span> Vehicle</div>
            <div className="card-body"><div className="row g-0">
              <FI label="Make *" fk="vehicleMake"/><FI label="Model" fk="vehicleModel"/><FI label="Year" fk="modelYear"/>
              <FI label="Engine" fk="engineCapacity"/><FI label="Chassis" fk="chassisNo"/><FI label="Reg No." fk="registrationNo"/>
              <FI label="Color" fk="exteriorColor"/><FI label="Date" fk="inspectionDate" type="date"/>
              <FS label="Transmission" fk="transmissionType" opts={[['manual','Manual'],['automatic','Automatic']]}/>
              <FS label="Drive" fk="driveType" opts={[['2wd','2WD'],['4wd','4WD'],['awd','AWD']]}/>
              <FS label="Fuel" fk="engineType" opts={[['petrol','Petrol'],['diesel','Diesel'],['cng','CNG'],['electric','Electric'],['hybrid','Hybrid']]}/>
            </div></div>
          </div>
          <div className="card mb-4" style={{borderLeft:'4px solid #448aff'}}>
            <div className="card-header"><span style={{fontSize:'22px'}}>👤</span> Customer</div>
            <div className="card-body"><div className="row g-0">
              <FI label="Name" fk="customerName" col="col-12 col-sm-6"/>
              <FI label="Phone" fk="customerPhone" col="col-12 col-sm-6"/>
              <FI label="Email" fk="customerEmail" type="email" col="col-12"/>
            </div></div>
          </div>
          <div className="card mb-4" style={{borderLeft:'4px solid var(--warn)'}}>
            <div className="card-header"><span style={{fontSize:'22px'}}>🔍</span> Inspector</div>
            <div className="card-body"><div className="row g-0">
              <FI label="Inspector Name" fk="inspectorName"/><FI label="Signature" fk="inspectorSign"/><FI label="Stamp" fk="inspectorStamp"/>
            </div></div>
          </div>
          <div className="card" style={{borderLeft:'4px solid var(--ok)'}}>
            <div className="card-header"><span style={{fontSize:'22px'}}>📝</span> Notes</div>
            <div className="card-body">
              <textarea className="form-control" rows="3" value={form.notes||''} onChange={e=>setF('notes',e.target.value)}/>
            </div>
          </div>
        </>
      );
      case 1:return<div className="card"><div className="card-body"><CarDiagram zones={form.diagramZones||{}} onZoneClick={diagZone}/></div></div>;
      case 2:return<ChecklistSection title="1. Exterior Details" icon="🔧" items={form.exteriorDetails} onChange={updateList('exteriorDetails')}/>;
      case 3:return<ChecklistSection title="2. Interior & Comfort" icon="🪑" items={form.interiorComfort} onChange={updateList('interiorComfort')}/>;
      case 4:return<ChecklistSection title="3. Electrical" icon="⚡" items={form.electrical} onChange={updateList('electrical')}/>;
      case 5:return<ChecklistSection title="4. Mechanical" icon="⚙️" items={form.mechanical} onChange={updateList('mechanical')}/>;
      case 6:return<ChecklistSection title="5. Heating & Cooling" icon="❄️" items={form.heatingCooling} onChange={updateList('heatingCooling')} type="heating"/>;
      case 7:return<ChecklistSection title="6. Tyres & Shocks" icon="🛞" items={form.tyresShocks} onChange={updateList('tyresShocks')} type="tyres"/>;
      case 8:return<RatingsSection ratings={form.ratings} onChange={setRating}/>;
      default:return null;
    }
  };
  const pct=Math.round((step/(STEPS.length-1))*100);
  return(
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div><h5 className="fw-bold mb-0">✏️ Edit: {form.vehicleMake} {form.vehicleModel}</h5><p className="text-muted-ag mb-0">{form.registrationNo||'—'}</p></div>
        <button className="btn btn-outline-secondary" onClick={()=>navigate(`/view/${id}`)}>← Back</button>
      </div>
      <div className="progress mb-3"><div className="progress-bar" style={{width:`${pct}%`}}/></div>
      <div className="steps-wrap mb-4"><div className="steps-bar">
        {STEPS.map(s=><div key={s.id} className={`step-item ${step===s.id?'active':step>s.id?'done':''}`} onClick={()=>setSt(s.id)}>
          <span className="step-icon">{step>s.id?'✓':s.icon}</span><div className="step-label">{s.label}</div>
        </div>)}
      </div></div>
      {renderStep()}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4 pt-3" style={{borderTop:'1px solid var(--border)'}}>
        <div>{step>0&&<button className="btn btn-outline-secondary" onClick={()=>setSt(s=>s-1)}>← Back</button>}</div>
        <div className="d-flex gap-3 flex-wrap">
          <button className="btn btn-outline-secondary" onClick={()=>save('draft')} disabled={saving}>💾 Draft</button>
          {step<STEPS.length-1
            ?<button className="btn btn-danger" onClick={()=>setSt(s=>s+1)}>Next →</button>
            :<button className="btn btn-success btn-lg" onClick={()=>save('completed')} disabled={saving}>
              {saving?<><span className="spinner-sm me-2"/>Saving...</>:'✅ Save & Complete'}</button>
          }
        </div>
      </div>
    </div>
  );
}
