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
import { Assignment, Group, CheckCircle, Schedule, ErrorOutline, Add, Visibility, Cookie } from '@mui/icons-material';
import Cookies from "js-cookie";
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../Loader';
import { styled } from '@mui/system';
import { Link, useNavigate } from 'react-router-dom';

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

export default function LeaderProjects() {
    const theme = useTheme();
    const [projects, setProjects] = useState(initialProjects);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const toastShownRef = useRef(false);

    const navigate = useNavigate();

    const [scorecardData, setScorecardData] = useState([
        { title: 'Total Projects', value: 0 },
    ]);

    const token = Cookies.get("auth-token");
    useEffect(() => {
        const fetchProjects = async () => {
            try {

                const user_email = Cookies.get('email');
                setLoading(true);
                console.log(user_email)
                const res = await axios.get(`http://localhost:3333/leader/fetch-projects/${user_email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (res.status === 201) {
                    setProjects(res.data.projects);
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

    // const [inputValues, setInputValues] = useState({ name: '', status: 'Not Started', description: '', leader: '' });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleOpenDetailsDialog = (_id) => {
        // toast.loading("please wait...");
        console.log(_id)
        navigate(`/leader/project-detail/${_id}`);
    };
    const handleCloseDetailsDialog = () => setOpenDetailsDialog(false);

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
        <Container sx={{ mt: 4, mb: 1 }}>
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
                                                return <h3 className='text-center text-red-500'>No projects Assigned</h3>;
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
                                                        {project._id ? (
                                                            <IconButton onClick={() => handleOpenDetailsDialog(project._id)}>
                                                                <span className="text-center text-sm"><Visibility /> View</span>
                                                            </IconButton>
                                                        ) : (
                                                            <span>No ID available</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>

                                </Table>
                            </TableContainer>
                        </Grid>
                    ) : (
                        <Typography variant="h6" sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
                            No projects found. Please add a project.
                        </Typography>
                    )}
                </Grid>



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
