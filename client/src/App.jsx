import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Compliance from './pages/Compliance';
import Profile from './pages/Profile';
import AIAnalyst from './pages/AIAnalyst';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Menu, X, Sun, Moon } from 'lucide-react';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <Router>
      <div className="dashboard-layout">
        {user && (
          <>
            {/* Mobile Header */}
            <header className="mobile-header">
              <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.25rem' }}>FarmGuard</span>
              <div className="flex gap-2">
                <button onClick={toggleTheme} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </header>

            {/* Sidebar Component */}
            <Sidebar
              user={user}
              logout={logout}
              isMobileOpen={mobileMenuOpen}
              setMobileOpen={setMobileMenuOpen}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          </>
        )}

        {/* Global Theme Toggle for Login/Signup */}
        {!user && (
          <div className="theme-toggle">
            <button onClick={toggleTheme} className="btn btn-secondary" style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0 }}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        )}

        <main className="main-content">
          <Routes>
            <Route path="/login" element={!user ? <Login login={login} /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/assessment" element={user ? <Assessment /> : <Navigate to="/login" />} />
            <Route path="/ai-analyst" element={user ? <AIAnalyst /> : <Navigate to="/login" />} />
            <Route path="/compliance" element={user ? <Compliance /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
