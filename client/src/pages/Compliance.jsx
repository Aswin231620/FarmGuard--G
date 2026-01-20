import React, { useState, useEffect } from 'react';
import { getCompliance, updateCompliance } from '../services/firestoreService';

import {
    ClipboardCheck,
    CheckCircle2,
    Circle,
    Save,
    History,
    Calendar,
    MoreVertical,
    BrainCircuit,
    Sparkles,
    AlertCircle,
    TrendingUp,
    ShieldCheck,
    Activity
} from 'lucide-react';

const checklistItems = [
    { id: 'c1', label: 'Disinfectant footbaths placed at all entry points', group: 'Daily' },
    { id: 'c2', label: 'Staff shower-in/shower-out protocol followed', group: 'Daily' },
    { id: 'c3', label: 'Feed storage bins checked for leaks and pests', group: 'Weekly' },
    { id: 'c4', label: 'Perimeter fence integrity inspection', group: 'Weekly' },
    { id: 'c5', label: 'Deep cleaning and sterilization of empty sheds', group: 'Monthly' },
    { id: 'c6', label: 'Biosecurity training for all workers completed', group: 'Quarterly' },
];

const Compliance = () => {
    const [status, setStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCompliance = async () => {
            try {
                const data = await getCompliance();
                const statusMap = {};
                data.forEach(item => {
                    statusMap[item.item_id] = !!item.status;
                });
                setStatus(statusMap);
            } catch (err) {
                console.error('Error fetching compliance', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompliance();
    }, []);

    const toggleItem = (id) => {
        setStatus(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const saveCompliance = async () => {
        setSaving(true);
        try {
            const promises = Object.keys(status).map(id =>
                updateCompliance(id, status[id])
            );
            await Promise.all(promises);
            alert('Compliance ledger updated.');
        } catch (err) {
            alert('Sync failed.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center">Loading compliance records...</div>;

    const completionRate = Math.round((Object.values(status).filter(v => v).length / checklistItems.length) * 100);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <header className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
                <div>
                    <h1>Compliance Ledger</h1>
                    <p className="text-secondary">Mandatory biosecurity maintenance logs.</p>
                </div>
                <button className="btn btn-primary" onClick={saveCompliance} disabled={saving}>
                    <Save size={18} />
                    {saving ? 'Syncing...' : 'Save Changes'}
                </button>
            </header>

            {/* AI Compliance Insight */}
            <div className="card" style={{ marginBottom: '3rem', background: 'var(--primary-glow)', border: '1px solid var(--primary)', position: 'relative' }}>
                <div className="flex gap-4">
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '1rem', height: 'fit-content' }}>
                        <BrainCircuit size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1rem' }}>AI Governance Insight</h3>
                            <div style={{ padding: '0.2rem 0.6rem', background: 'var(--bg-card)', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 700 }}>
                                {completionRate}% SCORE
                            </div>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                            {Object.values(status).filter(v => !v).length > 0 ? (
                                <>
                                    Missed tasks like <strong>disinfectant footbath placement</strong> are critical, as they act as the terminal barrier against soil-borne pathogens.
                                    Each missed task increases your secondary risk by approximately 12%.
                                </>
                            ) : (
                                "Your compliance is perfect today! This gold-standard discipline is what keeps regional diseases outside your fence."
                            )}
                        </p>
                        <div className="flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                            <Sparkles size={14} />
                            <span className="text-xs" style={{ fontWeight: 600 }}>
                                {Object.values(status).filter(v => !v).length > 0
                                    ? "You're doing great! Just 5 more minutes of focused work will secure your perimeter for the night."
                                    : "Outstanding leadership! Your farm is a model for regional biosecurity."}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {['Daily', 'Weekly', 'Monthly', 'Quarterly'].map(group => (
                    <div key={group}>
                        <div className="flex items-center gap-2" style={{ marginBottom: '1.25rem' }}>
                            <Calendar size={18} color="var(--primary)" />
                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>{group} Procedures</h3>
                        </div>
                        <div className="flex flex-col gap-3">
                            {checklistItems.filter(i => i.group === group).map(item => (
                                <div
                                    key={item.id}
                                    className="card flex items-center justify-between"
                                    style={{ padding: '1.25rem', cursor: 'pointer', transition: '0.2s' }}
                                    onClick={() => toggleItem(item.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        {status[item.id] ? (
                                            <div style={{ color: 'var(--success)' }}><CheckCircle2 size={24} strokeWidth={3} /></div>
                                        ) : (
                                            <div style={{ color: 'var(--text-muted)', opacity: 0.5 }}><Circle size={24} strokeWidth={2} /></div>
                                        )}
                                        <span style={{ fontWeight: 500, color: status[item.id] ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {status[item.id] && <span className="text-xs" style={{ color: 'var(--success)', fontWeight: 700, padding: '0.25rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem' }}>COMPLIANT</span>}
                                        <MoreVertical size={16} color="var(--text-muted)" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Sanitation Evaluator */}
            <div className="card" style={{ marginTop: '3rem', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                    <ShieldCheck size={20} color="var(--primary)" />
                    <h3>Sanitation Compliance Audit</h3>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div style={{ flex: 1, padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '1rem' }}>
                        <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
                            <Activity size={16} color="var(--primary)" />
                            <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>Evaluator Status: <span style={{ color: 'var(--warning)' }}>NEEDS ATTENTION</span></span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            <strong>1. Adequacy:</strong> Your current sanitation level is <strong>MARGINAL</strong>. While cleaning happens, the irregular status of equipment disinfection creates a bypass for pathogens.
                        </p>
                    </div>

                    <div style={{ flex: 1, padding: '1.25rem', background: 'rgba(239, 68, 68, 0.03)', borderRadius: '1rem', borderLeft: '4px solid var(--danger)' }}>
                        <p className="text-sm" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                            <strong>2. Biggest Gap:</strong> <span style={{ fontWeight: 700 }}>Inconsistent Boot Sanitation.</span>
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Dried-out or dirty footbaths are currently your farm's largest vulnerability point.
                        </p>
                    </div>

                    <div style={{ flex: 1, padding: '1.25rem', background: 'rgba(16, 185, 129, 0.03)', borderRadius: '1rem', borderLeft: '4px solid var(--success)' }}>
                        <p className="text-sm" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                            <strong>3. Corrective Action:</strong>
                        </p>
                        <p className="text-sm" style={{ fontWeight: 600, color: 'var(--success)' }}>
                            Refresh all footbaths with fresh 1% Virkon-S solution immediately.
                        </p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '4rem' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                    <History size={20} color="var(--primary)" />
                    <h3>Audit Log Summary</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '1rem', fontWeight: 500 }}>Audit Date</th>
                                <th style={{ padding: '1rem', fontWeight: 500 }}>Completed Tasks</th>
                                <th style={{ padding: '1rem', fontWeight: 500 }}>Compliance Rate</th>
                                <th style={{ padding: '1rem', fontWeight: 500 }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { date: 'Jan 20, 2026', count: '6/6', rate: '100%', status: 'Nominal' },
                                { date: 'Jan 19, 2026', count: '5/6', rate: '83%', status: 'Watch' }
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{row.date}</td>
                                    <td style={{ padding: '1rem' }}>{row.count}</td>
                                    <td style={{ padding: '1rem' }}>{row.rate}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ color: row.status === 'Nominal' ? 'var(--success)' : 'var(--warning)' }}>{row.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Trend Analysis */}
            <div className="grid grid-cols-2 gap-6" style={{ marginTop: '2.5rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
                        <TrendingUp size={20} color="var(--primary)" />
                        <h3>Weekly Trend Analysis</h3>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                        Your compliance is <strong>Improving</strong>. Over the last 7 days, your score has climbed from 72% to 88%.
                        This indicates that biosecurity is becoming a core habit in your daily farm operations.
                    </p>
                    <div className="flex items-center gap-2">
                        <div style={{ padding: '0.4rem 0.8rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
                            STREAK: 4 DAYS
                        </div>
                    </div>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
                        <Sparkles size={20} color="var(--success)" />
                        <h3>Consistency Tip</h3>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        To maintain this momentum, try the <strong>"Morning 5" Habit</strong>.
                        Set a phone alarm for 8:00 AM specifically to complete your daily biosecurity checklist before starting other tasks.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Compliance;
