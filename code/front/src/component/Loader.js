import React from 'react';
import { motion } from 'framer-motion';

export default function Loader({ color = '#3b82f6' }) {
    const containerVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
            },
        },
    };

    const circleVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
    };

    const circleTransition = {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
            <motion.div
                className="relative"
                style={{ width: 200, height: 200 }}
                variants={containerVariants}
                animate="animate"
            >
                {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                    <motion.span
                        key={index}
                        className="absolute rounded-full"
                        style={{
                            width: 40,
                            height: 40,
                            backgroundColor: color,
                            top: `${50 - 30 * Math.cos(index * Math.PI / 4)}%`,
                            left: `${50 + 30 * Math.sin(index * Math.PI / 4)}%`,
                            transformOrigin: 'center',
                        }}
                        variants={circleVariants}
                        initial="initial"
                        animate="animate"
                        transition={{
                            ...circleTransition,
                            delay: index * 0.2,
                        }}
                    />
                ))}
            </motion.div>

            <motion.div
                className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                Loading
            </motion.div>
        </div>
    );
}
