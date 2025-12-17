import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const AccuracyChart = ({ data }) => {
    return (
        <div className="bg-glass p-6 rounded-xl border border-slate-800 shadow-lg h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <h2 className="text-xl font-cyber font-bold mb-6 flex items-center gap-2 text-white relative z-10">
                <Activity size={20} className="text-neon-blue" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    GLOBAL ACCURACY
                </span>
            </h2>

            <div className="flex-1 min-h-[300px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorFedAvg" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff2a2a" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ff2a2a" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorDetection" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00ff9d" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis
                            dataKey="round"
                            stroke="#475569"
                            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                            tickLine={false}
                            axisLine={{ stroke: '#334155' }}
                        />
                        <YAxis
                            stroke="#475569"
                            domain={[0, 1]}
                            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(10, 10, 15, 0.9)',
                                borderColor: '#2a2a35',
                                color: '#f1f5f9',
                                borderRadius: '0.5rem',
                                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(10px)',
                                fontFamily: 'JetBrains Mono',
                                fontSize: '12px'
                            }}
                            itemStyle={{ padding: 0 }}
                            formatter={(value, name) => [
                                `${(value * 100).toFixed(1)}%`,
                                name === 'fedAvg' ? 'FedAvg (Standard)' :
                                    name === 'detectionGuard' ? 'DetectionGuard (Secure)' : 'Accuracy'
                            ]}
                            labelFormatter={(label) => `ROUND ${label}`}
                        />

                        {/* FedAvg Line (Red) */}
                        <Area
                            type="monotone"
                            dataKey="fedAvg"
                            stroke="#ff2a2a"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorFedAvg)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#ff2a2a', boxShadow: '0 0 10px #ff2a2a' }}
                        />

                        {/* DetectionGuard Line (Green) */}
                        <Area
                            type="monotone"
                            dataKey="detectionGuard"
                            stroke="#00ff9d"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorDetection)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#00ff9d', boxShadow: '0 0 10px #00ff9d' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-4 flex gap-8 justify-center text-[10px] font-mono-cyber uppercase tracking-wider">
                <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-3 h-1 bg-neon-red shadow-[0_0_5px_var(--neon-red)]"></div> FedAvg (Standard)
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-3 h-1 bg-neon-green shadow-[0_0_5px_var(--neon-green)]"></div> DetectionGuard (Secure)
                </div>
            </div>
        </div>
    );
};

export default AccuracyChart;
