import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  LinearProgress,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { Assignment, Star, TrendingUp, CheckCircle } from '@mui/icons-material';

// Dummy data for the team member
const teamMemberData = {
  // name: 'Alice Johnson',
  // role: 'Senior Developer',
  avatar: '/placeholder.svg?height=100&width=100',
};

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [fetchedTeams, setFetchedTeams] = useState([]);
  const [scorecardData, setScorecardData] = useState([
    { title: 'Total projects', value: null },
    { title: 'Productivity', value: null },
    { title: 'Working Teams', value: null },
    { title: 'Communication', value: null },
    { title: 'Quality score', value: null },
  ]);
  const toastShownRef = useRef({ current: false });

  useEffect(() => {
    const fetchAssociatedTeams = async () => {
      try {
        const token = Cookies.get("auth-token");
        const email = Cookies.get("email");
        console.log(email);
        const res = await axios.post('http://localhost:3333/member/fetch-associated-teams', { email }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.status === 201) { // Status 200 for successful requests
          setFetchedTeams(res.data.teams);
          setScorecardData([
            // { title: 'Total projects', value: res.data.project_count },
            { title: 'Productivity', value: res.data.productivity || 55 }, // Default value if not provided
            { title: 'Communication', value: res.data.communication || 55 },
            { title: 'Quality score', value: res.data.qualityScore || 55 },
            { title: 'working Teams', value: res.data.teams_count },
          ]);
          if (!toastShownRef.current) {
            toast.success(res.data.message);
            toastShownRef.current = true;
          }
        } else {
          toast.error('Failed to fetch projects.');
        }
      } catch (error) {
        console.error('Error fetching assigned projects:', error);
        toast.error('An error occurred while fetching projects.');
      }
    };
    fetchAssociatedTeams();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const ScoreCard = ({ title, value, icon }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          {icon}
        </Box>
        <Typography variant="h4" component="div" color="primary">
          {value}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{ mt: 2, height: 8, borderRadius: 4 }}
        />
      </CardContent>
    </Card>
  );

  const Teamcard = ({ team }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            {team.name}
          </Typography>
          <Chip
            label={team.leader}
            // color={project.status === 'Completed' ? 'success' : 'primary'}
            size="small"
          />
        </Box>
        
        <Box display="flex" alignItems="center" mt={2}>
          <Box width="100%" mr={1}>
            <LinearProgress variant="determinate" value={team.progress} />
          </Box>
          {/* <Box minWidth={35}>
            <Typography variant="body2" color="text.secondary">{`${team.leader}%`}</Typography>
          </Box> */}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1, p: 3, maxWidth: 1200, margin: 'auto' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {/* Team Member Profile */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent>
                    <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems="center">
                      <Avatar
                        src={teamMemberData.avatar}
                        alt={localStorage.getItem('username')}
                        sx={{ width: 100, height: 100, mr: isMobile ? 0 : 3, mb: isMobile ? 2 : 0 }}
                      />
                      <Box>
                        <Typography variant="h4" component="div">
                          {localStorage.getItem('username')}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Scorecard */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Performance Scorecard
              </Typography>
            </Grid>
            {scorecardData.map((score, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div variants={itemVariants}>
                  <ScoreCard
                    title={score.title}
                    value={score.value}
                    icon={index === 0 ? <Assignment color="primary" /> : index === 1 ? <TrendingUp color="primary" /> : index === 2 ? <Star color="primary" /> : <CheckCircle color="primary" />}
                  />
                </motion.div>
              </Grid>
            ))}

            {/* Assigned Projects */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Associated Teams
              </Typography>
            </Grid>
            <hr />
            <Grid item xs={12}>
              <motion.div variants={containerVariants}>
                {fetchedTeams.map((team) => (
                  <motion.div key={team._id} variants={itemVariants}>
                    <Teamcard team={team} />
                  </motion.div>
                ))}
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Box>
      <Toaster />
    </>
  );
}
