import React, { useState } from 'react';
import { Play, Settings, Shield, FastForward, Zap, RotateCcw, Rocket, AlertTriangle } from 'lucide-react';

const Controls = ({
    algorithm,
    setAlgorithm,
    maliciousPercent,
    setMaliciousPercent,
    attackType,
    setAttackType,
    onRunRound,
    onRunMultiple,
    onReset,
    isTraining
}) => {
    const [activeButton, setActiveButton] = useState(null);

    const handleRunRound = () => {
        setActiveButton('1');
        onRunRound();
    };

    const handleRunMultiple = (count) => {
        setActiveButton(count.toString());
        onRunMultiple(count);
    };

    return (
        <div className="bg-[#0B1120] p-6 rounded-xl border border-slate-800 shadow-xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Settings size={16} className="text-cyan-400" /> System Controls
            </h2>

            <div className="space-y-8">
                {/* Comparison Mode Indicator */}
                <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-50"></div>
                    <div className="relative flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-md border border-slate-700">
                            <Shield size={18} className="text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-0.5">Secure_Mode_Active</div>
                            <div className="text-[10px] text-slate-500 font-mono">Running dual-core simulation: FedAvg + DetectionGuard</div>
                        </div>
                    </div>
                </div>

                {/* Attack Type Selector */}
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Attack Strategy</label>
                    <div className="relative">
                        <select
                            value={attackType}
                            onChange={(e) => setAttackType(e.target.value)}
                            disabled={isTraining}
                            className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono rounded-lg px-3 py-2 appearance-none focus:outline-none focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="model_poisoning">Mean Shift (Outlier)</option>
                            <option value="label_flipping">Label Flipping</option>
                            <option value="random_noise">Random Noise Injection</option>
                            <option value="sign_flipping">Gradient Sign Flipping</option>
                            <option value="negative_scaling">Negative Scaling</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <AlertTriangle size={12} className="text-slate-500" />
                        </div>
                    </div>
                </div>

                {/* Threat Level Slider */}
                <div>
                    <div className="flex justify-between items-end mb-3">
                        <label className="text-xs font-bold text-red-500 uppercase tracking-wider">Threat Level</label>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${maliciousPercent > 0
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : 'bg-slate-800 border-slate-700 text-slate-500'
                            }`}>
                            {maliciousPercent}%
                        </span>
                    </div>
                    <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-300"
                            style={{ width: `${(maliciousPercent / 30) * 100}%` }}
                        ></div>
                        <input
                            type="range"
                            min="0"
                            max="30"
                            step="5"
                            value={maliciousPercent}
                            onChange={(e) => setMaliciousPercent(Number(e.target.value))}
                            disabled={isTraining}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-600 font-bold uppercase mt-2">
                        <span>Safe</span>
                        <span>Critical</span>
                    </div>
                </div>

                {/* Run Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleRunRound}
                        disabled={isTraining}
                        className="group relative bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 text-slate-300 py-3 px-2 rounded-lg font-mono text-xs font-bold uppercase transition-all overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Play size={12} className={isTraining && activeButton === '1' ? "animate-spin text-cyan-400" : "group-hover:text-cyan-400 transition-colors"} />
                            Run_1
                        </span>
                    </button>

                    <button
                        onClick={() => handleRunMultiple(5)}
                        disabled={isTraining}
                        className="group relative bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 text-slate-300 py-3 px-2 rounded-lg font-mono text-xs font-bold uppercase transition-all overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <FastForward size={12} className={isTraining && activeButton === '5' ? "animate-pulse text-cyan-400" : "group-hover:text-cyan-400 transition-colors"} />
                            Run_5
                        </span>
                    </button>

                    <button
                        onClick={() => handleRunMultiple(50)}
                        disabled={isTraining}
                        className="group relative bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 text-slate-300 py-3 px-2 rounded-lg font-mono text-xs font-bold uppercase transition-all overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Zap size={12} className={isTraining && activeButton === '50' ? "animate-pulse text-cyan-400" : "group-hover:text-cyan-400 transition-colors"} />
                            Run_50
                        </span>
                    </button>

                    <button
                        onClick={() => handleRunMultiple(100)}
                        disabled={isTraining}
                        className="group relative bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 text-slate-300 py-3 px-2 rounded-lg font-mono text-xs font-bold uppercase transition-all overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Zap size={12} className={isTraining && activeButton === '100' ? "animate-pulse text-cyan-400" : "group-hover:text-cyan-400 transition-colors"} />
                            Run_100
                        </span>
                    </button>

                    <button
                        onClick={() => handleRunMultiple(500)}
                        disabled={isTraining}
                        className="col-span-2 group relative bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 text-slate-300 py-3 px-2 rounded-lg font-mono text-xs font-bold uppercase transition-all overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Rocket size={12} className={isTraining && activeButton === '500' ? "animate-bounce text-cyan-400" : "group-hover:text-cyan-400 transition-colors"} />
                            Turbo_Mode_500
                        </span>
                    </button>
                </div>

                {/* Reset Button */}
                <button
                    onClick={onReset}
                    disabled={isTraining}
                    className="w-full group bg-red-950/30 hover:bg-red-900/40 border border-red-900/30 text-red-400 py-3 px-4 rounded-lg font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2"
                >
                    <RotateCcw size={12} className="group-hover:-rotate-180 transition-transform duration-500" />
                    System_Reset
                </button>
            </div>
        </div>
    );
};

export default Controls;

