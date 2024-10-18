import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemText,
    Chip,
    useTheme,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import { Assignment, Group, CheckCircle, Schedule, ErrorOutline, Add, Visibility } from '@mui/icons-material';

// Mock data
const initialProjects = [
    { id: 1, name: 'Website Redesign', status: 'In Progress', description: 'Redesigning the company website for better user experience and modern look.' },
    { id: 2, name: 'Mobile App Development', status: 'Completed', description: 'Developed a new mobile app for both iOS and Android platforms.' },
    { id: 3, name: 'Database Migration', status: 'Delayed', description: 'Migrating the current database to a more scalable solution.' },
    { id: 4, name: 'AI Integration', status: 'In Progress', description: 'Integrating AI capabilities into our existing product suite.' },
    { id: 5, name: 'Security Audit', status: 'Not Started', description: 'Conducting a comprehensive security audit of all our systems.' },
];

const teamCount = 8;

const MotionCard = motion(Card);

export default function LeaderProjects() {
    const theme = useTheme();
    const [projects, setProjects] = useState(initialProjects);
    const [openDialog, setOpenDialog] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', status: 'Not Started', description: '' });
    const [selectedProject, setSelectedProject] = useState(null);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleOpenDetailsDialog = (project) => {
        setSelectedProject(project);
        setOpenDetailsDialog(true);
    };
    const handleCloseDetailsDialog = () => setOpenDetailsDialog(false);

    const handleAddProject = () => {
        if (newProject.name) {
            setProjects([...projects, { id: projects.length + 1, ...newProject }]);
            setNewProject({ name: '', status: 'Not Started', description: '' });
            handleCloseDialog();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return theme.palette.success.main;
            case 'In Progress':
                return theme.palette.info.main;
            case 'Delayed':
                return theme.palette.warning.main;
            case 'Not Started':
                return theme.palette.error.main;
            default:
                return theme.palette.text.secondary;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed':
                return <CheckCircle />;
            case 'In Progress':
                return <Schedule />;
            case 'Delayed':
                return <ErrorOutline />;
            case 'Not Started':
                return <Assignment />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <MotionCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        sx={{ height: '100%' }}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Total Projects
                            </Typography>
                            <Box display="flex" alignItems="center">
                                <Assignment sx={{ fontSize: 48, color: theme.palette.primary.main, mr: 2 }} />
                                <Typography variant="h3">{projects.length}</Typography>
                            </Box>
                        </CardContent>
                    </MotionCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <MotionCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        sx={{ height: '100%' }}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Total Teams
                            </Typography>
                            <Box display="flex" alignItems="center">
                                <Group sx={{ fontSize: 48, color: theme.palette.secondary.main, mr: 2 }} />
                                <Typography variant="h3">{teamCount}</Typography>
                            </Box>
                        </CardContent>
                    </MotionCard>
                </Grid>
                <Grid item xs={12}>
                    <MotionCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h5">
                                    Project List
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={handleOpenDialog}
                                >
                                    Add Project
                                </Button>
                            </Box>
                            <List>
                                {projects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <ListItem
                                            divider
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="view details" onClick={() => handleOpenDetailsDialog(project)}>
                                                    <Visibility /> <p className='text-red-500'>View</p>
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary={project.name}
                                                secondary={
                                                    <Chip
                                                        icon={getStatusIcon(project.status)}
                                                        label={project.status}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: getStatusColor(project.status),
                                                            color: theme.palette.getContrastText(getStatusColor(project.status)),
                                                        }}
                                                    />
                                                }
                                            />
                                        </ListItem>
                                    </motion.div>
                                ))}
                            </List>
                        </CardContent>
                    </MotionCard>
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Project Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                    <TextField
                        select
                        margin="dense"
                        id="status"
                        label="Project Status"
                        fullWidth
                        variant="outlined"
                        value={newProject.status}
                        onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    >
                        <MenuItem value="Not Started">Not Started</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Delayed">Delayed</MenuItem>
                    </TextField>
                    <TextField
                        margin="dense"
                        id="description"
                        label="Project Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAddProject} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDetailsDialog} onClose={handleCloseDetailsDialog}>
                <DialogTitle>{selectedProject?.name}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Status:
                        <Chip
                            icon={getStatusIcon(selectedProject?.status)}
                            label={selectedProject?.status}
                            size="small"
                            sx={{
                                ml: 1,
                                backgroundColor: getStatusColor(selectedProject?.status),
                                color: theme.palette.getContrastText(getStatusColor(selectedProject?.status)),
                            }}
                        />
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Description: {selectedProject?.description}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetailsDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}