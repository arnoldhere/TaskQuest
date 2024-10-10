import React, { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/AuthContext";
import Cookies from 'js-cookie';
import axios from 'axios';
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
  Grow,
  Fade,
  TablePagination,
  TextField,
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
  const toastShownRef = useRef(false);

  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scorecardData, setScorecardData] = useState([
    { title: 'Total Users', value: 0 },
    { title: 'Active Users', value: null },
    { title: 'New Users', value: null }
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const FetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3333/admin/fetch-users');
        if (res.status === 201) {
          setFetchedUsers(res.data.users || []);
          setScorecardData([
            { title: 'Total Users', value: res.data.users_count },
            { title: 'Active Users', value: 789 },
            { title: 'New Users', value: 56 }
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
        console.error('Error fetching new users:', error);
        toast.error('An error occurred while fetching users.');
      } finally {
        setLoading(false);
      }
    };

    FetchUsers();
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

  const filteredUsers = fetchedUsers.filter(user =>
    `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Container className="w-full flex flex-col justify-center items-center" sx={{ mt: 4, mb: 4 }}>
        <Grid2 container spacing={3}>
          {scorecardData.map((card, index) => (
            <Grow in={true} key={index} timeout={500 * (index + 1)}>
              <Grid2 item xs={12} sm={4}>
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
              </Grid2>
            </Grow>
          ))}
        </Grid2>

        <Grid2 spacing={3} sx={{ mt: 4, width: '100%' }}>
          <Grid2 item xs={12}>
            <Paper sx={{ p: 2 }}>
              <div className='flex align-center'>
                {/* <Typography variant="h6" gutterBottom component="div">
                  User List
                </Typography> */}
                {/* Search Input */}
                <TextField
                  variant="outlined"
                  placeholder="Search Users"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ mx: 2, width: '300px' }}
                  InputProps={{
                    sx: { height: '40px' }, // Set the desired height here
                  }}
                />
              </div>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sr.</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Joined</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : filteredUsers).map((user, index) => (
                        <Fade in={true} key={index} timeout={300 * (index + 1)}>
                          <AnimatedTableRow>
                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
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
                      ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          No users at the moment.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid2>
        </Grid2>
      </Container>
      <Toaster />
    </>
  );
}
