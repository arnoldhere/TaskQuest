import React from 'react';
import { motion } from 'framer-motion';
import { Button, Typography, Box, useTheme } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function AdminLanding() {
    const theme = useTheme();

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.5
            }
        }
    };

    return (
        <div>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        backgroundColor: theme.palette.background.default,
                        padding: theme.spacing(3),
                        textAlign: 'center',
                    }}
                >
                    <motion.div variants={iconVariants}>
                        <LoginIcon
                            sx={{
                                fontSize: 80,
                                color: theme.palette.primary.main,
                                marginBottom: theme.spacing(2)
                            }}
                        />
                    </motion.div>

                    <motion.div variants={childVariants}>
                        <Typography variant="h3" component="h1" gutterBottom>
                            Hey !! Admin
                        </Typography>
                    </motion.div>

                    <motion.div variants={childVariants}>
                        <Typography variant="h5" gutterBottom sx={{ marginBottom: theme.spacing(3) }}>
                            Please log in to access your dashboard
                        </Typography>
                    </motion.div>

                    <motion.div
                        variants={childVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/admin/login">
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
                                Login as Admin
                            </Button>
                        </Link>
                    </motion.div>
                </Box>
            </motion.div>
        </div>
    )
}

