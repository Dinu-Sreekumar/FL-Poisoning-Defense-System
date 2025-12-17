import React from 'react';
import { User, ShieldCheck, Ban, Activity, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const ClientGrid = ({ clients }) => {
    return (
        <div className="bg-glass p-6 rounded-xl border border-slate-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                <Cpu size={100} className="text-neon-blue" />
            </div>

            <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-xl font-cyber font-bold text-white flex items-center gap-2">
                    <User size={20} className="text-neon-blue" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        NETWORK STATUS
                    </span>
                </h2>
                <div className="flex gap-4 text-[10px] font-mono-cyber tracking-wider uppercase">
                    <div className="flex items-center gap-1.5 text-slate-300">
                        <div className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_var(--neon-green)]"></div> Active
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                        <div className="w-2 h-2 rounded-full bg-neon-red shadow-[0_0_8px_var(--neon-red)]"></div> Threat
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 relative z-10">
                {clients.map((client, index) => {
                    const isMalicious = client.isMalicious;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.02 }}
                            className={`
                                relative aspect-square rounded-lg flex flex-col items-center justify-center border transition-all duration-300 overflow-hidden group
                                ${!isMalicious
                                    ? 'bg-slate-900/40 border-slate-700/50 hover:border-neon-blue/50 hover:bg-slate-800/60 hover:shadow-[0_0_15px_rgba(0,243,255,0.1)]'
                                    : 'bg-red-950/20 border-red-900/40 hover:border-neon-red/50 hover:shadow-[0_0_15px_rgba(255,42,42,0.1)]'
                                }
                            `}
                        >
                            {/* Background Grid Animation for Honest Clients */}
                            {!isMalicious && (
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[linear-gradient(transparent_1px,_#00f3ff_1px),_linear-gradient(90deg,_transparent_1px,_#00f3ff_1px)] bg-[size:10px_10px]"></div>
                            )}

                            {/* Icon Layer */}
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="relative">
                                    <User
                                        size={24}
                                        className={`
                                            transition-colors duration-300
                                            ${!isMalicious
                                                ? 'text-slate-400 group-hover:text-neon-blue'
                                                : 'text-red-900/60'
                                            }
                                        `}
                                    />

                                    {/* Malicious Overlay */}
                                    {isMalicious && (
                                        <motion.div
                                            initial={{ scale: 1.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="absolute -inset-3 flex items-center justify-center"
                                        >
                                            <ShieldCheck
                                                size={32}
                                                className="text-neon-red drop-shadow-[0_0_8px_rgba(255,42,42,0.8)]"
                                                strokeWidth={1.5}
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                <span className={`
                                    text-[10px] mt-2 font-mono-cyber font-bold
                                    ${!isMalicious ? 'text-slate-500 group-hover:text-neon-blue' : 'text-red-800/60'}
                                `}>
                                    ID_{index + 1}
                                </span>
                            </div>

                            {/* Status Indicator Dot */}
                            <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isMalicious ? 'bg-red-900' : 'bg-slate-700 group-hover:bg-neon-blue group-hover:shadow-[0_0_5px_var(--neon-blue)]'}`}></div>

                            {/* Excluded Label (Only for Malicious) */}
                            {isMalicious && (
                                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                                    <span className="text-[8px] font-bold tracking-wider text-neon-red uppercase border border-red-900/50 px-1 rounded bg-red-950/50 backdrop-blur-sm">
                                        BLOCKED
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default ClientGrid;
