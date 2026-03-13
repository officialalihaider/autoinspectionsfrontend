import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useTheme } from '../src/context/ThemeContext';
import { useAuth } from '../src/context/AuthContext';
import AuthPage      from '../src/pages/AuthPage';
import Dashboard     from '../src/pages/Dashboard';
import InspectionList from '../src/pages/InspectionList';
import NewInspection  from '../src/pages/NewInspection';
import EditInspection from '../src/pages/EditInspection';
import ViewInspection from '../src/pages/ViewInspection';
import UsersPage      from '../src/pages/UsersPage';

function Protected({ children }) {
  const { isAuth, loading } = useAuth();
  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'16px',background:'var(--bg)'}}>
      <div style={{width:'46px',height:'46px',border:'3px solid var(--border)',borderTopColor:'var(--primary)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{color:'var(--text2)',fontSize:'15px'}}>Loading AutoGemz...</p>
    </div>
  );
  return isAuth ? children : <Navigate to="/auth" replace />;
}

function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button className={`theme-toggle-btn ${isDark?'dark':'light'}`} onClick={toggle} title="Toggle theme">
      <span className="theme-thumb">{isDark ? '🌙' : '☀️'}</span>
    </button>
  );
}

function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = [
    { to:'/', label:'Dashboard', icon:'📊', end:true },
    { to:'/inspections', label:'All Inspections', icon:'📋' },
    ...(user?.role==='admin' ? [{ to:'/new', label:'New Inspection', icon:'➕' }] : []),
    ...(user?.role==='admin' ? [{ to:'/users', label:'Manage Users', icon:'👥' }] : []),
  ];
  return (
    <>
      <div className={`sb-overlay ${open?'':'hidden'}`} onClick={onClose}/>
      <aside className={`ag-sidebar ${open?'open':''}`}>
        <div className="sb-logo">
          <img src="/logo.png" alt="AutoGemz" className="sb-logo-img" onError={e=>e.target.style.display='none'}/>
          <div><div className="sb-brand">AutoGemz</div><div className="sb-sub">Inspection System</div></div>
        </div>
        <nav className="sb-nav">
          <span className="sb-section">Navigation</span>
          {nav.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={onClose}
              className={({isActive}) => `nav-item-btn ${isActive?'active':''}`}>
              <span className="ni">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        {user && (
          <div className="sb-user">
            <div className="user-av">{user.name?.charAt(0)?.toUpperCase()||'U'}</div>
            <div style={{flex:1,minWidth:0}}>
              <div className="user-nm">{user.name}</div>
              <div className="user-rl">{user.role==='admin'?'👑 Admin':'👤 User'}</div>
            </div>
            <button className="btn btn-sm btn-outline-danger" onClick={()=>{logout();navigate('/auth');onClose()}} title="Logout" style={{padding:'5px 10px',fontSize:'16px'}}>⏻</button>
          </div>
        )}
      </aside>
    </>
  );
}

function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const navigate = useNavigate();
  const titles = {'/':'Dashboard','/inspections':'All Inspections','/new':'New Inspection','/users':'Manage Users'};
  const subs = {'/':'Overview & Analytics','/inspections':'Search & manage reports','/new':'Create vehicle inspection','/users':'Admin user management'};
  const title = titles[loc.pathname] || 'AutoGemz';
  const sub   = subs[loc.pathname]   || '';
  return (
    <header className="ag-topbar">
      <div className="d-flex align-items-center gap-3">
        <button className="hamburger-btn" onClick={onMenu}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M2.5 5h15M2.5 10h15M2.5 15h15"/>
          </svg>
        </button>
        <div>
          <div className="topbar-title">{title}</div>
          <div className="topbar-sub d-none d-md-block">{sub}</div>
        </div>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span className="d-none d-sm-inline" style={{fontSize:'13px',color:'var(--text2)'}}>
          {new Date().toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'})}
        </span>
        {/* Mobile logout */}
        <button className="btn btn-sm btn-outline-danger d-flex d-lg-none align-items-center gap-1"
          onClick={()=>{logout();navigate('/auth')}}>⏻ <span className="d-none d-sm-inline">Logout</span></button>
        <ThemeToggle/>
      </div>
    </header>
  );
}

function Layout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-layout">
      <Sidebar open={open} onClose={()=>setOpen(false)}/>
      <div className="ag-main">
        <Topbar onMenu={()=>setOpen(p=>!p)}/>
        <div className="ag-page">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  const { isDark } = useTheme();
  React.useLayoutEffect(()=>{
    document.documentElement.setAttribute('data-theme', isDark?'dark':'light');
  },[isDark]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth"         element={<AuthPage/>}/>
        <Route path="/"             element={<Protected><Layout><Dashboard/></Layout></Protected>}/>
        <Route path="/inspections"  element={<Protected><Layout><InspectionList/></Layout></Protected>}/>
        <Route path="/new"          element={<Protected><Layout><NewInspection/></Layout></Protected>}/>
        <Route path="/edit/:id"     element={<Protected><Layout><EditInspection/></Layout></Protected>}/>
        <Route path="/view/:id"     element={<Protected><Layout><ViewInspection/></Layout></Protected>}/>
        <Route path="/users"        element={<Protected><Layout><UsersPage/></Layout></Protected>}/>
        <Route path="*"             element={<Navigate to="/" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}
