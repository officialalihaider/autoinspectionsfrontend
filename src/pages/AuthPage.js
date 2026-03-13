import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function AuthPage() {
  const [tab, setTab]     = useState('login');
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw]       = useState('');
  const [cpw, setCpw]     = useState('');
  const [showPw, setSP]   = useState(false);
  const [loading, setLd]  = useState(false);
  const [error, setErr]   = useState('');
  const { login, signup } = useAuth();
  const { isDark, toggle }= useTheme();
  const navigate          = useNavigate();

  const switchTab = t => { setTab(t); setErr(''); };

  const submit = async e => {
    e.preventDefault(); setErr('');
    if (tab==='signup') {
      if (!name.trim()) return setErr('Full name is required');
      if (pw.length < 6) return setErr('Password must be at least 6 characters');
      if (pw !== cpw) return setErr('Passwords do not match');
    }
    setLd(true);
    try {
      if (tab==='login') await login(email, pw);
      else               await signup(name, email, pw);
      navigate('/');
    } catch(err) { setErr(err.response?.data?.message || 'Something went wrong'); }
    finally { setLd(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo-row">
          <img src="/logo.png" alt="AutoGemz" className="auth-logo-img" onError={e=>e.target.style.display='none'}/>
          <div style={{flex:1}}>
            <div className="auth-brand">AutoGemz</div>
            <div className="auth-subt">Inspection System</div>
          </div>
          <button className={`theme-toggle-btn ${isDark?'dark':'light'}`} onClick={toggle} style={{flexShrink:0}}>
            <span className="theme-thumb">{isDark?'🌙':'☀️'}</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="d-flex gap-2 mb-4" style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'12px',padding:'5px'}}>
          {['login','signup'].map(t => (
            <button key={t} onClick={()=>switchTab(t)}
              className="btn flex-fill"
              style={{borderRadius:'9px',fontWeight:700,fontSize:'15px',padding:'10px',
                background: tab===t ? 'linear-gradient(135deg,var(--primary),#b71c1c)' : 'transparent',
                color: tab===t ? '#fff' : 'var(--text2)',
                boxShadow: tab===t ? '0 3px 12px rgba(229,57,53,0.3)' : 'none',
                border:'none',
              }}>
              {t==='login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-danger py-2 px-3 mb-3" style={{fontSize:'14px'}}>⚠️ {error}</div>}

        <form onSubmit={submit} autoComplete="off">
          {tab==='signup' && (
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text" style={{background:'var(--bg3)',border:'1.5px solid var(--border)',borderRight:'none',borderRadius:'10px 0 0 10px',fontSize:'18px'}}>👤</span>
                <input className="form-control" style={{borderLeft:'none',borderRadius:'0 10px 10px 0'}} type="text" placeholder="Muhammad Ali"
                  value={name} onChange={e=>setName(e.target.value)} required autoFocus/>
              </div>
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <div className="input-group">
              <span className="input-group-text" style={{background:'var(--bg3)',border:'1.5px solid var(--border)',borderRight:'none',borderRadius:'10px 0 0 10px',fontSize:'18px'}}>✉️</span>
              <input className="form-control" style={{borderLeft:'none',borderRadius:'0 10px 10px 0'}} type="email" placeholder="you@example.com"
                value={email} onChange={e=>setEmail(e.target.value)} required autoFocus={tab==='login'}/>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text" style={{background:'var(--bg3)',border:'1.5px solid var(--border)',borderRight:'none',borderRadius:'10px 0 0 10px',fontSize:'18px'}}>🔒</span>
              <input className="form-control" style={{borderLeft:'none',borderRadius:'0 10px 10px 0'}} type={showPw?'text':'password'}
                placeholder={tab==='signup'?'Min 6 characters':'Your password'}
                value={pw} onChange={e=>setPw(e.target.value)} required/>
              <button type="button" className="input-group-text" onClick={()=>setSP(p=>!p)}
                style={{background:'var(--bg3)',border:'1.5px solid var(--border)',borderLeft:'none',borderRadius:'0 10px 10px 0',cursor:'pointer',fontSize:'16px'}}>
                {showPw?'🙈':'👁️'}
              </button>
            </div>
          </div>
          {tab==='signup' && (
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text" style={{background:'var(--bg3)',border:'1.5px solid var(--border)',borderRight:'none',borderRadius:'10px 0 0 10px',fontSize:'18px'}}>🔐</span>
                <input className="form-control" style={{borderLeft:'none',borderRadius:'0 10px 10px 0'}} type={showPw?'text':'password'} placeholder="Repeat password"
                  value={cpw} onChange={e=>setCpw(e.target.value)} required/>
              </div>
            </div>
          )}
          <button type="submit" className="btn btn-danger btn-lg w-100 mt-2" disabled={loading}>
            {loading ? <><span className="spinner-sm me-2"/>Signing in...</> : tab==='login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <div className="text-center mt-4" style={{fontSize:'14px',color:'var(--text2)'}}>
          {tab==='login' ? "Don't have an account? " : 'Already registered? '}
          <button className="btn btn-link p-0" onClick={()=>switchTab(tab==='login'?'signup':'login')}
            style={{color:'var(--primary2)',fontWeight:700,fontSize:'14px',textDecoration:'none'}}>
            {tab==='login' ? 'Sign Up Free' : 'Sign In'}
          </button>
        </div>
        <p className="text-center mt-4 mb-0" style={{fontSize:'11px',color:'var(--text3)'}}>© {new Date().getFullYear()} AutoGemz · Professional Vehicle Inspection</p>
      </div>
    </div>
  );
}
