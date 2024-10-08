import React, { useState, useEffect } from 'react';
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


export default function NewUsersList() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating API call to fetch pending users
        const fetchPendingUsers = async () => {
            setLoading(true);
            // Replace this with your actual API call
            await new Promise(resolve => setTimeout(resolve, 5000));
            const newusers = [
                { id: '1', name: 'John Doe', email: 'john@example.com', registrationDate: '2023-05-01' },
                { id: '2', name: 'Jane Smith', email: 'jane@example.com', registrationDate: '2023-05-02' },
                { id: '3', name: 'Bob Johnson', email: 'bob@example.com', registrationDate: '2023-05-03' },
            ];
            setPendingUsers(newusers);
            setLoading(false);
        };

        fetchPendingUsers();
    }, []);

    const handleApprove = (userId) => {
        // Implement user approval logic here
        console.log(`Approving user with ID: ${userId}`);
        setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    };

    const handleReject = (userId) => {
        // Implement user rejection logic here
        console.log(`Rejecting user with ID: ${userId}`);
        setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    };

    if (loading) {
        // toast.loading("Please wait a moment...")
        return <Loader />;
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <h2 className="text-2xl font-bold p-4 bg-gray-100">Pending Users</h2>
            <TableContainer component={Paper} className="max-h-96 overflow-auto">
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className="font-semibold">Name</TableCell>
                            <TableCell className="font-semibold">Email</TableCell>
                            <TableCell className="font-semibold">Registration Date</TableCell>
                            <TableCell className="font-semibold">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pendingUsers.map((user) => (
                            <TableRow key={user.id} className="hover:bg-gray-50">
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.registrationDate}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            startIcon={<CheckCircleOutlineIcon className="w-4 h-4" />}
                                            onClick={() => handleApprove(user.id)}
                                            className="bg-green-500 hover:bg-green-600"
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<CancelIcon className="w-4 h-4" />}
                                            onClick={() => handleReject(user.id)}
                                            className="bg-red-500 hover:bg-red-600"
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {pendingUsers.length === 0 && (
                <div className="p-4 text-center text-gray-500">No pending users at the moment.</div>
            )}
        </div>
    );
}
