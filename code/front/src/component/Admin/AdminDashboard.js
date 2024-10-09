import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/AuthContext";
import Cookies from 'js-cookie';
import axios from 'axios'; // Import axios to fetch users
import Loader from '../Loader';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';

// Mock data for scorecards
const scorecardData = [
  { title: 'Total Users', value: 1234 },
  { title: 'Active Users', value: 789 },
  { title: 'New Users (This Month)', value: 56 },
];

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State to hold fetched users
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users on component mount
  useEffect(() => {
    const FetchUsers = async () => {
      try {
        setLoading(true); // Show loader while fetching users
        const res = await axios.get('http://localhost:3333/admin/fetch-users'); // Fetch users
        if (res.status === 201) {
          setFetchedUsers(res.data.users || []); // Set users to state
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error('Error fetching new users:', error);
        toast.error('An error occurred while fetching users.');
      } finally {
        setLoading(false); // Hide loader after fetching users
      }
    };

    FetchUsers(); // Call the fetch function
  }, []);

  useEffect(() => {
    const authToken = Cookies.get('auth-token');
    if (!isAuthenticated && !authToken) {
      navigate("/login", { message: "Authentication forbidden !! login required" });
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {scorecardData.map((card, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {card.title}
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                    {card.value}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                User List
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Joined</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fetchedUsers.length > 0 ? (
                      fetchedUsers.map((user, index) => (
                        <TableRow key={index + 1}>
                          <TableCell>{user.firstname + " " + user.lastname}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            {new Date(user.joined).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })}
                          </TableCell> {/* Format the date */}
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
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Toaster />
    </>
  );
}