import React, { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/AuthContext";
import Cookies from 'js-cookie';
import axios from 'axios'; // Import axios to fetch users
import Loader from '../Loader';
import {
  Typography,
  Container,
  Grid2,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grow, Fade
} from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[8],
  },
}));


const AnimatedTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // Ref to track whether toast was already shown
  const toastShownRef = useRef(false);

  // State to hold fetched users
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // state to hold scorecard 
  const [scorecardData, setScorecardData] = useState([
    { title: 'Total Users', value: 0 },
    { title: 'Active Users', value: null },
    { title: 'New Users', value: null }
  ]);

  // Fetch users on component mount
  useEffect(() => {
    const FetchUsers = async () => {
      try {
        setLoading(true); // Show loader while fetching users
        const res = await axios.get('http://localhost:3333/admin/fetch-users'); // Fetch users
        if (res.status === 201) {
          setFetchedUsers(res.data.users || []); // Set users to state
          // Update scorecard data with fetched total user count
          setScorecardData([
            { title: 'Total Users', value: res.data.users_count }, // Use the correct total users count
            { title: 'Active Users', value: 789 }, // Example static value
            { title: 'New Users', value: 56 } // Example static value
          ]);
          if (!toastShownRef.current) {
            toast.success(res.data.message);
            toastShownRef.current = true; // Set ref to true after first toast
          }
        } else {
          if (!toastShownRef.current) {
            toast.error(res.data.message);
            toastShownRef.current = true; // Set ref to true after first toast
          }
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
      <Container className="w-full flex flex-col justify-center items-center "
        sx={{ mt: 4, mb: 4 }}>
        <Grid2 container spacing={3}>
          {scorecardData.map((card, index) => (
            <Grow in={true} key={index} timeout={500 * (index + 1)}>
              <Grid2 item xs={12} sm={4}>
                <StyledCard>
                  <CardContent className='flex flex-col justify-center	text-center '>
                    <Typography variant="h5" component="div" className='text-red-500'>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" component="div" sx={{ mt: 2 }} className='text-gray-500'>
                      {card.value}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid2>
            </Grow>
          ))}
        </Grid2>

        <Grid2 container spacing={3} sx={{ mt: 4 }}>
          <Grid2 item xs={12}>
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
                        <Fade in={true} key={index} timeout={300 * (index + 1)}>
                          <AnimatedTableRow>
                            <TableCell>{user.firstname + " " + user.lastname}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                              {new Date(user.joined).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              })}
                            </TableCell>
                          </AnimatedTableRow>
                        </Fade>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          No users at the moment.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid2>
        </Grid2>
      </Container>
      <Toaster />
    </>
  );
}