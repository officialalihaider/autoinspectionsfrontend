import React from 'react';

export function ChecklistSection({ title, icon, items, onChange, type='ok_notok' }) {
  const done = items.filter(i=>i.status!=='na').length;
  const ok   = items.filter(i=>['ok','excellent','alloys'].includes(i.status)).length;
  const bad  = items.filter(i=>['not_ok','not_working'].includes(i.status)).length;
  return (
    <div className="card mb-4">
      <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <span style={{fontSize:'22px'}}>{icon}</span>
          <span>{title}</span>
        </div>
        <div className="d-flex gap-2 align-items-center">
          {ok>0  && <span className="badge" style={{background:'var(--okbg)',color:'var(--ok)',border:'1px solid rgba(0,200,83,0.25)'}}>✓ {ok}</span>}
          {bad>0 && <span className="badge" style={{background:'var(--pbg)',color:'var(--primary2)',border:'1px solid rgba(229,57,53,0.25)'}}>✗ {bad}</span>}
          <span className="badge bg-secondary">{done}/{items.length}</span>
        </div>
      </div>
      <div className="card-body p-0">
        {items.map((item, idx) => (
          <div key={idx} className="cl-item" style={{background:idx%2===0?'transparent':'rgba(0,0,0,0.015)'}}>
            <div className="cl-name">{item.name}</div>
            <div className="cl-btns">
              {type==='ok_notok' && <>
                <button type="button" className={`status-btn ok ${item.status==='ok'?'sel':''}`} onClick={()=>onChange(idx,'status','ok')}>✓ OK</button>
                <button type="button" className={`status-btn notok ${item.status==='not_ok'?'sel':''}`} onClick={()=>onChange(idx,'status','not_ok')}>✗ Not OK</button>
              </>}
              {type==='heating' && <>
                <button type="button" className={`status-btn excellent ${item.status==='excellent'?'sel':''}`} onClick={()=>onChange(idx,'status','excellent')}>★ Excellent</button>
                <button type="button" className={`status-btn moderate ${item.status==='moderate'?'sel':''}`} onClick={()=>onChange(idx,'status','moderate')}>◎ Moderate</button>
                <button type="button" className={`status-btn notworking ${item.status==='not_working'?'sel':''}`} onClick={()=>onChange(idx,'status','not_working')}>✗ Not Working</button>
              </>}
              {type==='tyres' && (
                item.name==='Rims' ? <>
                  <button type="button" className={`status-btn alloys ${item.status==='alloys'?'sel':''}`} onClick={()=>onChange(idx,'status','alloys')}>◆ Alloys</button>
                  <button type="button" className={`status-btn normal ${item.status==='normal'?'sel':''}`} onClick={()=>onChange(idx,'status','normal')}>◇ Normal</button>
                </> : <>
                  <button type="button" className={`status-btn excellent ${item.status==='excellent'?'sel':''}`} onClick={()=>onChange(idx,'status','excellent')}>★ Excellent</button>
                  <button type="button" className={`status-btn moderate ${item.status==='moderate'?'sel':''}`} onClick={()=>onChange(idx,'status','moderate')}>◎ Moderate</button>
                </>
              )}
            </div>
            {(type==='ok_notok'||type==='tyres') && item.name!=='Rims' && (
              <div className="cl-remarks">
                <input className="cl-remark-inp" placeholder="Remarks..." value={item.remarks||''}
                  onChange={e=>onChange(idx,'remarks',e.target.value)}/>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RatingsSection({ ratings, onChange }) {
  const fields = [
    {k:'exterior',l:'🚗 Exterior'},{k:'interior',l:'🪑 Interior'},
    {k:'electrical',l:'⚡ Electrical'},{k:'mechanical',l:'⚙️ Mechanical'},
    {k:'heatingCooling',l:'❄️ Heating/Cooling'},{k:'tyresShocks',l:'🛞 Tyres & Shocks'},
    {k:'overall',l:'⭐ Overall Rating'},
  ];
  const rc = v => v>=7?'var(--ok)':v>=4?'var(--warn)':'var(--primary2)';
  const rl = v => v>=8?'Excellent':v>=6?'Good':v>=4?'Average':'Poor';
  return (
    <div className="card mb-4">
      <div className="card-header"><span style={{fontSize:'22px'}}>⭐</span> Final Ratings (0–10)</div>
      <div className="card-body">
        <div className="row g-4">
          {fields.map(({k,l}) => {
            const val = ratings[k]||0;
            return (
              <div key={k} className="col-12 col-md-6">
                <div className="rating-item">
                  <div className="rating-head">
                    <span className="rating-name">{l}</span>
                    <div className="d-flex align-items-center gap-2">
                      <span className="rating-val" style={{color:rc(val)}}>{val}</span>
                      <span style={{fontSize:'13px',color:'var(--text3)'}}>/10</span>
                      <span style={{fontSize:'13px',fontWeight:700,color:rc(val)}}>({rl(val)})</span>
                    </div>
                  </div>
                  <input type="range" min="0" max="10" step="0.5" value={val}
                    onChange={e=>onChange(k,parseFloat(e.target.value))}
                    style={{accentColor:rc(val)}}/>
                  <div className="d-flex justify-content-between" style={{fontSize:'11px',color:'var(--text3)',marginTop:'3px'}}>
                    <span>0 Poor</span><span>5 Average</span><span>10 Best</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
