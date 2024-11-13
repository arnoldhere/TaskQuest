import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, UserPlus, Calendar, Clock, Delete, TrashIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Table from "@mui/material/Table";
import { TableContainer } from '@mui/material';
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import { Paper } from '@mui/material';
// import Chcekc
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
// import TableContainer from '@mui/material';
import Badge from "@mui/material/Badge";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';

export default function TeamDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toastShownRef = useRef(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState('');
    const [teamData, setTeamData] = useState({
        name: '',
        createdAt: '',
        deadline: '',
        leader: '',
        members: [],
    });
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const token = Cookies.get("auth-token");
                const res = await axios.get(`http://localhost:3333/leader/fetch-team-detail/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.status === 201) {
                    if (!toastShownRef.current) {
                        toast.success(res.data.message);
                        toastShownRef.current = true;
                    }
                    setTeamData(res.data.team);
                    console.log('Fetched team data:', res.data.team);
                } else {
                    toast.error(res.data.message);
                }
            } catch (error) {
                console.error('Error fetching team details:', error);
                toast.error('An error occurred while fetching team details.');
            }
        }

        const fetchMembers = async () => {
            try {
                const token = Cookies.get("auth-token");
                const res = await axios.post('http://localhost:3333/leader/fetch-members', {}, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.status === 201) {
                    setMembers(res.data.users);
                } else {
                    toast.error(res.data.message);
                }
            } catch (error) {
                console.error('Error fetching members:', error);
                toast.error('An error occurred while fetching members.');
            }
        };

        fetchTeam();
        fetchMembers();
    }, [id]);

    const removeMember = async (userId) => {
        try {

            const res = await axios.get(`http://localhost:3333/leader/remove-member/${userId}`)
            if (res.status === 201) {
                toast.success(res.data.message || "Member removed successfully")
                navigate("/leader/team")
            }
            else {
                toast.error(res.data.message || "Try again later");
            }

        } catch (error) {
            console.error('Error removing member:', error);
            toast.error('Internal server error.');
        }

    }

    const handleAddMember = async () => {
        if (!selectedMember) {
            toast.error("Please select a member to add.");
            return;
        }

        try {
            const token = Cookies.get("auth-token");
            const res = await axios.post('http://localhost:3333/leader/add-member',
                { tid: id, member: selectedMember },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (res.status === 201) {
                toast.success(res.data.message);
                setIsAddMemberOpen(false);
                const updatedTeam = await axios.get(`http://localhost:3333/leader/fetch-team-detail/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setTeamData(updatedTeam.data.team);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error('Error adding member:', error);
            toast.error('An error occurred while adding the member.');
        }
    };

    const handleCloseDialog = () => {
        setIsAddMemberOpen(false);
    };

    return (
        <>
            <Toaster />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="container mx-auto p-4 space-y-8"
            >
                <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-2">{teamData.name}</h1>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center">
                            <User className="mr-2 h-5 w-5" />
                            <span className="font-medium">Team Leader:</span>
                            <span className="ml-2">{teamData.leader}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-5 w-5" />
                            <span>Created: {new Date(teamData.createdAt).toLocaleDateString()}</span>
                        </div>
                        {teamData.deadline && (
                            <div className="flex items-center">
                                <Clock className="mr-2 h-5 w-5" />
                                <span>Deadline: {new Date(teamData.deadline).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </header>

                <section className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Team Members</h2>
                        <Badge variant="secondary" className="text-lg">
                            {teamData.members.length} {teamData.members.length === 1 ? 'Member' : 'Members'}
                        </Badge>
                    </div>

                    <Button
                        className="mb-3 btn btn-primary bg-primary text-white"
                        onClick={() => setIsAddMemberOpen(true)}
                    >
                        <UserPlus className="mr-2 h-5 w-5" />
                        Add Team Member
                    </Button>

                    <Dialog open={isAddMemberOpen} onClose={handleCloseDialog} className='p-5'>
                        <DialogContent>
                            <DialogTitle>Add Team Member</DialogTitle>
                            <hr />
                            Select a member to add to the team. Click add when you're done.
                            <hr />
                            <div className="container mt-4">
                                <FormControl fullWidth >
                                    <InputLabel>Select a member</InputLabel>
                                    <Select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
                                        {members.map((member) => (
                                            <MenuItem key={member._id} value={member._id}>
                                                {member.firstname} {member.lastname}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleAddMember} className="mb-3 btn btn-primary bg-success text-white"
                            >Add Member</Button>
                            <Button className="mb-3 btn btn-primary bg-danger text-white"
                                onClick={handleCloseDialog} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <hr />
                    <TableContainer component={Paper} className="max-h-96 overflow-auto">
                        <Table stickyHeader className='table table-centered align-items-center'>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="font-semibold">Sr.</TableCell>
                                    <TableCell className="font-semibold">Name</TableCell>
                                    <TableCell className="font-semibold">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {teamData.members.length > 0 ? (
                                    teamData.members.map((memberObj, index) => (
                                        <TableRow key={memberObj.user._id} className="hover:bg-gray-50">
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{memberObj.user.firstname} {memberObj.user.lastname}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    size="small"
                                                    startIcon={<CancelIcon />}
                                                    onClick={() => removeMember(memberObj.user._id)}
                                                    className="hover:bg-blue-600"
                                                >
                                                    Remove
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-gray-500">
                                            No team members at the moment.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                        </Table>
                    </TableContainer>
                </section>
            </motion.div>
        </>
    );
}
