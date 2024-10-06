import React, {useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    Box,
} from '@mui/material';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Group as GroupIcon,
    Assignment as AssignmentIcon,
    Message as MessageIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const NavButton = motion(ListItem);

export default function SmoothNavbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 600px)');
    const { logout } = useAuth();
    const [isLogin, setIsLogin] = useState(false); // State to track login status

    const navigate = useNavigate()

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

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
        { text: 'Team', icon: <GroupIcon />, href: '/leader/team' },
        { text: 'Tasks', icon: <AssignmentIcon />, href: '/tasks' },
        { text: 'Messages', icon: <MessageIcon />, href: '/messages' },
    ];

    const drawer = (
        <Box className="flex flex-col items-center h-full p-4 bg-slate-800">
            <Typography variant="h6" className="my-2 text-white font-bold">
                {localStorage.getItem('username')}
            </Typography>
            <List>
                {navItems.map((item, index) => (
                    <NavButton
                        button
                        key={item.text}
                        component={motion.a}
                        href={item.href}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-white flex items-center py-2 px-4 hover:bg-gray-200 rounded"
                    >
                        <ListItemIcon className="text-red-800">{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </NavButton>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky" className="bg-slate-800  ">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className="mr-2"
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" className="flex-grow font-bold text-white">
                        {localStorage.getItem('username')}
                    </Typography>
                    {!isMobile && (
                        <Box className="flex">
                            {navItems.map((item) => (
                                <Link
                                    key={item.text}
                                    to={item.href}
                                    className="flex items-center px-4 py-2 hover:bg-gray-200 hover:text-red-500 rounded transition duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="text-red-200">{item.icon}</span>
                                    <Typography className="ml-2">{item.text}</Typography>
                                </Link>
                            ))}
                        </Box>
                    )}
                    <IconButton
                        color="inherit"
                        aria-label="settings"
                        component={motion.button}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        alt=""
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        className="h-8 w-8 rounded-full"
                                    />
                                </MenuButton>
                            </div>
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2  w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                            >
                                <MenuItem>
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                                        Your Profile
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <button onClick={handleLogout} className="block text-center w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                                        Logout
                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <nav aria-label="team leader navigation">
                <AnimatePresence>
                    {mobileOpen && (
                        <Drawer
                            variant="temporary"
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                            sx={{
                                display: { xs: 'block', sm: 'none' },
                            }}
                        >
                            {drawer}
                        </Drawer>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
}
