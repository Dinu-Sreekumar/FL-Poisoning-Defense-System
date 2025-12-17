import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, Cpu } from 'lucide-react';

const StatsPanel = ({ history }) => {
    const stats = useMemo(() => {
        if (history.length === 0) return {
            fedAvg: { avg: 0, min: 0, max: 0 },
            detectionGuard: { avg: 0, min: 0, max: 0 }
        };

        const fedAvgValues = history.map(h => h.fedAvg);
        const detectionGuardValues = history.map(h => h.detectionGuard);

        const sumFedAvg = fedAvgValues.reduce((a, b) => a + b, 0);
        const sumDetectionGuard = detectionGuardValues.reduce((a, b) => a + b, 0);

        return {
            fedAvg: {
                avg: (sumFedAvg / history.length) * 100,
                min: Math.min(...fedAvgValues) * 100,
                max: Math.max(...fedAvgValues) * 100
            },
            detectionGuard: {
                avg: (sumDetectionGuard / history.length) * 100,
                min: Math.min(...detectionGuardValues) * 100,
                max: Math.max(...detectionGuardValues) * 100
            }
        };
    }, [history]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* FedAvg Stats */}
            <div className="bg-glass p-4 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden group flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingDown size={48} className="text-neon-red" />
                </div>

                <div className="relative z-10">
                    <h3 className="text-neon-red text-[10px] font-mono-cyber font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-neon-red rounded-full animate-pulse"></div>
                        FedAvg (Standard)
                    </h3>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-3xl font-cyber font-bold text-white text-shadow-red">
                            {stats.fedAvg.avg.toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">AVG ACCURACY</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-red-950/30 text-neon-red border border-red-900/30">
                            <ArrowDown size={12} />
                        </div>
                        <div>
                            <div className="text-[8px] text-slate-500 uppercase font-bold font-mono">Min</div>
                            <div className="text-xs font-bold text-slate-300 font-mono">{stats.fedAvg.min.toFixed(1)}%</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-red-950/30 text-neon-red border border-red-900/30">
                            <ArrowUp size={12} />
                        </div>
                        <div>
                            <div className="text-[8px] text-slate-500 uppercase font-bold font-mono">Max</div>
                            <div className="text-xs font-bold text-slate-300 font-mono">{stats.fedAvg.max.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DetectionGuard Stats */}
            <div className="bg-glass p-4 rounded-xl border border-neon-blue/20 shadow-[0_0_15px_rgba(0,243,255,0.05)] relative overflow-hidden group flex flex-col justify-between">
                <div className="absolute inset-0 bg-neon-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Cpu size={48} className="text-neon-blue" />
                </div>

                <div className="relative z-10">
                    <h3 className="text-neon-blue text-[10px] font-mono-cyber font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-neon-blue rounded-full shadow-[0_0_5px_var(--neon-blue)] animate-pulse"></div>
                        DetectionGuard (Secure)
                    </h3>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-3xl font-cyber font-bold text-white text-shadow-blue">
                            {stats.detectionGuard.avg.toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">AVG ACCURACY</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-blue-950/30 text-neon-blue border border-blue-900/30">
                            <ArrowDown size={12} />
                        </div>
                        <div>
                            <div className="text-[8px] text-slate-500 uppercase font-bold font-mono">Min</div>
                            <div className="text-xs font-bold text-white font-mono">{stats.detectionGuard.min.toFixed(1)}%</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-blue-950/30 text-neon-blue border border-blue-900/30">
                            <ArrowUp size={12} />
                        </div>
                        <div>
                            <div className="text-[8px] text-slate-500 uppercase font-bold font-mono">Max</div>
                            <div className="text-xs font-bold text-white font-mono">{stats.detectionGuard.max.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsPanel;
