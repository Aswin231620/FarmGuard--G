import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile, getAssessmentHistory } from '../services/firestoreService';

import { User, MapPin, Gauge, Save, Info, ChevronRight, Sparkles, LayoutDashboard } from 'lucide-react';

const Profile = () => {
    const [profile, setProfile] = useState({
        farm_type: 'Poultry',
        location: '',
        animal_count: 0
    });
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const [stats, setStats] = useState({ risk: 'N/A', score: 0 });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [profileData, historyData] = await Promise.all([
                    getProfile(),
                    getAssessmentHistory()
                ]);

                if (profileData) {
                    setProfile(profileData);
                }

                if (historyData.length > 0) {
                    setStats({
                        risk: historyData[0].risk_level,
                        score: historyData[0].score
                    });
                }
            } catch (err) {
                console.error('Error fetching profile data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(profile);
            setMsg('Profile configuration saved.');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Save failed.');
        }
    };

    if (loading) return <div className="p-20 text-center">Loading system configuration...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1>System Configuration</h1>
                <p className="text-secondary">Tailor the biosecurity engine to your specific farm environment.</p>
            </header>

            {msg && (
                <div className="card" style={{ padding: '1rem', marginBottom: '2rem', background: 'var(--primary-glow)', borderColor: 'var(--primary)', color: 'var(--primary)', textAlign: 'center', fontWeight: 600 }}>
                    {msg}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {/* AI Profile Summary Card */}
                <div className="card" style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', color: 'var(--primary)', opacity: 0.05 }}>
                        <LayoutDashboard size={100} />
                    </div>
                    <div className="flex gap-4">
                        <div style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '1rem', height: 'fit-content' }}>
                            <Sparkles size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>AI Biosecurity Profile Summary</h3>
                            <p className="text-sm" style={{ color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: '1.6' }}>
                                This is a professional livestock operation specializing in <strong>{profile.farm_type}</strong> with a capacity of <strong>{profile.animal_count}</strong> units.
                                Your farm is operating at a <strong>{stats.risk === 'Low' ? 'HIGH' : stats.risk === 'Medium' ? 'MODERATE' : 'CRITICAL'}</strong> biosecurity readiness level.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                                    <p className="text-xs" style={{ fontWeight: 700, color: 'var(--success)', marginBottom: '0.25rem' }}>STRENGTH</p>
                                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Exceptional historical compliance and data logging.</p>
                                </div>
                                <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                                    <p className="text-xs" style={{ fontWeight: 700, color: 'var(--warning)', marginBottom: '0.25rem' }}>IMPROVEMENT</p>
                                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Tighten sanitation logging during regional alerts.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="text-sm" style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>Livestock Category</label>
                            <select
                                value={profile.farm_type}
                                onChange={(e) => setProfile({ ...profile, farm_type: e.target.value })}
                            >
                                <option value="Poultry">Poultry (Aviary/Commercial)</option>
                                <option value="Pig">Porcine (Swine/Breeding)</option>
                                <option value="Cattle">Bovine (Dairy/Beef)</option>
                                <option value="Mixed">Diversified / Mixed Livestock</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="text-sm" style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>Geographic Location</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="e.g. Northern Province, Sector B"
                                    style={{ paddingLeft: '3rem' }}
                                    value={profile.location}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <label className="text-sm" style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>Herd/Flock Population</label>
                            <div style={{ position: 'relative' }}>
                                <Gauge size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="number"
                                    placeholder="Active count"
                                    style={{ paddingLeft: '3rem' }}
                                    value={profile.animal_count}
                                    onChange={(e) => setProfile({ ...profile, animal_count: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px' }}>
                            <Save size={18} />
                            Update Configuration
                        </button>
                    </form>
                </div>

                <div className="card" style={{ background: 'rgba(14, 165, 233, 0.03)', borderLeft: '4px solid var(--primary)' }}>
                    <div className="flex gap-4 p-2">
                        <div style={{ color: 'var(--primary)', marginTop: '0.25rem' }}><Info size={24} /></div>
                        <div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Engine Optimization</h3>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                Your configuration affects the **Diagnostic Engine**. Based on your "Livestock Category," the system prioritizes
                                surveillance for specific pathogens such as **{profile.farm_type === 'Pig' ? 'African Swine Fever' : 'Avian Influenza'}**.
                            </p>
                            <button className="btn btn-secondary text-xs" style={{ marginTop: '1rem', padding: '0.4rem 0.8rem' }}>
                                Learn more about risk models <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
