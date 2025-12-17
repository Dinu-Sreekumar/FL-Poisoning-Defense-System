import React, { useState, useEffect } from 'react';
import { Shield, Activity, Lock, Cpu } from 'lucide-react';
import Controls from './components/Controls';
import ClientGrid from './components/ClientGrid';
import AccuracyChart from './components/AccuracyChart';
import StatsPanel from './components/StatsPanel';
import SystemLog from './components/SystemLog';

function App() {
    const [clients, setClients] = useState([]);
    const [history, setHistory] = useState([]);
    const [maliciousPercent, setMaliciousPercent] = useState(0);
    const [attackType, setAttackType] = useState('model_poisoning');
    const [isTraining, setIsTraining] = useState(false);
    const [round, setRound] = useState(0);
    const [logs, setLogs] = useState([]);

    // Initialize with empty client slots
    useEffect(() => {
        const initialClients = Array(20).fill(null).map((_, i) => ({
            id: i,
            isMalicious: false,
            status: 'Idle',
            loss: 0
        }));
        setClients(initialClients);
        addLog("System initialized. Ready for simulation.", "info");
    }, []);

    const addLog = (message, type = 'info') => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogs(prev => [...prev.slice(-50), { time, message, type }]);
    };

    const runSingleRound = async () => {
        // Run both algorithms in parallel for comparison
        const [fedAvgRes, detectionGuardRes] = await Promise.all([
            fetch('http://localhost:5000/start_round', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    algorithm: 'fed_avg',
                    malicious_percent: maliciousPercent / 100,
                    attack_type: attackType
                })
            }).then(res => res.json()),
            fetch('http://localhost:5000/start_round', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    algorithm: 'detection_guard',
                    malicious_percent: maliciousPercent / 100,
                    attack_type: attackType
                })
            }).then(res => res.json())
        ]);

        return { fedAvgRes, detectionGuardRes };
    };

    const handleRunRound = async () => {
        setIsTraining(true);
        addLog(`Starting Round ${round + 1} with ${maliciousPercent}% malicious clients (${attackType})...`, "info");

        try {
            const { fedAvgRes, detectionGuardRes } = await runSingleRound();

            setRound(prev => {
                const newRound = prev + 1;
                setHistory(h => [...h, {
                    round: newRound,
                    fedAvg: fedAvgRes.global_accuracy,
                    detectionGuard: detectionGuardRes.global_accuracy
                }]);
                return newRound;
            });

            // Update clients view (using DetectionGuard's view)
            setClients(detectionGuardRes.clients.map(c => ({
                ...c,
                isMalicious: c.is_malicious
            })));

            addLog(`Round ${round + 1} complete. Global Accuracy: ${(detectionGuardRes.global_accuracy * 100).toFixed(1)}%`, "success");
            if (maliciousPercent > 0) {
                addLog(`DetectionGuard: Trimmed Mean aggregation applied.`, "warning");
            }

        } catch (error) {
            console.error("Error running round:", error);
            addLog("Error running round. Check backend connection.", "error");
        } finally {
            setIsTraining(false);
        }
    };

    const handleRunMultipleRounds = async (count) => {
        setIsTraining(true);
        addLog(`Initiating batch run: ${count} rounds (${attackType})...`, "info");

        try {
            for (let i = 0; i < count; i++) {
                const { fedAvgRes, detectionGuardRes } = await runSingleRound();

                setRound(prev => {
                    const newRound = prev + 1;
                    setHistory(h => [...h, {
                        round: newRound,
                        fedAvg: fedAvgRes.global_accuracy,
                        detectionGuard: detectionGuardRes.global_accuracy
                    }]);
                    return newRound;
                });

                setClients(detectionGuardRes.clients.map(c => ({
                    ...c,
                    isMalicious: c.is_malicious
                })));

                // Dynamic delay
                if (count <= 5) await new Promise(r => setTimeout(r, 500));
                else if (count <= 50) await new Promise(r => setTimeout(r, 50));
                else await new Promise(r => setTimeout(r, 10));
            }
            addLog(`Batch run complete.`, "success");
        } catch (error) {
            console.error("Error running multiple rounds:", error);
            addLog("Error during batch run.", "error");
        } finally {
            setIsTraining(false);
        }
    };

    const handleReset = async () => {
        if (!window.confirm("Are you sure you want to reset the system?")) return;

        try {
            await fetch('http://localhost:5000/reset', { method: 'POST' });
            setHistory([]);
            setRound(0);
            setLogs([]);

            const initialClients = Array(20).fill(null).map((_, i) => ({
                id: i,
                isMalicious: false,
                status: 'Idle',
                loss: 0
            }));
            setClients(initialClients);
            addLog("System reset successfully.", "success");

        } catch (error) {
            console.error("Error resetting system:", error);
            addLog("Failed to reset system.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30">
            {/* Cyberpunk Header */}
            <header className="bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-slate-900 p-2 rounded-lg border border-slate-700">
                                <Shield size={24} className="text-cyan-400" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-wider text-white">
                                DETECTION<span className="text-cyan-400">GUARD</span>
                            </h1>
                            <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">
                                Federated Learning Defense System
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                            <Activity size={14} className="text-slate-500" />
                            <span className="text-xs font-mono text-slate-400">ROUND: <span className="text-cyan-400 font-bold">{round}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`relative flex h-3 w-3`}>
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isTraining ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${isTraining ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
                            </span>
                            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                                {isTraining ? 'System Active' : 'System Idle'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column: Controls & Network */}
                    <div className="lg:col-span-4 space-y-6">
                        <Controls
                            maliciousPercent={maliciousPercent}
                            setMaliciousPercent={setMaliciousPercent}
                            attackType={attackType}
                            setAttackType={setAttackType}
                            onRunRound={handleRunRound}
                            onRunMultiple={handleRunMultipleRounds}
                            onReset={handleReset}
                            isTraining={isTraining}
                        />

                        <div className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Cpu size={16} className="text-cyan-400" /> Network Status
                                </h2>
                                <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        <span className="text-slate-400">Active</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                        <span className="text-slate-400">Threat</span>
                                    </div>
                                </div>
                            </div>
                            <ClientGrid clients={clients} />
                        </div>
                    </div>

                    {/* Right Column: Stats, Chart, Logs */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <StatsPanel history={history} />

                        <div className="flex-1 min-h-[400px] bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-xl flex flex-col">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Activity size={16} className="text-cyan-400" /> Global Accuracy
                            </h2>
                            <div className="flex-1 w-full">
                                <AccuracyChart data={history} />
                            </div>
                        </div>

                        <SystemLog logs={logs} />
                    </div>

                </div>
            </main>
        </div>
    );
}

export default App;

