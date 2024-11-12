import React, { useState, useEffect, useRef } from 'react';
import {useTheme} from '@mui/material';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
    TablePagination,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
    Grow,
    Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { Assignment, CheckCircle, Schedule, ErrorOutline, Visibility, Search } from '@mui/icons-material';
import Cookies from "js-cookie";
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../Loader';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const initialProjects = [];

const MotionCard = motion(Card);
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)', // Fallback for undefined shadow
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow:  '0px 8px 30px rgba(0, 0, 0, 0.3)', // Fallback for undefined shadow
    },
}));

export default function LeaderProjects() {
    const theme = useTheme();
    const [projects, setProjects] = useState(initialProjects);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
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
                const res = await axios.get(`http://localhost:3333/leader/fetch-projects/${user_email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (res.status === 201) {
                    setProjects(res.data.projects);
                    setScorecardData([
                        { title: 'Assigned Projects', value: res.data.projects_count },
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

    useEffect(() => {
        const filtered = projects.filter(project =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProjects(filtered);
    }, [searchQuery, projects]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDetailsDialog = (_id) => {
        navigate(`/leader/project-detail/${_id}`);
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
                <TextField
                    label="Search Projects"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 3 }}
                />

                <Grid container spacing={3}>
                    {filteredProjects.length > 0 ? (
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
                                        {filteredProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project, index) => (
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
                                                    <IconButton onClick={() => handleOpenDetailsDialog(project._id)}>
                                                    
                                                    <Button className='btn btn-md btn-warning bg-warning text-white px-4 py-1'>
                                                        VIEW
                                                    </Button>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={filteredProjects.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handlePageChange}
                                    onRowsPerPageChange={handleRowsPerPageChange}
                                />
                            </TableContainer>
                        </Grid>
                    ) : (
                        <Typography variant="h6" sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
                            No projects found.
                        </Typography>
                    )}
                </Grid>
            </Box>
        </Container>
    );
}
