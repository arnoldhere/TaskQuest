import React from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { alpha } from '@mui/material/styles';



// Sample data (replace this with actual data fetching logic)
const sampleTeams = [
    { id: 1, name: 'Frontend Wizards', leader: 'Alice Johnson', members: 5 },
    { id: 2, name: 'Backend Ninjas', leader: 'Bob Smith', members: 4 },
    { id: 3, name: 'DevOps Heroes', leader: 'Charlie Brown', members: 3 },
];

export default function Team() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleCreateTeam = () => {
        // Implement team creation logic here
        console.log('Create team button clicked');
    };

    return (
        <>
            <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
                <Paper
                    elevation={3}
                    sx={{
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                        p: 3,
                        mb: 3,
                        color: 'white',
                        borderRadius: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <GroupIcon sx={{ mr: 1, fontSize: 40 }} />
                            Teams
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<AddIcon />}
                            onClick={handleCreateTeam}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            sx={{ boxShadow: 3 }}
                        >
                            Create Team
                        </Button>
                    </Box>
                </Paper>

                <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Table aria-label="team list">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Team Name</TableCell>
                                {!isMobile && <TableCell sx={{ fontWeight: 'bold' }}>Team Leader</TableCell>}
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Members</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
    <AnimatePresence>
        {sampleTeams.map((team, index) => (
            <motion.tr
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transition: { duration: 0.2 },
                }}
            >
                <TableCell component="th" scope="row">
                    <Typography variant="body1" fontWeight="medium">
                        {team.name}
                    </Typography>
                    {isMobile && (
                        <Typography variant="body2" color="text.secondary">
                            Led by {team.leader}
                        </Typography>
                    )}
                </TableCell>
                {!isMobile && <TableCell>{team.leader}</TableCell>}
                <TableCell align="right">
                    <Box
                        sx={{
                            backgroundColor: theme.palette.success.main,
                            color: 'white',
                            borderRadius: '50%',
                            width: 30,
                            height: 30,
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {team.members}
                    </Box>
                </TableCell>
            </motion.tr>
        ))}
    </AnimatePresence>
</TableBody>

                    </Table>
                </TableContainer>
            </Box>
        </>
    );
}
