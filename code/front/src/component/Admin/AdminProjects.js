import React, { useState, useEffect, useRef } from 'react';
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
    IconButton,
    Grow,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Assignment, Group, CheckCircle, Schedule, ErrorOutline, Add, Visibility } from '@mui/icons-material';
import Cookies from "js-cookie";
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../Loader';
import { styled } from '@mui/system';

const initialProjects = [];

const MotionCard = motion(Card);

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    boxShadow: (theme.shadows && theme.shadows[3]) ? theme.shadows[3] : '0px 4px 20px rgba(0, 0, 0, 0.2)', // Fallback for undefined shadow
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: (theme.shadows && theme.shadows[8]) ? theme.shadows[8] : '0px 8px 30px rgba(0, 0, 0, 0.3)', // Fallback for undefined shadow
    },
}));

export default function AdminProjects() {
    const theme = useTheme();
    const [projects, setProjects] = useState(initialProjects);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const toastShownRef = useRef(false);
    const [users, setUsers] = useState([]);


    const [scorecardData, setScorecardData] = useState([
        { title: 'Total Projects', value: 0 },
    ]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const token = Cookies.get("auth-token");
                const res = await axios.get('http://localhost:3333/admin/fetch-projects', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (res.status === 201) {
                    setProjects(res.data.projects);
                    setUsers(res.data.users);
                    setScorecardData([
                        { title: 'Total Projects', value: res.data.projects_count },
                    ]);

                    if (!toastShownRef.current) {
                        toast.success(res.data.message);
                        toastShownRef.current = true;
                    }
                } else {
                    if (!toastShownRef.current) {
                        toast.error(res.data.message);
                        toastShownRef.current = true;
                    }
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
                toast.error('Internal server error.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const [inputValues, setInputValues] = useState({ name: '', status: 'Not Started', description: '', leader: '' });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleOpenDetailsDialog = (project) => {
        setSelectedProject(project);
        setOpenDetailsDialog(true);
    };
    const handleCloseDetailsDialog = () => setOpenDetailsDialog(false);

    const handleAddProject = async () => {
        if (!inputValues.name || !inputValues.status || !inputValues.description) {
            toast.error("All fields are required.");
            return;
        }

        try {
            
            const token = Cookies.get('auth-token');
            const res = await axios.post("http://localhost:3333/admin/add-project", { data: inputValues }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (res.status === 201) {
                toast.success(res.data.message);
                handleCloseDialog();
                setInputValues({ name: '', status: 'Not Started', description: '' });
                setProjects([...projects, res.data.project]); // Add new project to the list
            } else {
                toast.error(res.data.message || "Error adding project.");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Internal error occurred.');
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

    if (loading) {
        return <Loader />;
    }

    return (
        <Container sx={{ mt: 4, mb: 4 }}>

            <Grid container spacing={3}>
                {scorecardData.map((card, index) => (
                    <Grow in={true} key={index} timeout={500 * (index + 1)}>
                        <Grid item xs={12} sm={4}>
                            <StyledCard>
                                <CardContent className='flex flex-col justify-center text-center'>
                                    <Typography variant="h5" component="div" className='text-red-500'>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="h3" component="div" sx={{ mt: 2 }} className='text-gray-500'>
                                        {card.value}
                                    </Typography>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    </Grow>
                ))}
            </Grid>

            <Box sx={{ flexGrow: 1, p: 3, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenDialog}
                    sx={{ mb: 3 }}
                >
                    Add Project
                </Button>

                <Grid container spacing={3}>
                    {projects.length > 0 ? (
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Project Name</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Assigned to</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {projects.map((project, index) => {
                                            if (!project) {
                                                return null; // Skip rendering if the project is undefined or null
                                            }

                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{project.name}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            icon={getStatusIcon(project.status)}
                                                            label={project.status}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: getStatusColor(project.status),
                                                                color: theme.palette.getContrastText(getStatusColor(project.status)),
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{project.description}</TableCell>
                                                    <TableCell>{project.leader}</TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={() => handleOpenDetailsDialog(project)}>
                                                            <Visibility />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>

                                </Table>
                            </TableContainer>
                        </Grid>
                    ) : (
                        <Typography variant="h6" sx={{ textAlign: 'center', width: '100%', mt: 4 }} className='text-dark'>
                            No projects found. Please add a project.
                        </Typography>
                    )}
                </Grid>

                {/* Add Project Dialog */}
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
                            name="name"
                            value={inputValues.name}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            select
                            margin="dense"
                            id="leader"
                            label="Assigned to"
                            fullWidth
                            variant="outlined"
                            name="leader"
                            value={inputValues.leader}
                            onChange={handleInputChange}
                            required
                        >
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <MenuItem key={user.email} value={user.email}>
                                        {user.email}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="not found">Not found</MenuItem>
                            )}
                        </TextField>

                        <TextField
                            margin="dense"
                            id="description"
                            label="Project Description"
                            type="text"
                            fullWidth
                            variant="outlined"
                            name="description"
                            value={inputValues.description}
                            onChange={handleInputChange}
                            multiline
                            rows={4}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleAddProject} variant="contained">Add</Button>
                    </DialogActions>
                </Dialog>

                {/* Project Details Dialog */}
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
        </Container>
    );
}
