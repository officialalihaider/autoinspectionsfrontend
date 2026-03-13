// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { inspectionAPI, getPDFUrl } from '../utils/api';
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-toastify';

// const rc = r => r>=7?'var(--ok)':r>=4?'var(--warn)':'var(--primary2)';

// export default function InspectionList() {
//   const [data,   setData]  = useState([]);
//   const [loading,setLd]    = useState(true);
//   const [search, setSrch]  = useState('');
//   const [status, setStat]  = useState('');
//   const [page,   setPg]    = useState(1);
//   const [pages,  setPages] = useState(1);
//   const [total,  setTotal] = useState(0);
//   const [delId,  setDelId] = useState(null);
//   const navigate           = useNavigate();
//   const { user }           = useAuth();

//   const load = useCallback(async () => {
//     setLd(true);
//     try {
//       const r = await inspectionAPI.getAll({ search, status, page, limit: 10 });
//       setData(r.data.data); setPages(r.data.pages); setTotal(r.data.total);
//     } catch { toast.error('Failed to load'); }
//     finally { setLd(false); }
//   }, [search, status, page]);

//   useEffect(() => { load(); }, [load]);

//   const doDelete = async () => {
//     try { await inspectionAPI.delete(delId); toast.success('Deleted'); setDelId(null); load(); }
//     catch { toast.error('Delete failed'); }
//   };

//   return (
//     <div>
//       {/* Toolbar */}
//       <div className="card mb-4">
//         <div className="card-body py-3">
//           <div className="d-flex flex-wrap gap-3 align-items-center">
//             <div className="position-relative flex-grow-1" style={{minWidth:'180px'}}>
//               <span style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',fontSize:'16px',pointerEvents:'none',zIndex:2}}>🔍</span>
//               <input className="form-control" style={{paddingLeft:'42px'}} placeholder="Search vehicle, reg, customer..."
//                 value={search} onChange={e=>{setSrch(e.target.value);setPg(1)}}/>
//             </div>
//             <select className="form-select" style={{width:'160px',flexShrink:0}} value={status} onChange={e=>{setStat(e.target.value);setPg(1)}}>
//               <option value="">All Status</option>
//               <option value="completed">✅ Completed</option>
//               <option value="draft">📝 Draft</option>
//             </select>
//             <button className="btn btn-outline-secondary" onClick={load} title="Refresh">🔄</button>
//             {user?.role==='admin' && (
//               <button className="btn btn-danger" onClick={()=>navigate('/new')}>➕ New Inspection</button>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="card">
//         <div className="card-header d-flex align-items-center gap-2">
//           <span style={{fontSize:'20px'}}>📋</span>
//           <span>Inspections</span>
//           <span className="badge bg-danger ms-1">{total}</span>
//         </div>

//         {loading ? (
//           <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading...</p></div>
//         ) : data.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">🚗</div>
//             <p className="mb-3" style={{fontSize:'16px'}}>No inspections found</p>
//             {user?.role==='admin' && <button className="btn btn-danger" onClick={()=>navigate('/new')}>➕ Create First Inspection</button>}
//           </div>
//         ) : (
//           <div className="table-responsive">
//             <table className="table table-hover mb-0">
//               <thead>
//                 <tr>
//                   <th>Vehicle</th>
//                   <th>Reg No.</th>
//                   <th className="d-none d-md-table-cell">Customer</th>
//                   <th className="d-none d-sm-table-cell">Date</th>
//                   <th>Rating</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map(insp => (
//                   <tr key={insp._id}>
//                     <td>
//                       <div className="fw-bold" style={{fontSize:'15px'}}>{insp.vehicleMake}</div>
//                       <div className="text-muted-ag">{insp.vehicleModel}{insp.modelYear ? ` · ${insp.modelYear}` : ''}</div>
//                     </td>
//                     <td><span className="mono" style={{fontSize:'13px'}}>{insp.registrationNo || '—'}</span></td>
//                     <td className="d-none d-md-table-cell">{insp.customerName || <span className="text-muted-ag">—</span>}</td>
//                     <td className="d-none d-sm-table-cell text-muted-ag">{new Date(insp.inspectionDate).toLocaleDateString('en-PK')}</td>
//                     <td>
//                       <span style={{fontSize:'22px',fontWeight:'900',color:rc(insp.ratings?.overall||0)}}>{insp.ratings?.overall||0}</span>
//                       <span className="text-muted-ag" style={{fontSize:'12px'}}>/10</span>
//                     </td>
//                     <td>
//                       <div className="d-flex flex-column gap-1">
//                         <span className={`badge ${insp.status==='completed'?'bg-success':'bg-warning text-dark'}`}>
//                           {insp.status==='completed'?'✅ Done':'📝 Draft'}
//                         </span>
//                         {insp.reportedIssue?.hasIssue && !insp.reportedIssue?.isResolved && (
//                           <span className="badge bg-danger">⚠️ Issue</span>
//                         )}
//                       </div>
//                     </td>
//                     <td>
//                       <div className="d-flex flex-wrap gap-2">
//                         <button className="btn btn-outline-secondary btn-sm" onClick={()=>navigate(`/view/${insp._id}`)}>👁</button>
//                         {user?.role==='admin' && <>
//                           <button className="btn btn-outline-secondary btn-sm" onClick={()=>navigate(`/edit/${insp._id}`)}>✏️</button>
//                           <button className="btn btn-outline-success btn-sm" onClick={()=>window.open(getPDFUrl(insp._id),'_blank')}>📄</button>
//                           <button className="btn btn-outline-danger btn-sm" onClick={()=>setDelId(insp._id)}>🗑</button>
//                         </>}
//                         {user?.role==='user' && (
//                           <button className="btn btn-outline-success btn-sm" onClick={()=>window.open(getPDFUrl(insp._id),'_blank')}>📄 PDF</button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {pages > 1 && (
//           <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
//             <span className="text-muted-ag">Page {page} of {pages} · {total} total</span>
//             <nav><ul className="pagination mb-0">
//               <li className={`page-item ${page===1?'disabled':''}`}><button className="page-link" onClick={()=>setPg(1)}>«</button></li>
//               <li className={`page-item ${page===1?'disabled':''}`}><button className="page-link" onClick={()=>setPg(p=>p-1)}>‹</button></li>
//               {Array.from({length:Math.min(5,pages)},(_,i)=>{
//                 const p=Math.max(1,Math.min(page-2,pages-4))+i;
//                 return p<=pages?<li key={p} className={`page-item ${p===page?'active':''}`}><button className="page-link" onClick={()=>setPg(p)}>{p}</button></li>:null;
//               })}
//               <li className={`page-item ${page===pages?'disabled':''}`}><button className="page-link" onClick={()=>setPg(p=>p+1)}>›</button></li>
//               <li className={`page-item ${page===pages?'disabled':''}`}><button className="page-link" onClick={()=>setPg(pages)}>»</button></li>
//             </ul></nav>
//           </div>
//         )}
//       </div>

//       {/* Delete Modal */}
//       {delId && (
//         <div className="modal show d-block" style={{background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)'}}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">⚠️ Delete Inspection?</h5>
//                 <button className="btn-close" onClick={()=>setDelId(null)}/>
//               </div>
//               <div className="modal-body"><p style={{fontSize:'15px'}}>This action cannot be undone. The inspection will be permanently deleted.</p></div>
//               <div className="modal-footer">
//                 <button className="btn btn-outline-secondary" onClick={()=>setDelId(null)}>Cancel</button>
//                 <button className="btn btn-danger" onClick={doDelete}>🗑 Delete</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { inspectionAPI, getPDFUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const rc = r => r >= 7 ? 'var(--ok)' : r >= 4 ? 'var(--warn)' : 'var(--primary2)';

export default function InspectionList() {
  const [data,    setData]  = useState([]);
  const [loading, setLd]    = useState(true);
  const [search,  setSrch]  = useState('');
  const [status,  setStat]  = useState('');
  const [page,    setPg]    = useState(1);
  const [pages,   setPages] = useState(1);
  const [total,   setTotal] = useState(0);
  const [delId,   setDelId] = useState(null);
  const navigate            = useNavigate();
  const { user }            = useAuth();

  const load = useCallback(async () => {
    setLd(true);
    try {
      const r = await inspectionAPI.getAll({ search, status, page, limit: 10 });
      setData(r.data.data); setPages(r.data.pages); setTotal(r.data.total);
    } catch { toast.error('Failed to load'); }
    finally { setLd(false); }
  }, [search, status, page]);

  useEffect(() => { load(); }, [load]);

  const doDelete = async () => {
    try {
      await inspectionAPI.delete(delId);
      toast.success('Deleted');
      setDelId(null);
      load();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="il-root">
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .il-root { width: 100%; max-width: 100%; overflow-x: hidden; }

        /* ── Toolbar ── */
        .il-toolbar {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 14px rgba(0,0,0,0.05);
          padding: 16px 20px;
          margin-bottom: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }
        .il-search-wrap {
          position: relative;
          flex: 1 1 200px;
          min-width: 0;
        }
        .il-search-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 15px;
          pointer-events: none;
          z-index: 2;
        }
        .il-input {
          width: 100%;
          height: 44px;
          font-size: 14px;
          border-radius: 10px;
          border: 1.5px solid #dee2e6;
          padding: 0 14px 0 40px;
          color: #212529;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
          appearance: none;
        }
        .il-input:focus {
          border-color: var(--primary, #e63946);
          box-shadow: 0 0 0 3px rgba(230,57,70,0.12);
          outline: none;
        }
        .il-select {
          height: 44px;
          font-size: 14px;
          border-radius: 10px;
          border: 1.5px solid #dee2e6;
          padding: 0 14px;
          color: #212529;
          background: #fff;
          cursor: pointer;
          flex-shrink: 0;
          width: 160px;
          -webkit-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236c757d' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
          transition: border-color 0.2s;
        }
        .il-select:focus {
          border-color: var(--primary, #e63946);
          box-shadow: 0 0 0 3px rgba(230,57,70,0.12);
          outline: none;
        }
        .il-btn-refresh {
          width: 44px; height: 44px; border-radius: 10px;
          border: 1.5px solid #dee2e6; background: #fff;
          font-size: 16px; cursor: pointer; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.18s;
        }
        .il-btn-refresh:hover { background: #f8f9fa; border-color: #adb5bd; }
        .il-btn-new {
          height: 44px; padding: 0 20px; border-radius: 10px;
          border: none; background: var(--primary, #e63946); color: #fff;
          font-size: 14px; font-weight: 700; cursor: pointer; flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(230,57,70,0.28);
          display: flex; align-items: center; gap: 6px;
          transition: all 0.18s; white-space: nowrap;
        }
        .il-btn-new:hover { filter: brightness(1.08); transform: translateY(-1px); }

        /* ── Main card ── */
        .il-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 14px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .il-card-head {
          padding: 15px 20px;
          border-bottom: 1px solid #f1f3f5;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 700;
          color: #212529;
        }
        .il-badge {
          background: var(--primary, #e63946);
          color: #fff;
          border-radius: 99px;
          padding: 2px 10px;
          font-size: 13px;
          font-weight: 700;
        }

        /* ── Empty ── */
        .il-empty {
          display: flex; flex-direction: column;
          align-items: center; padding: 52px 20px; color: #adb5bd;
        }
        .il-empty-icon { font-size: 52px; margin-bottom: 12px; }

        /* ── Desktop table ── */
        .il-table-wrap { overflow-x: auto; }
        .il-table {
          width: 100%; border-collapse: collapse; font-size: 14px;
        }
        .il-table thead tr {
          background: #f8f9fa;
          border-bottom: 2px solid #e9ecef;
        }
        .il-table th {
          padding: 12px 16px;
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.6px;
          color: #6c757d; white-space: nowrap;
        }
        .il-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f3f5;
          vertical-align: middle;
        }
        .il-table tbody tr:hover { background: #fafafa; }
        .il-table tbody tr:last-child td { border-bottom: none; }

        .il-vehicle-name  { font-weight: 700; font-size: 15px; color: #212529; }
        .il-vehicle-sub   { font-size: 12px; color: #adb5bd; margin-top: 2px; }
        .il-reg           { font-family: monospace; font-size: 13px; color: #495057; }
        .il-rating-num    { font-size: 22px; font-weight: 900; line-height: 1; }
        .il-rating-denom  { font-size: 12px; color: #adb5bd; }

        .il-chip {
          display: inline-flex; align-items: center; gap: 4px;
          border-radius: 99px; padding: 3px 10px;
          font-size: 12px; font-weight: 700; white-space: nowrap;
        }
        .il-chip-done    { background: #e8f8f0; color: #1e8449; }
        .il-chip-draft   { background: #fff8e1; color: #7a6500; }
        .il-chip-issue   { background: #fdecea; color: #c0392b; margin-top: 4px; }

        /* action icon buttons */
        .il-icon-btn {
          width: 34px; height: 34px; border-radius: 8px;
          border: 1.5px solid #dee2e6; background: #fff;
          font-size: 15px; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          transition: all 0.18s; flex-shrink: 0;
        }
        .il-icon-btn:hover { background: #f8f9fa; border-color: #adb5bd; }
        .il-icon-btn-green { border-color: #b7e4c7; }
        .il-icon-btn-green:hover { background: #e8f8f0; border-color: #2a9d8f; }
        .il-icon-btn-red   { border-color: #ffcdd2; }
        .il-icon-btn-red:hover   { background: #fdecea; border-color: #e63946; }

        /* ── Mobile cards — shown < 640px ── */
        .il-mobile-list { display: none; padding: 12px; }
        .il-insp-card {
          border: 1px solid #e9ecef;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 12px;
          background: #fff;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }
        .il-insp-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
          gap: 10px;
        }
        .il-insp-card-title { font-weight: 700; font-size: 16px; color: #212529; }
        .il-insp-card-sub   { font-size: 13px; color: #adb5bd; margin-top: 2px; }
        .il-insp-card-rating {
          display: flex; align-items: baseline; gap: 2px; flex-shrink: 0;
        }
        .il-insp-card-meta {
          display: flex; flex-wrap: wrap; gap: 8px;
          align-items: center; margin-bottom: 12px;
        }
        .il-insp-card-date { font-size: 12px; color: #adb5bd; }
        .il-insp-card-reg  { font-family: monospace; font-size: 12px; color: #6c757d; background: #f8f9fa; padding: 2px 8px; border-radius: 6px; }
        .il-insp-card-actions {
          display: flex; gap: 8px; flex-wrap: wrap;
          padding-top: 12px; border-top: 1px solid #f1f3f5;
        }
        .il-insp-card-actions .il-icon-btn { width: auto; padding: 0 14px; font-size: 13px; gap: 5px; }

        @media (max-width: 640px) {
          .il-table-wrap  { display: none; }
          .il-mobile-list { display: block; }
          .il-toolbar     { padding: 12px 14px; gap: 10px; }
          .il-select      { width: 100%; flex: 1 1 120px; }
        }

        /* ── Pagination ── */
        .il-pagination-wrap {
          padding: 14px 20px;
          border-top: 1px solid #f1f3f5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .il-pg-info { font-size: 13px; color: #adb5bd; }
        .il-pg-btns { display: flex; gap: 4px; }
        .il-pg-btn {
          width: 36px; height: 36px; border-radius: 9px;
          border: 1.5px solid #dee2e6; background: #fff;
          font-size: 14px; cursor: pointer; font-weight: 600;
          display: inline-flex; align-items: center; justify-content: center;
          transition: all 0.18s; color: #495057;
        }
        .il-pg-btn:hover:not(:disabled):not(.il-pg-btn-active) { background: #f8f9fa; }
        .il-pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .il-pg-btn-active {
          background: var(--primary, #e63946);
          border-color: var(--primary, #e63946);
          color: #fff;
        }

        /* ── Modal ── */
        .il-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
          z-index: 1050; display: flex;
          align-items: center; justify-content: center; padding: 16px;
        }
        .il-modal {
          background: #fff; border-radius: 18px;
          width: 100%; max-width: 420px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }
        .il-modal-head {
          padding: 18px 20px; border-bottom: 1px solid #f1f3f5;
          display: flex; align-items: center; justify-content: space-between;
          font-size: 16px; font-weight: 700; color: #212529;
          border-radius: 18px 18px 0 0;
        }
        .il-modal-close {
          width: 32px; height: 32px; border-radius: 8px;
          border: none; background: #f1f3f5; cursor: pointer;
          font-size: 16px; display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .il-modal-close:hover { background: #e9ecef; }
        .il-modal-body { padding: 20px; font-size: 15px; color: #212529; }
        .il-modal-body p { margin: 0 0 8px; }
        .il-modal-body p:last-child { margin: 0; font-size: 13px; color: #6c757d; }
        .il-modal-foot {
          padding: 14px 20px; border-top: 1px solid #f1f3f5;
          display: flex; justify-content: flex-end; gap: 10px;
          border-radius: 0 0 18px 18px;
        }
        .il-action-btn {
          height: 44px; padding: 0 22px; border-radius: 10px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          border: none; transition: all 0.18s;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .il-action-cancel { background: #fff; border: 1.5px solid #dee2e6; color: #495057; }
        .il-action-cancel:hover { background: #f8f9fa; }
        .il-action-del { background: var(--primary, #e63946); color: #fff; box-shadow: 0 4px 12px rgba(230,57,70,0.28); }
        .il-action-del:hover { filter: brightness(1.08); }
      `}</style>

      {/* ── Toolbar ── */}
      <div className="il-toolbar">
        <div className="il-search-wrap">
          <span className="il-search-icon">🔍</span>
          <input
            className="il-input"
            placeholder="Search vehicle, reg, customer..."
            value={search}
            onChange={e => { setSrch(e.target.value); setPg(1); }}
          />
        </div>
        <select className="il-select" value={status} onChange={e => { setStat(e.target.value); setPg(1); }}>
          <option value="">All Status</option>
          <option value="completed">✅ Completed</option>
          <option value="draft">📝 Draft</option>
        </select>
        <button className="il-btn-refresh" onClick={load} title="Refresh">🔄</button>
        {user?.role === 'admin' && (
          <button className="il-btn-new" onClick={() => navigate('/new')}>➕ New Inspection</button>
        )}
      </div>

      {/* ── Main card ── */}
      <div className="il-card">
        <div className="il-card-head">
          <span style={{ fontSize: '20px' }}>📋</span>
          <span>Inspections</span>
          <span className="il-badge">{total}</span>
        </div>

        {loading ? (
          <div className="il-empty">
            <div className="il-empty-icon">⏳</div>
            <p>Loading...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="il-empty">
            <div className="il-empty-icon">🚗</div>
            <p style={{ fontSize: '16px', marginBottom: '16px', color: '#495057' }}>No inspections found</p>
            {user?.role === 'admin' && (
              <button className="il-btn-new" onClick={() => navigate('/new')}>➕ Create First Inspection</button>
            )}
          </div>
        ) : (
          <>
            {/* ── Desktop Table ── */}
            <div className="il-table-wrap">
              <table className="il-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Reg No.</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(insp => (
                    <tr key={insp._id}>
                      <td>
                        <div className="il-vehicle-name">{insp.vehicleMake}</div>
                        <div className="il-vehicle-sub">{insp.vehicleModel}{insp.modelYear ? ` · ${insp.modelYear}` : ''}</div>
                      </td>
                      <td><span className="il-reg">{insp.registrationNo || '—'}</span></td>
                      <td style={{ color: '#495057' }}>{insp.customerName || <span style={{ color: '#adb5bd' }}>—</span>}</td>
                      <td style={{ color: '#adb5bd', fontSize: '13px' }}>
                        {new Date(insp.inspectionDate).toLocaleDateString('en-PK')}
                      </td>
                      <td>
                        <span className="il-rating-num" style={{ color: rc(insp.ratings?.overall || 0) }}>
                          {insp.ratings?.overall || 0}
                        </span>
                        <span className="il-rating-denom">/10</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span className={`il-chip ${insp.status === 'completed' ? 'il-chip-done' : 'il-chip-draft'}`}>
                            {insp.status === 'completed' ? '✅ Done' : '📝 Draft'}
                          </span>
                          {insp.reportedIssue?.hasIssue && !insp.reportedIssue?.isResolved && (
                            <span className="il-chip il-chip-issue">⚠️ Issue</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button className="il-icon-btn" title="View" onClick={() => navigate(`/view/${insp._id}`)}>👁</button>
                          {user?.role === 'admin' && <>
                            <button className="il-icon-btn" title="Edit" onClick={() => navigate(`/edit/${insp._id}`)}>✏️</button>
                            <button className="il-icon-btn il-icon-btn-green" title="PDF" onClick={() => window.open(getPDFUrl(insp._id), '_blank')}>📄</button>
                            <button className="il-icon-btn il-icon-btn-red" title="Delete" onClick={() => setDelId(insp._id)}>🗑</button>
                          </>}
                          {user?.role === 'user' && (
                            <button className="il-icon-btn il-icon-btn-green" title="PDF" onClick={() => window.open(getPDFUrl(insp._id), '_blank')}>📄</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ── */}
            <div className="il-mobile-list">
              {data.map(insp => (
                <div className="il-insp-card" key={insp._id}>
                  <div className="il-insp-card-top">
                    <div>
                      <div className="il-insp-card-title">{insp.vehicleMake} {insp.vehicleModel}</div>
                      <div className="il-insp-card-sub">
                        {insp.customerName || 'No customer'}{insp.modelYear ? ` · ${insp.modelYear}` : ''}
                      </div>
                    </div>
                    <div className="il-insp-card-rating">
                      <span className="il-rating-num" style={{ color: rc(insp.ratings?.overall || 0), fontSize: '26px' }}>
                        {insp.ratings?.overall || 0}
                      </span>
                      <span className="il-rating-denom">/10</span>
                    </div>
                  </div>

                  <div className="il-insp-card-meta">
                    {insp.registrationNo && <span className="il-insp-card-reg">{insp.registrationNo}</span>}
                    <span className={`il-chip ${insp.status === 'completed' ? 'il-chip-done' : 'il-chip-draft'}`}>
                      {insp.status === 'completed' ? '✅ Done' : '📝 Draft'}
                    </span>
                    {insp.reportedIssue?.hasIssue && !insp.reportedIssue?.isResolved && (
                      <span className="il-chip il-chip-issue">⚠️ Issue</span>
                    )}
                    <span className="il-insp-card-date">
                      {new Date(insp.inspectionDate).toLocaleDateString('en-PK')}
                    </span>
                  </div>

                  <div className="il-insp-card-actions">
                    <button className="il-icon-btn" onClick={() => navigate(`/view/${insp._id}`)}>👁 View</button>
                    {user?.role === 'admin' && <>
                      <button className="il-icon-btn" onClick={() => navigate(`/edit/${insp._id}`)}>✏️ Edit</button>
                      <button className="il-icon-btn il-icon-btn-green" onClick={() => window.open(getPDFUrl(insp._id), '_blank')}>📄 PDF</button>
                      <button className="il-icon-btn il-icon-btn-red" onClick={() => setDelId(insp._id)}>🗑 Del</button>
                    </>}
                    {user?.role === 'user' && (
                      <button className="il-icon-btn il-icon-btn-green" onClick={() => window.open(getPDFUrl(insp._id), '_blank')}>📄 PDF</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Pagination ── */}
        {pages > 1 && (
          <div className="il-pagination-wrap">
            <span className="il-pg-info">Page {page} of {pages} · {total} total</span>
            <div className="il-pg-btns">
              <button className="il-pg-btn" disabled={page === 1} onClick={() => setPg(1)}>«</button>
              <button className="il-pg-btn" disabled={page === 1} onClick={() => setPg(p => p - 1)}>‹</button>
              {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, pages - 4)) + i;
                return p <= pages ? (
                  <button
                    key={p}
                    className={`il-pg-btn ${p === page ? 'il-pg-btn-active' : ''}`}
                    onClick={() => setPg(p)}
                  >{p}</button>
                ) : null;
              })}
              <button className="il-pg-btn" disabled={page === pages} onClick={() => setPg(p => p + 1)}>›</button>
              <button className="il-pg-btn" disabled={page === pages} onClick={() => setPg(pages)}>»</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Modal ── */}
      {delId && (
        <div className="il-modal-overlay" onClick={e => e.target === e.currentTarget && setDelId(null)}>
          <div className="il-modal">
            <div className="il-modal-head">
              <span>⚠️ Delete Inspection?</span>
              <button className="il-modal-close" onClick={() => setDelId(null)}>✕</button>
            </div>
            <div className="il-modal-body">
              <p>This action cannot be undone.</p>
              <p>The inspection will be permanently deleted.</p>
            </div>
            <div className="il-modal-foot">
              <button className="il-action-btn il-action-cancel" onClick={() => setDelId(null)}>Cancel</button>
              <button className="il-action-btn il-action-del" onClick={doDelete}>🗑 Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}