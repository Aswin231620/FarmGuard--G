import React, { useState, useEffect } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    ShieldAlert,
    TrendingUp,
    Activity,
    MapPin,
    Bell,
    CheckCircle2,
    AlertTriangle,
    Info,
    BrainCircuit,
    Sparkles,
    AlertCircle,
    ShieldCheck
} from 'lucide-react';
import { getAlerts, getAssessmentHistory } from '../services/firestoreService';

const Dashboard = () => {
    const [alerts, setAlerts] = useState([]);
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ risk: 'N/A', score: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedAlert, setSelectedAlert] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [alertsData, historyData] = await Promise.all([
                    getAlerts(),
                    getAssessmentHistory()
                ]);
                setAlerts(alertsData);
                setHistory(historyData.map(h => ({ ...h, score: parseInt(h.score) })).reverse());
                if (historyData.length > 0) {
                    setStats({
                        risk: historyData[0].risk_level,
                        score: historyData[0].score
                    });
                }
            } catch (err) {
                console.error('Error fetching dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex items-center justify-center p-20">Loading dashboard...</div>;

    return (
        <div className="dashboard-content">
            <header className="flex justify-between items-end" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ color: 'var(--text-primary)' }}>Farm Health Dashboard</h1>
                    <p className="text-secondary" style={{ marginTop: '0.25rem' }}>Overview for {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-secondary"><Bell size={18} /> Alerts</button>
                    <button className="btn btn-primary" onClick={() => window.location.href = '/assessment'}>New Assessment</button>
                </div>
            </header>

            {/* AI Summary Section */}
            <div className="card" style={{ marginBottom: '2.5rem', background: 'var(--primary-glow)', border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', color: 'var(--primary)', opacity: 0.05 }}>
                    <BrainCircuit size={100} />
                </div>
                <div className="flex gap-4">
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '1rem', height: 'fit-content' }}>
                        <Sparkles size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Farm Intelligence Summary</h3>
                        <p className="text-sm" style={{ color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: '1.6', maxWidth: '850px' }}>
                            Your farm is currently at a <strong>{stats.risk} Risk</strong> level ({stats.score}/100).
                            With {alerts.length} active alerts in your region, focus on completing all daily sanitation tasks
                            to maintain your high compliance foundation.
                        </p>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <AlertCircle size={14} color="var(--warning)" />
                                <span className="text-xs" style={{ fontWeight: 600 }}>Concern: 1 missed sanitation task today</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={14} color="var(--success)" />
                                <span className="text-xs" style={{ fontWeight: 600 }}>Positive: Consistent monitoring history</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4" style={{ marginBottom: '2.5rem' }}>
                <div className="card stat-card">
                    <div className="flex justify-between items-start">
                        <span className="stat-label">Risk Status</span>
                        <div className={`stat-icon`} style={{ color: stats.risk === 'High' ? 'var(--danger)' : stats.risk === 'Medium' ? 'var(--warning)' : 'var(--success)', background: 'rgba(255,255,255,0.02)' }}>
                            {stats.risk === 'High' ? <AlertTriangle size={20} /> : <ShieldAlert size={20} />}
                        </div>
                    </div>
                    <p className="stat-value">{stats.risk}</p>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{
                            width: `${stats.score}%`,
                            backgroundColor: stats.risk === 'High' ? 'var(--danger)' : stats.risk === 'Medium' ? 'var(--warning)' : 'var(--success)'
                        }}></div>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Health Score: {stats.score}%</span>
                </div>

                <div className="card stat-card">
                    <div className="flex justify-between items-start">
                        <span className="stat-label">Security Index</span>
                        <div className="stat-icon"><TrendingUp size={20} /></div>
                    </div>
                    <p className="stat-value">{stats.score}%</p>
                    <p className="text-xs" style={{ color: 'var(--success)', fontWeight: 600 }}>+2.4% this month</p>
                </div>

                <div className="card stat-card">
                    <div className="flex justify-between items-start">
                        <span className="stat-label">Population</span>
                        <div className="stat-icon" style={{ color: '#3b82f6' }}><Activity size={20} /></div>
                    </div>
                    <p className="stat-value">1,240</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Steady reporting</p>
                </div>

                <div className="card stat-card">
                    <div className="flex justify-between items-start">
                        <span className="stat-label">Bio-Safe Zone</span>
                        <div className="stat-icon" style={{ color: 'var(--success)' }}><MapPin size={20} /></div>
                    </div>
                    <p className="stat-value">Lv. 4</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Safe perimeter: 20km</p>
                </div>
            </div>

            <div className="grid grid-cols-3" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Main Chart */}
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                        <h3>Biosecurity Trends</h3>
                        <select className="text-xs" style={{ width: 'auto', padding: '0.25rem 0.5rem' }}>
                            <option>Last 30 Days</option>
                            <option>Last 6 Months</option>
                        </select>
                    </div>
                    <div style={{ height: '320px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.75rem', boxShadow: 'var(--shadow-lg)' }}
                                    itemStyle={{ color: 'var(--primary)' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Panel: Alerts */}
                <div className="card">
                    <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                        <h3>Regional Alerts</h3>
                        <span className="text-xs" style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>View all</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        {alerts.slice(0, 3).map((alert) => (
                            <div
                                key={alert.id}
                                onClick={() => setSelectedAlert(alert)}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.75rem',
                                    borderLeft: `3px solid ${alert.severity === 'High' ? 'var(--danger)' : 'var(--warning)'}`,
                                    background: selectedAlert?.id === alert.id ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                                    cursor: 'pointer',
                                    transition: '0.2s'
                                }}
                            >
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{alert.title}</h4>
                                <p className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{alert.description}</p>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(alert.date).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>

                    {selectedAlert && (
                        <div className="animate-fade" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                            <div className="flex items-center gap-2" style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                                <BrainCircuit size={18} />
                                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>AI Bio-Advisory</h4>
                            </div>
                            <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{selectedAlert.title}</h5>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                                This is a highly contagious viral condition that can spread rapidly through contact with contaminated surfaces, boots, or feed.
                            </p>
                            <div style={{ marginBottom: '1rem' }}>
                                <p className="text-xs" style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--danger)' }}>IMMEDIATE ACTIONS:</p>
                                <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <li style={{ marginBottom: '0.25rem' }}>Restrict all visitor entry.</li>
                                    <li style={{ marginBottom: '0.25rem' }}>Double-dose disinfection basins.</li>
                                    <li>Monitor temperature of odd-acting animals.</li>
                                </ul>
                            </div>
                            <button className="btn btn-secondary text-xs" style={{ width: '100%', padding: '0.3rem' }} onClick={() => setSelectedAlert(null)}>Close Advisory</button>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Expert Recommendations */}
            <div className="card" style={{ marginTop: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
                    <div className="flex items-center gap-2">
                        <BrainCircuit size={20} color="var(--primary)" />
                        <h3>AI Expert Recommendations</h3>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Tailored for {stats.risk} Risk Profile</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div style={{ padding: '1.5rem', background: 'rgba(14, 165, 233, 0.03)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                        <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                            <h4 style={{ color: 'var(--primary)', fontSize: '1rem' }}>1. Perimeter Sterilization Protocol</h4>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', background: 'var(--danger)', color: 'white', borderRadius: '0.4rem' }}>URGENT</span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>Action: Implement UV-C or high-grade chemical fogging at all feed entry points.</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            <strong>Why?</strong> Pathogens like {stats.risk === 'High' ? 'African Swine Fever' : 'Avian Influenza'} often hitchhike on feed bags.
                            Sterilizing these items at the perimeter prevents the 'Last Mile' infection into the shed.
                        </p>
                    </div>

                    <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.03)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                        <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                            <h4 style={{ color: 'var(--success)', fontSize: '1rem' }}>2. Dynamic Workforce Zoning</h4>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', background: 'var(--primary)', color: 'white', borderRadius: '0.4rem' }}>STRATEGIC</span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>Action: Assign specific staff cohorts to "Green" and "Red" zones with no cross-over.</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            <strong>Why?</strong> This prevents internal farm outbreaks from becoming 'shed-to-shed' epidemics.
                            If one area is compromised, your workforce structure ensures the rest of the flock remains isolated and safe.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2" style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '0.75rem', fontSize: '0.8rem' }}>
                    <Info size={16} color="var(--primary)" />
                    <span style={{ color: 'var(--text-muted)' }}><strong>Advisor Note:</strong> Urgent actions should be completed within the next 12 hours for maximum efficacy.</span>
                </div>
            </div>

            {/* AI Expert Recommendations section ends here */}

            {/* Mission & Impact Section */}
            <div className="card" style={{ marginTop: '2.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                    <ShieldCheck size={20} color="var(--primary)" />
                    <h3>Biosecurity Mission & Impact</h3>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Why Biosecurity Matters Here</h4>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            In your region, pathogens like <strong>{alerts.length > 0 ? alerts[0].title : 'regional diseases'}</strong> are a constant threat.
                            For your livestock operation, biosecurity isn't just a chore—it's the only wall between your livelihood and a localized epidemic.
                            Digital monitoring replaces "guessing" with "evidence," ensuring every gate and every footbath is a true barrier.
                        </p>
                    </div>

                    <div style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: '2rem' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                                <TrendingUp size={16} color="var(--success)" />
                                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>ECONOMIC IMPACT</span>
                            </div>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                A single outbreak can cost a farm upwards of 60% of its annual revenue.
                                Maintaining 90%+ compliance ensures your production remains uninterrupted and profitable.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                                <Activity size={16} color="var(--primary)" />
                                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>PUBLIC HEALTH</span>
                            </div>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                Controlling zoonotic diseases at the farm level protects your family and the local community
                                from health crises before they even start.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 1024px) {
          .grid-cols-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
};

export default Dashboard;
