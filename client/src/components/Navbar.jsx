import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, ShieldAlert, User, LogOut, Menu } from 'lucide-react';

const Navbar = ({ user, logout }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = React.useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Assessment', path: '/assessment', icon: <ShieldAlert size={20} /> },
        { name: 'Compliance', path: '/compliance', icon: <ClipboardCheck size={20} /> },
        { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    ];

    return (
        <nav className="glass" style={{ margin: '1rem', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="flex items-center gap-2">
                <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
                    <ShieldAlert color="white" size={24} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>FarmGuard</span>
            </div>

            <div className="desktop-menu flex gap-4 items-center" style={{ display: 'none' }}>
                {/* Desktop links - hidden on mobile via CSS or simplified here */}
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden-mobile flex gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 ${location.pathname === item.path ? 'title-gradient' : 'btn-ghost'}`}
                            style={{ textDecoration: 'none', transition: '0.3s' }}
                        >
                            {item.icon}
                            <span style={{ fontWeight: 600 }}>{item.name}</span>
                        </Link>
                    ))}
                </div>

                <button onClick={logout} className="btn-ghost flex items-center gap-2" style={{ marginLeft: '1rem' }}>
                    <LogOut size={20} />
                    <span className="hidden-mobile">Logout</span>
                </button>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
