import React, { useState } from 'react';
import api from '../services/api';
import {
    ShieldAlert,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    ArrowLeft,
    Save,
    Clock
} from 'lucide-react';

const questions = [
    { id: 'q1', text: 'Do you have a dedicated "Clean Zone" and "Dirty Zone" at the farm entrance?', category: 'Entry Protocol' },
    { id: 'q2', text: 'Are all visitors required to sign a logbook and wear protective clothing?', category: 'Entry Protocol' },
    { id: 'q3', text: 'Is there a functional vehicle disinfection pit or spray system at the main gate?', category: 'Vehicle Control' },
    { id: 'q4', text: 'Do you source animals only from certified disease-free suppliers?', category: 'Animal Health' },
    { id: 'q5', text: 'Are new animals quarantined for at least 21 days before joining the herd?', category: 'Animal Health' },
    { id: 'q6', text: 'Is there a daily protocol for cleaning and disinfecting water troughs?', category: 'Sanitation' },
    { id: 'q7', text: 'Are animal carcasses disposed of according to national biosecurity standards?', category: 'Sanitation' },
    { id: 'q8', text: 'Do you have a pest control program (rodents, birds, insects) in place?', category: 'Pest Control' },
    { id: 'q9', text: 'Are staff trained in recognizing early symptoms of Notifiable Diseases?', category: 'Training' },
    { id: 'q10', text: 'Is the farm perimeter fully fenced to prevent wild animal entry?', category: 'Containment' },
];

const Assessment = () => {
    const [responses, setResponses] = useState({});
    const [result, setResult] = useState(null);
    const [step, setStep] = useState(0);

    const handleOption = (id, val) => {
        setResponses({ ...responses, [id]: val });
        if (step < questions.length - 1) {
            setTimeout(() => setStep(step + 1), 300);
        }
    };

    const submitAssessment = async () => {
        try {
            const res = await api.post('/assessment', { responses });
            setResult(res.data);
        } catch (err) {
            alert('Error submitting assessment');
        }
    };

    if (result) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '3rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        {result.risk_level === 'Low' ? (
                            <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                <CheckCircle2 size={40} />
                            </div>
                        ) : (
                            <div style={{ width: '80px', height: '80px', background: result.risk_level === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: result.risk_level === 'High' ? 'var(--danger)' : 'var(--warning)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                <AlertTriangle size={40} />
                            </div>
                        )}
                        <h2 style={{ marginTop: '1.5rem' }}>Assessment Complete</h2>
                        <p className="text-secondary">Official Biosecurity Report</p>
                    </div>

                    <div className="flex justify-around items-center" style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                        <div>
                            <p className="text-sm text-secondary">Safety Score</p>
                            <h3 style={{ fontSize: '2rem', color: 'var(--primary)', marginTop: '0.25rem' }}>{result.score}%</h3>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'var(--border)' }}></div>
                        <div>
                            <p className="text-sm text-secondary">Risk Level</p>
                            <h3 style={{ fontSize: '2rem', color: result.risk_level === 'High' ? 'var(--danger)' : 'var(--warning)', marginTop: '0.25rem' }}>{result.risk_level}</h3>
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => (window.location.href = '/')}>Back to Dashboard</button>
                </div>
            </div>
        );
    }

    const currentQ = questions[step];
    const progress = ((step + 1) / questions.length) * 100;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 className="flex items-center gap-3">
                    <ShieldAlert color="var(--primary)" />
                    Biosecurity Assessment
                </h1>
                <p className="text-secondary">Step-by-step diagnostic for farm safety compliance.</p>
            </header>

            <div className="card" style={{ padding: '3rem' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
                        <span className="text-xs" style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{currentQ.category}</span>
                        <span className="text-xs text-secondary">Question {step + 1} of {questions.length}</span>
                    </div>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${progress}%`, background: 'var(--primary)' }}></div>
                    </div>
                </div>

                <h2 style={{ marginBottom: '3rem', fontSize: '1.75rem', lineHeight: '1.4' }}>{currentQ.text}</h2>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        className={`btn ${responses[currentQ.id] === 'yes' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ height: '120px', fontSize: '1.1rem' }}
                        onClick={() => handleOption(currentQ.id, 'yes')}
                    >
                        Yes, Fully Implemented
                    </button>

                    <button
                        className={`btn ${responses[currentQ.id] === 'no' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ height: '120px', fontSize: '1.1rem' }}
                        onClick={() => handleOption(currentQ.id, 'no')}
                    >
                        No / Not at this time
                    </button>
                </div>

                <div className="flex justify-between items-center" style={{ marginTop: '4rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setStep(Math.max(0, step - 1))}
                        disabled={step === 0}
                    >
                        <ArrowLeft size={18} /> Previous
                    </button>

                    {step === questions.length - 1 && responses[currentQ.id] ? (
                        <button className="btn btn-primary" onClick={submitAssessment}>
                            <Save size={18} /> Submit Assessment
                        </button>
                    ) : (
                        <button
                            className="btn btn-secondary"
                            onClick={() => setStep(step + 1)}
                            disabled={!responses[currentQ.id]}
                        >
                            Next <ArrowRight size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 justify-center" style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
                <Clock size={16} />
                <span className="text-xs">Est. time: 2 minutes • 10 segments</span>
            </div>
        </div>
    );
};

export default Assessment;
