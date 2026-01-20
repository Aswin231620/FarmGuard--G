import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center p-4" style={{ minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'inline-flex', background: 'var(--primary-glow)', color: 'var(--primary)', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h2>Sign in to FarmGuard</h2>
                    <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Biosecurity Intelligence System</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label className="text-sm" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                required
                                placeholder="name@farm.com"
                                style={{ paddingLeft: '3rem' }}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label className="text-sm" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                style={{ paddingLeft: '3rem' }}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Enter Dashboard'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p className="text-sm" style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    New to the portal? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
