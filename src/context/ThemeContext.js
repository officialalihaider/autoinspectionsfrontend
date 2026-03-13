import React, { createContext, useContext, useState, useLayoutEffect } from 'react';
const Ctx = createContext();
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => (localStorage.getItem('ag-theme')||'dark') === 'dark');
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('ag-theme', isDark ? 'dark' : 'light');
  }, [isDark]);
  return <Ctx.Provider value={{ isDark, toggle: () => setIsDark(p => !p) }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);
