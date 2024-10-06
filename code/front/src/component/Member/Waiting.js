import React from 'react'
import { motion } from 'framer-motion'
import { Button, Typography, useTheme } from '@mui/material'
import { Login as LoginIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom'
export default function Waiting() {
    const dotVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    }
    const theme = useTheme();

    const containerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.3,
                when: "beforeChildren",
                staggerChildren: 0.2,
            },
        },
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
            <motion.div
                className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h2
                    className="text-2xl font-bold mb-4 text-gray-800"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    Please wait while you are being activated
                </motion.h2>
                <div className="flex justify-center items-center space-x-2 mb-6">
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            className="w-3 h-3 bg-blue-500 rounded-full"
                            variants={dotVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 0.8,
                                delay: index * 0.2,
                            }}
                        />
                    ))}
                </div>
                <motion.div
                    className="w-full bg-gray-200 rounded-full h-2 mb-4"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="bg-blue-500 h-2 rounded-full"></div>
                </motion.div>
                <motion.p
                    className="text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    This may take a few hours or couple of days. Thank you for your patience.
                </motion.p>
                <br />
                <hr />
                <br />
                <Link to="/login">
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<LoginIcon />}
                        sx={{
                            fontWeight: 'bold',
                            padding: theme.spacing(1.5, 4),
                            borderRadius: theme.shape.borderRadius * 2,
                        }}
                    >
                        Go Back
                    </Button>
                </Link>
            </motion.div>

        </div>
    )
}