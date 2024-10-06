import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import {
  ListItemText,
  IconButton,
  useMediaQuery,
  AppBar,
  Toolbar,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  ListItemIcon,
} from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const drawerWidth = 200;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, to: '/admin' },
  { text: 'New Users', icon: <PersonIcon />, to: '/admin/new-users' },
  { text: 'Settings', icon: <SettingsIcon />, to: '/admin/settings' },
];

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#303030',
      paper: '#424242',
    },
  },
});

// Create a light theme for the main content
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
    },
  },
});

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLogin, setIsLogin] = useState(false); // State to track login status

  useEffect(() => {
    // Check if the user is logged in on component mount
    const loginStatus = localStorage.getItem('login');
    setIsLogin(!!loginStatus); // Convert to boolean
  }, []);

  const handleLogout = () => {
    // Clear all relevant session data
    logout();
    // Notify the user and update the login state
    toast.success('Logged out successfully');
    setIsLogin(false); // Update the state to reflect logout
    navigate('/login');
  };

  const isMobile = useMediaQuery(darkTheme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main' }}>
          Dashboard
        </Typography>
      </Toolbar>
      <List sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 0.1rem',
      }}>
        {navItems.map((item) => (
          <Link to={item.to} key={item.text} className='flex m-3 justify-center hover:-translate-y-1  hover:text-red-500 ease-out hover:bg-slate-600 p-1' >
            <ListItemIcon sx={{ color: 'primary.main', minWidth: 'auto' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} className="text-center" />
          </Link>
        ))}
      </List>
    </div>
  );


  return (
    <ThemeProvider theme={lightTheme}>
      <Toaster />
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="p" className="text-white-500" noWrap component="div" sx={{ flexGrow: 1 }}>
                Welcome ! {localStorage.getItem('username')}
              </Typography>
              {/* Logout Button */}
              <IconButton
                onClick={handleLogout}
                sx={{
                  color: '#ff6666', // Light red color
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'transform 0.5s ease, color 0.3s ease', // Animation transition
                  '&:hover': {
                    transform: 'scale(1.1)', // Scale on hover for animation
                    color: '#ff4d4d', // Slightly darker red on hover
                    borderRadius: "0"
                  },
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Logout
                </Typography>
                <LogoutIcon />
              </IconButton>

            </Toolbar>
          </AppBar>
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
          >
            {isMobile ? (
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: 'block', sm: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
              >
                {drawer}
              </Drawer>
            ) : (
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
              >
                {drawer}
              </Drawer>
            )}
          </Box>
        </ThemeProvider>
      </Box>
    </ThemeProvider>
  );
}
