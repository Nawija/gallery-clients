// components/ProgressBar.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ProgressBarProps {
    progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="mt-4 relative h-10">
            <AnimatePresence>
                {/* Pasek progresu + procenty */}
                {progress < 100 && (
                    <motion.div
                        className="w-full bg-gray-200 h-5 rounded-full overflow-hidden relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                            opacity: 0,
                            y: -20,
                            transition: { duration: 0.4 },
                        }}
                    >
                        <motion.div
                            className="h-5 rounded-full bg-green-600 animate-pulse"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                        <span className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-xs text-gray-700 font-medium">
                            {progress}%
                        </span>
                    </motion.div>
                )}

                {/* Animowany napis Completed */}
                {progress === 100 && (
                    <motion.div
                        className="w-full text-center absolute bottom-0"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, scale: 1.5 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 12,
                        }}
                    >
                        <span className="text-green-600 font-bold text-lg">
                            ✅ Completed!
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
