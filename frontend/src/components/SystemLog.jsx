import React, { useEffect, useRef } from 'react';
import { Terminal, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SystemLog = ({ logs }) => {
    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-glass rounded-xl border border-slate-800 overflow-hidden flex flex-col h-full min-h-[300px] relative group">
            {/* Header */}
            <div className="bg-slate-900/80 p-3 border-b border-slate-800 flex justify-between items-center backdrop-blur-sm">
                <div className="flex items-center gap-2 text-neon-blue">
                    <Terminal size={16} />
                    <span className="font-cyber text-xs tracking-wider uppercase">System Log</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                </div>
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            <div className="animate-scanline z-10"></div>

            {/* Log Content */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 font-mono-cyber text-xs space-y-2 scroll-smooth relative z-0"
            >
                <AnimatePresence initial={false}>
                    {logs.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            className="text-slate-500 italic text-center mt-10"
                        >
                            System initialized. Waiting for events...
                        </motion.div>
                    )}

                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-3 items-start border-l-2 border-slate-800 pl-3 py-1 hover:bg-white/5 transition-colors"
                        >
                            <span className="text-slate-500 shrink-0 select-none">
                                [{log.timestamp}]
                            </span>

                            <div className="flex-1 break-words">
                                {log.type === 'info' && <span className="text-blue-400">{log.message}</span>}
                                {log.type === 'success' && <span className="text-neon-green">{log.message}</span>}
                                {log.type === 'warning' && <span className="text-yellow-400">{log.message}</span>}
                                {log.type === 'error' && <span className="text-neon-red">{log.message}</span>}
                                {log.type === 'system' && <span className="text-slate-300 font-bold">{log.message}</span>}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Status Bar */}
            <div className="bg-slate-950/50 p-1.5 text-[10px] text-slate-500 font-mono text-right border-t border-slate-800">
                STATUS: ONLINE | NET: SECURE
            </div>
        </div>
    );
};

export default SystemLog;
