import React, { useState } from 'react';
import {
    BrainCircuit,
    Sparkles,
    AlertCircle,
    CheckCircle2,
    Activity,
    Users,
    Thermometer,
    MapPin,
    ClipboardList
} from 'lucide-react';

const AIAnalyst = () => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [formData, setFormData] = useState({
        livestockType: 'Poultry',
        animalCount: '',
        location: '',
        nearbyAlerts: 'Low',
        visitorFrequency: '',
        cleaningFrequency: 'Daily',
        recentMortalities: ''
    });

    const calculateRisk = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate AI processing delay
        setTimeout(() => {
            let score = 85;
            const factors = [];
            const actions = [];

            // Logic Heuristics
            if (formData.nearbyAlerts === 'High') {
                score -= 30;
                factors.push("Active outbreaks in your immediate geographic region pose a critical threat.");
            } else if (formData.nearbyAlerts === 'Medium') {
                score -= 15;
                factors.push("Moderate disease activity reported in neighboring districts.");
            }

            if (parseInt(formData.visitorFrequency) > 10) {
                score -= 20;
                factors.push("High visitor traffic increases the risk of 'fomite' transmission (disease carried on boots/clothing).");
                actions.push("Immediately implement a 48-hour downtime rule for all essential visitors.");
            } else {
                factors.push("Visitor controlled levels are within acceptable safety margins.");
            }

            if (formData.cleaningFrequency === 'Weekly' || formData.cleaningFrequency === 'Rarely') {
                score -= 15;
                factors.push("Sub-optimal disinfection frequency allows pathogens to accumulate in the environment.");
                actions.push("Upgrade to a Daily Disinfection Protocol for high-touch surfaces.");
            }

            if (parseInt(formData.recentMortalities) > 0) {
                score -= 25;
                factors.push("Reported mortalities are an early warning sign of potential flock-level infection.");
                actions.push("Contact a Veterinary Officer immediately and isolate the affected sheds.");
            }

            if (actions.length === 0) {
                actions.push("Install UV-C air filtration in brooding areas to further enhance health.");
                actions.push("Conduct a biosecurity audit with your local agricultural board.");
            }

            let level = 'LOW';
            if (score < 40) level = 'HIGH';
            else if (score < 70) level = 'MEDIUM';

            setReport({
                score: Math.max(0, score),
                level,
                factors,
                actions: actions.slice(0, 2)
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 className="flex items-center gap-3">
                    <BrainCircuit color="var(--primary)" size={32} />
                    AI Biosecurity Analyst
                </h1>
                <p className="text-secondary">Next-generation predictive risk modeling for your farm.</p>
            </header>

            <div className="grid grid-cols-1" style={{ gridTemplateColumns: report ? '1fr 1fr' : '1fr', gap: '2rem' }}>
                {/* Input Card */}
                <div className="card">
                    <div className="flex items-center gap-2" style={{ marginBottom: '2rem' }}>
                        <Sparkles size={18} color="var(--primary)" />
                        <h3 style={{ fontSize: '1rem' }}>Farm Intelligence Input</h3>
                    </div>

                    <form onSubmit={calculateRisk}>
                        <div className="grid grid-cols-2 gap-4">
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="text-xs" style={{ fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Livestock Type</label>
                                <select
                                    value={formData.livestockType}
                                    onChange={(e) => setFormData({ ...formData, livestockType: e.target.value })}
                                >
                                    <option>Poultry</option>
                                    <option>Pig/Swine</option>
                                    <option>Cattle/Dairy</option>
                                    <option>Sheep/Goat</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="text-xs" style={{ fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Animal Count</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 5000"
                                    required
                                    value={formData.animalCount}
                                    onChange={(e) => setFormData({ ...formData, animalCount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label className="text-xs" style={{ fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Farm Location</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="District/Region"
                                    style={{ paddingLeft: '3rem' }}
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label className="text-xs" style={{ fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Nearby Disease Alerts</label>
                            <select
                                value={formData.nearbyAlerts}
                                onChange={(e) => setFormData({ ...formData, nearbyAlerts: e.target.value })}
                            >
                                <option value="Low">Low / No Alerts</option>
                                <option value="Medium">Medium (within 50km)</option>
                                <option value="High">High (Immediate Zone)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="text-xs" style={{ fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Visitors / Week</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 5"
                                    required
                                    value={formData.visitorFrequency}
                                    onChange={(e) => setFormData({ ...formData, visitorFrequency: e.target.value })}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="text-xs" style={{ fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Cleaning Frequency</label>
                                <select
                                    value={formData.cleaningFrequency}
                                    onChange={(e) => setFormData({ ...formData, cleaningFrequency: e.target.value })}
                                >
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                    <option>Rarely</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label className="text-xs" style={{ fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Recent Mortalities (Last 7 days)</label>
                            <input
                                type="number"
                                placeholder="Number of deaths"
                                required
                                value={formData.recentMortalities}
                                onChange={(e) => setFormData({ ...formData, recentMortalities: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '54px' }} disabled={loading}>
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="spinner"></div> Processing Data...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <BrainCircuit size={20} /> Run AI Analysis
                                </div>
                            )}
                        </button>
                    </form>
                </div>

                {/* Report Card */}
                {report && (
                    <div className="card animate-fade" style={{ background: 'rgba(14, 165, 233, 0.02)', borderLeft: `6px solid ${report.level === 'HIGH' ? 'var(--danger)' : report.level === 'MEDIUM' ? 'var(--warning)' : 'var(--success)'}` }}>
                        <div className="flex justify-between items-start" style={{ marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ color: 'var(--primary)' }}>Analysis Result</h3>
                                <p className="text-xs text-secondary">Generated by BioEngine v4.2</p>
                            </div>
                            <div style={{
                                padding: '0.4rem 1rem',
                                borderRadius: '0.5rem',
                                background: report.level === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : report.level === 'MEDIUM' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                color: report.level === 'HIGH' ? 'var(--danger)' : report.level === 'MEDIUM' ? 'var(--warning)' : 'var(--success)',
                                fontWeight: 800,
                                fontSize: '0.8rem'
                            }}>
                                {report.level} RISK
                            </div>
                        </div>

                        <div className="flex flex-col items-center" style={{ marginBottom: '2.5rem' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="120" height="120" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="12" />
                                    <circle cx="60" cy="60" r="54" fill="none" stroke="var(--primary)" strokeWidth="12" strokeDasharray="339.292" strokeDashoffset={339.292 - (339.292 * report.score) / 100} style={{ transition: 'stroke-dashoffset 1s ease' }} />
                                </svg>
                                <div style={{ position: 'absolute', textAlign: 'center' }}>
                                    <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{report.score}</span>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Index</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h4 className="flex items-center gap-2" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                                <AlertCircle size={16} /> Key Findings
                            </h4>
                            <ul style={{ paddingLeft: '1rem' }}>
                                {report.factors.map((f, i) => (
                                    <li key={i} className="text-sm" style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>{f}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="card" style={{ background: 'var(--bg-main)', borderColor: 'var(--border)' }}>
                            <h4 className="flex items-center gap-2" style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--success)' }}>
                                <CheckCircle2 size={16} /> Immediate Actions
                            </h4>
                            <div className="flex flex-col gap-3">
                                {report.actions.map((a, i) => (
                                    <div key={i} className="flex gap-3 text-sm" style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                        <div style={{ background: 'var(--success)', width: '6px', borderRadius: '3px' }}></div>
                                        <span style={{ fontWeight: 500 }}>{a}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadein { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade { animation: fadein 0.4s ease-out; }
      `}</style>
        </div>
    );
};

export default AIAnalyst;
