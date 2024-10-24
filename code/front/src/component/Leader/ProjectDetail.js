import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import toast, { Toaster } from 'react-hot-toast'
import Cookies from 'js-cookie';
import axios from 'axios'


export default function ProjectDetail() {
  const { id } = useParams(); // Extract project ID from the URL
  console.log(id);
  const navigate = useNavigate();
  const toastShownRef = useRef(false);

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    status: '',
    createdAt: '',
    endDate: '',
    leader: '',
    members: [],
    // technologies: [],
  });

  useEffect(() => {
    const FetchProject = async () => {
      try {
        // setLoading(true);
        const token = Cookies.get("auth-token");
        console.log(id)
        const res = await axios.get(`http://localhost:3333/leader/fetch-project-detail/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (res.status === 201) {
          if (!toastShownRef.current) {
            toast.success(res.data.message);
            toastShownRef.current = true;
          }
          const project = res.data.project;
          setProjectData(project);
        } else {
          if (!toastShownRef.current) {
            toast.error(res.data.message);
            toastShownRef.current = true;
          }
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        toast.error('An error occurred while fetching project detail.');
      } finally {
        // setLoading(false);
      }
    };

    FetchProject();
  }, [id]);

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
              {projectData.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {projectData.description}
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Status: {projectData.status}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  Duration: {projectData.createdAt} - {projectData.endDate}
                </Typography>
              </Grid>
            </Grid>
            <Box mt={2}>
              {/* {projectData.technologies.map((tech) => (
              <Chip key={tech} label={tech} sx={{ mr: 1, mb: 1 }} />
            ))} */}
              <Typography variant="subtitle1">
                Project Leader Contact: <hr />{projectData.leader}
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
                Team Members
              </Typography>
              <Grid container spacing={2}>
                {projectData.members && projectData.members.map((member, index) => (
                  <Grid item xs={12} sm={6} key={index + 1}>
                    <Box display="flex" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1">{member.email}</Typography>
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
        </Card>
      </motion.div>
      <Toaster />
    </>
  )
}
