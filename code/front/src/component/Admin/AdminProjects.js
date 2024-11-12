import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
    TablePagination,
    InputAdornment
} from '@mui/material';
import { Add, Visibility, Search } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../Loader';
import { styled } from '@mui/system';
import dayjs from 'dayjs';

const initialProjects = [];

const MotionTableRow = motion(TableRow);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(2),
    fontWeight: 'bold',
}));

export default function AdminProjects() {
    const [projects, setProjects] = useState(initialProjects);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [inputValues, setInputValues] = useState({ name: '', status: 'Not Started', description: '', leader: '', deadline: '' });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const token = Cookies.get('auth-token');
                const res = await axios.get('http://localhost:3333/admin/fetch-projects', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (res.status === 201) {
                    setProjects(res.data.projects);
                    console.log('Fetched projects:', res.data.projects);  // Log the data
                    setUsers(res.data.users);
                    if (res.data.projects.length > 0) {
                        setFilteredProjects(res.data.projects);
                    }
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
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
            project && project.name && project.name.toLowerCase().includes(searchQuery.toLowerCase())
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

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleAddProject = async () => {
        const { name, status, description, leader, deadline } = inputValues;

        if (!name || !status || !description || !deadline) {
            toast.error('All fields are required.');
            return;
        }

        if (dayjs(deadline).isBefore(dayjs(), 'day')) {
            toast.error('Deadline must be in the future.');
            return;
        }

        try {
            const token = Cookies.get('auth-token');
            const res = await axios.post('http://localhost:3333/admin/add-project', { data: inputValues }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (res.status === 201) {
                toast.success(res.data.message);
                handleCloseDialog();
                setInputValues({ name: '', status: 'Not Started', description: '', leader: '', deadline: '' });
                setProjects([...projects, res.data.project]);
            } else {
                toast.error(res.data.message || 'Error adding project.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Internal error occurred.');
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
                <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog} sx={{ mb: 3 }}>
                    Add Project
                </Button>
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
                {filteredProjects.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Project Name</StyledTableCell>
                                    <StyledTableCell>Status</StyledTableCell>
                                    <StyledTableCell>Description</StyledTableCell>
                                    <StyledTableCell>Assigned to</StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project, index) => (
                                    <MotionTableRow
                                        key={project._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <TableCell>{project.name}</TableCell>
                                        <TableCell>{project.status}</TableCell>
                                        <TableCell>{project.description}</TableCell>
                                        <TableCell>{project.leader}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => setSelectedProject(project)}>
                                                <Visibility />
                                            </IconButton>
                                        </TableCell>
                                    </MotionTableRow>
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
                ) : (
                    <Typography variant="p" sx={{ textAlign: 'center', width: '100%', mt: 4 }} className='text-center text-gray-500'>
                        No projects found. Please add a project.
                    </Typography>
                )}
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogContent>
                    {/* Form Fields for Project */}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Project Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        name="name"
                        value={inputValues.name}
                        onChange={(e) => setInputValues({ ...inputValues, name: e.target.value })}
                        required
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Assigned to"
                        fullWidth
                        variant="outlined"
                        name="leader"
                        value={inputValues.leader}
                        onChange={(e) => setInputValues({ ...inputValues, leader: e.target.value })}
                        required
                    >
                        {users.map((user) => (
                            <MenuItem key={user.email} value={user.email}>
                                {user.firstname} {user.lastname}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        label="Project Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        name="description"
                        value={inputValues.description}
                        onChange={(e) => setInputValues({ ...inputValues, description: e.target.value })}
                        multiline
                        rows={4}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Deadline"
                        type="date"
                        fullWidth
                        variant="outlined"
                        name="deadline"
                        value={inputValues.deadline}
                        onChange={(e) => setInputValues({ ...inputValues, deadline: e.target.value })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAddProject} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
