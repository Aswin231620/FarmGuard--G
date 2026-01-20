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

import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // You can fetch additional user data from Firestore here if needed
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Farmer'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  if (loading) return <div className="loading-screen">Loading FarmGuard...</div>;

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
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
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
