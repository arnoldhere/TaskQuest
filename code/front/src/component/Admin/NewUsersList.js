import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import Loader from '../Loader';
import toast from 'react-hot-toast';

export default function NewUsersList() {
    const [pendingUsers, setPendingUsers] = useState([]); // State to hold pending users
    const [loading, setLoading] = useState(true); // State to show/hide loade
    const toastShownRef = useRef(false);

    // Fetch pending users on component mount
    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                setLoading(true); // Show loader while fetching users
                const res = await axios.get('http://localhost:3333/admin/fetch-newusers'); // Fetch users

                if (res.status === 201) {
                    setPendingUsers(res.data.users || []); // Set users to state
                    console.log(res.data.users);
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
                console.error('Error fetching new users:', error);
                toast.error('An error occurred while fetching users.');
            } finally {
                setLoading(false); // Hide loader after fetching users
            }
        };

        fetchPendingUsers(); // Call the fetch function
    }, []);

    const handleApprove = async (userId) => {
        try {
            // Send request to update user status to 'confirmed'
            const res = await axios.put(`http://localhost:3333/admin/approve-user/${userId}`);

            if (res.status === 201) {
                // Immediately update the local state after success
                setPendingUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
                toast.success('User approved successfully');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error('Error approving user:', error);
            toast.error('An error occurred while approving the user.');
        }
    };


    // Handle reject action
    const handleReject = (userId) => {
        console.log(`Rejecting user with ID: ${userId}`);
        setPendingUsers(pendingUsers.filter(user => user.id !== userId)); // Remove user from state
    };

    // Show loader while fetching data
    if (loading) {
        return <Loader />; // Display loader while fetching users
    }

    // Render the table with users
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mt-5">
            <h2 className="text-2xl font-bold p-4 text-red-500">Pending Users</h2>
            <TableContainer component={Paper} className="max-h-96 overflow-auto">
                <Table stickyHeader>
                    <TableHead>
                        <TableRow >
                            <TableCell className="font-semibold">Sr.</TableCell>
                            <TableCell className="font-semibold">Name</TableCell>
                            <TableCell className="font-semibold">Email</TableCell>
                            <TableCell className="font-semibold">Status</TableCell>
                            <TableCell className="font-semibold">Registration Date</TableCell>
                            <TableCell className="font-semibold">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pendingUsers.length > 0 ? (
                            pendingUsers.map((user, index) => (
                                <TableRow key={user._id} className="hover:bg-gray-50"> {/* Add key prop */}
                                    <TableCell>{index + 1}</TableCell> {/* Serial number */}
                                    <TableCell>{user.firstname}</TableCell> {/* Display user name */}
                                    <TableCell>{user.email}</TableCell> {/* Display user email */}
                                    <TableCell>{user.status}</TableCell> {/* Display user status */}
                                    <TableCell>{user.joined}</TableCell> {/* Display registration date */}
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                startIcon={<CheckCircleOutlineIcon />}
                                                onClick={() => handleApprove(user._id)}
                                                className="hover:bg-blue-600"
                                            >
                                                Approve
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-gray-500">
                                    No pending users at the moment.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </TableContainer>
        </div>
    );
}
