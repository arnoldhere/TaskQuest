import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    Card,
    MenuItem,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Chip,
    Box,
    IconButton,
    useMediaQuery,
    TextField,
    useTheme,
    Button,
    Modal,
} from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import toast, { Toaster } from 'react-hot-toast'
import Cookies from 'js-cookie';
import axios from 'axios'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function TeamDetail() {
    const { id } = useParams(); // Extract project ID from the URL
    console.log(id);
    const tid = id;
    const navigate = useNavigate();
    const toastShownRef = useRef(false);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [inputValues, setInputValues] = useState({ member: '' });
    0
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const [teamData, setTeamData] = useState({
        name: '',
        createdAt: '',
        leader: '',
        members: [],
        // technologies: [],
    });

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                // setLoading(true);
                const token = Cookies.get("auth-token");
                console.log(id)
                const res = await axios.get(`http://localhost:3333/leader/fetch-team-detail/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (res.status === 201) {
                    if (!toastShownRef.current) {
                        toast.success(res.data.message);
                        toastShownRef.current = true;
                    }
                    const team = res.data.team;
                    setTeamData(team);
                } else {
                    if (!toastShownRef.current) {
                        toast.error(res.data.message);
                        toastShownRef.current = true;
                    }
                }
            } catch (error) {
                console.error('Error fetching team details:', error);
                toast.error('An error occurred while fetching team detail.');
            } finally {
                // setLoading(false);
            }
        };

        fetchTeam();
    }, [id]);

    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                // setLoading(true);
                const token = Cookies.get("auth-token");
                const res = await axios.post('http://localhost:3333/leader/fetch-members', {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (res.status === 201) {
                    setMembers(res.data.users);
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
                // setLoading(false);
            }
        };

        fetchMembers();
    }, []);


    const [expanded, setExpanded] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const toggleExpand = () => {
        setExpanded(!expanded)
    }

    const cardVariants = {
        collapsed: { height: isMobile ? '200px' : '250px' },
        expanded: { height: 'auto' },
    }

    const contentVariants = {
        collapsed: { opacity: 0, y: -20 },
        expanded: { opacity: 1, y: 0 },
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inputValues) {
            toast.error("Add a member !!");
        }

        const token = Cookies.get("auth-token");

        const res = await axios.post('http://localhost:3333/leader/add-member', { tid: tid, member: inputValues.member }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        if (res.status === 201) {
            if (!toastShownRef.current) {
                toast.success(res.data.message);
                toastShownRef.current = true;
            }
            // navigate('leader/team')
            // <Link to={"/leader/team"} />
        } else {
            if (!toastShownRef.current) {
                toast.error(res.data.message);
                toastShownRef.current = true;
            }
        }


    }

    return (
        <>
            <motion.div
                initial="collapsed"
                animate={expanded ? 'expanded' : 'collapsed'}
                variants={cardVariants}
                transition={{ duration: 0.3 }}
            >
                <Card sx={{ overflow: 'hidden', position: 'relative', width: '100%', maxWidth: 800, margin: 'auto', marginTop: '10rem' }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            {teamData.name}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {teamData.createdAt}
                        </Typography>
                        {/* <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1">Status: {projectData.status}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1">
                                    Duration: {projectData.createdAt} - {projectData.endDate}
                                </Typography>
                            </Grid>
                        </Grid> */}
                        <Box mt={2}>
                            {/* {projectData.technologies.map((tech) => (
              <Chip key={tech} label={tech} sx={{ mr: 1, mb: 1 }} />
            ))} */}
                            <Typography variant="subtitle1">
                                Team Leader Contact: <hr />{teamData.leader}
                            </Typography>
                        </Box>
                    </CardContent>

                    <motion.div
                        variants={contentVariants}
                        transition={{ duration: 0.3 }}
                        style={{ display: expanded ? 'block' : 'none' }}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Team :
                            </Typography>
                            <Button variant='contained' sx={{ margin: "5px 2px" }} onClick={handleOpen}>Add Member</Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Select the member
                                    </Typography>
                                    <form method='post' onSubmit={handleSubmit}>
                                        <TextField
                                            select
                                            margin="dense"
                                            id="leader"
                                            label="Select a member"
                                            fullWidth
                                            variant="outlined"
                                            name="member"
                                            value={inputValues.member}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {members.length > 0 ? (
                                                members.map((member) => (
                                                    <MenuItem key={member.email} value={member.email} >
                                                        {member.email}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="not found">Not found</MenuItem>
                                            )}
                                            <hr />
                                        </TextField>
                                        <button className='my-3 mx-1 bg-blue-500 px-3 py-2 text-red-800 rounded' type='submit'>ADD</button>
                                    </form>
                                </Box>
                            </Modal>
                            <hr />
                            <Grid container spacing={2}>
                                {teamData.members && teamData.members.map((member, index) => (
                                    <Grid item xs={12} sm={6} key={index + 1}>
                                        <Box display="flex" alignItems="center">
                                            <Box>
                                                <Typography variant="subtitle1"> {index + 1 + ") "} {member}</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </motion.div>

                    <IconButton
                        onClick={toggleExpand}
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            backgroundColor: 'background.paper',
                            borderRadius: 0,
                            marginTop: '20px',
                        }}
                    >
                        {expanded ?
                            (<>
                                <ExpandLess />
                                <span className='text-xs text-red-800'>See less</span>
                            </>
                            )
                            : (
                                <>
                                    <ExpandMore />
                                    <span className='text-xs text-red-800'>See more</span>
                                </>
                            )}
                    </IconButton>
                </Card >
            </motion.div >
            <Toaster />
        </>
    )
}
