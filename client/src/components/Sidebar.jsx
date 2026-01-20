import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardCheck,
    ShieldAlert,
    User,
    LogOut,
    ChevronRight,
    ShieldCheck,
    Sun,
    Moon,
    BrainCircuit
} from 'lucide-react';

const Sidebar = ({ user, logout, isMobileOpen, setMobileOpen, theme, toggleTheme }) => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'AI Analyst', path: '/ai-analyst', icon: <BrainCircuit size={20} /> },
        { name: 'Risk Assessment', path: '/assessment', icon: <ShieldAlert size={20} /> },
        { name: 'Compliance', path: '/compliance', icon: <ClipboardCheck size={20} /> },
        { name: 'My Profile', path: '/profile', icon: <User size={20} /> },
    ];

    const sidebarClass = `sidebar ${isMobileOpen ? 'mobile-open' : ''}`;

    return (
        <>
            <aside className={sidebarClass}>
                <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem', borderRadius: '0.75rem' }}>
                        <ShieldCheck size={24} />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>FarmGuard</span>
                </div>

                <nav style={{ flex: 1 }}>
                    <div className="text-xs" style={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 1rem 0.75rem' }}>Core Modules</div>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            {item.icon}
                            <span style={{ flex: 1 }}>{item.name}</span>
                            {location.pathname === item.path && <ChevronRight size={16} />}
                        </Link>
                    ))}
                </nav>

                <div style={{ padding: '0 0.5rem' }}>
                    <button
                        onClick={toggleTheme}
                        className="nav-link"
                        style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border)', cursor: 'pointer', marginBottom: '1rem' }}
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>

                    <div className="card" style={{ padding: '1rem', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-3">
                            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                <User size={20} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p className="text-sm" style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Premium Farmer</p>
                            </div>
                        </div>
                        <button onClick={logout} className="nav-link" style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                            <LogOut size={16} />
                            <span className="text-sm">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
