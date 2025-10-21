// components/ProgressBar.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ProgressBarProps {
    progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (progress > 0 && progress < 100) {
            setVisible(true);
        } else if (progress === 100) {
            // po 1.5 sekundy od ukończenia chowamy pasek
            const timer = setTimeout(() => setVisible(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [progress]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed top-2 left-1/2 -translate-x-1/2 w-96 bg-green-50 border rounded-2xl border-green-300 p-3 z-50"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {progress < 100 ? (
                        <div className="relative h-4 bg-gray-50 rounded-full overflow-hidden">
                            <motion.div
                                className="h-4 bg-green-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            />
                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-gray-700">
                                {progress}%
                            </span>
                        </div>
                    ) : (
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="text-green-600 font-bold text-lg">
                                ✅ Completed!
                            </span>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
