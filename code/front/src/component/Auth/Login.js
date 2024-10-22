import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CssVarsProvider, CssBaseline, GlobalStyles, Box, Typography, Stack, Divider, Button, FormControl, FormLabel, Input } from '@mui/joy';
import '../../css/App.css';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import bg from "../../assets/bg.jpg";
import Cookies from 'js-cookie';
import { useAuth } from '../../utils/AuthContext';
import Waiting from "../Member/Waiting";


export default function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [inputValues, setInputValues] = useState({ email: '', password: '', role: '' });
    const [errors, setErrors] = useState({});
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const authToken = Cookies.get('auth-token');
        if (isAuthenticated && authToken && localStorage.getItem('role') === "member") {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const validate = () => {
        const errors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

        if (!emailPattern.test(inputValues.email)) {
            errors.email = "Invalid email address";
        }
        if (!passwordPattern.test(inputValues.password)) {
            errors.password = "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character";
        }

        return errors;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const SaveLoginValues = async (token, fname, lname) => {
        Cookies.set('email', inputValues.email, { expires: 2 });
        Cookies.set('auth-token', token, { expires: 2 });
        localStorage.setItem('user', inputValues.email);
        const fullname = `${fname} ${lname}`;
        localStorage.setItem('username', fullname);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix the errors before submitting");
        } else {
            setErrors({});
            try {
                inputValues.role = "member";
                const token = Cookies.get('auth-token');
                const encryptedData = CryptoJS.DES.encrypt(JSON.stringify(inputValues), 'loginData').toString();
                const response = await axios.post("http://localhost:3333/auth/login-member", { data: encryptedData });

                if (response.status === 201) {
                    const decryptedData = CryptoJS.DES.decrypt(response.data.user, 'loginData');
                    const user = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));

                    // Store the role and normalize it
                    const userRole = response.data.role
                    localStorage.setItem('role', userRole);
                    const user_status = response.data.user_status
                    console.log(user_status);
                    // Debugging to verify the role is stored correctly
                    console.log("Stored role in localStorage:", localStorage.getItem('role'));

                    const fname = user.firstname;
                    const lname = user.lastname;

                    // Role-based navigation
                    if (userRole === "leader") {
                        toast.success("Login Successfully");
                        SaveLoginValues(response.data.token, fname, lname)
                        setIsLogin(true);
                        login();
                        navigate("/leader", { message: "Login Successfully" });
                    } else if (userRole === "member") {
                        if (user_status === "pending") {
                            navigate('/wait')
                        } else if (user_status === "confirmed") {
                            toast.success("Login Successfully");
                            SaveLoginValues(response.data.token, fname, lname)
                            setIsLogin(true);
                            login();
                            navigate("/home", { message: "Login successful" });
                        }
                    } else {
                        toast.error("Invalid role specified");
                    }
                } else {
                    toast.error(response.data.message || "An error occurred");
                }
            } catch (error) {
                toast.error("Request failed !! Invalid credentials or Invalid role ");
                console.error(error);
            }
        }
    };

    return (
        <>
            <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
                <CssBaseline />
                <GlobalStyles
                    styles={{
                        ":root": {
                            "--Form-maxWidth": "800px",
                            "--Transition-duration": "0.4s"
                        }
                    }}
                />
                <Box
                    sx={(theme) => ({
                        width: { xs: "100%", md: "50vw" },
                        transition: "width var(--Transition-duration)",
                        transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
                        position: "relative",
                        zIndex: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                        backdropFilter: "blur(12px)",
                        backgroundColor: "rgba(255 255 255 / 0.2)",
                        [theme.getColorSchemeSelector("dark")]: {
                            backgroundColor: "rgba(19 19 24 / 0.4)"
                        }
                    })}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100dvh",
                            width: "100%",
                            px: 2
                        }}
                    >
                        <Box component="header" sx={{ py: 3, display: "flex", justifyContent: "space-between" }} />

                        <Box
                            component="main"
                            sx={{
                                my: "auto",
                                py: 2,
                                pb: 5,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                width: 400,
                                maxWidth: "100%",
                                mx: "auto",
                                borderRadius: "sm",
                                "& form": { display: "flex", flexDirection: "column", gap: 2 },
                                [`& .MuiFormLabel-asterisk`]: { visibility: "hidden" }
                            }}
                        >
                            <Stack gap={4} sx={{ mb: 2 }}>
                                <Stack gap={1}>
                                    <Typography component="h1" level="h3">
                                        Log into your account
                                        <br />
                                        <span className=' text-success'>
                                            as a team member
                                        </span>
                                    </Typography>
                                    <hr />
                                    <div className='d-flex justify-content-center'>
                                        <Link to="/admin/login">
                                            <button class="bg-blue-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded-full mx-2">
                                                ADMIN
                                            </button>
                                        </Link>
                                        <Link to="/leader/login">
                                            <button class="bg-red-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mx-2">
                                                LEADER
                                            </button>
                                        </Link>
                                    </div>
                                    <hr />
                                    <Typography level="body-sm">
                                        New user? <Link to="/signup" className='text-danger'>Signup</Link>
                                    </Typography>
                                </Stack>
                            </Stack>
                            {/* <Divider sx={(theme) => ({ [theme.getColorSchemeSelector("light")]: { color: { xs: "#FFF", md: "text.tertiary" } } })}>
                                or
                            </Divider> */}

                            <form onSubmit={handleSubmit}>
                                <FormControl error={Boolean(errors.email)}>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        name="email"
                                        autoComplete="off"
                                        value={inputValues.email}
                                        onChange={handleInputChange}
                                    />
                                    {errors.email && (
                                        <Typography color="error" variant="caption">
                                            {errors.email}
                                        </Typography>
                                    )}
                                </FormControl>

                                <FormControl error={Boolean(errors.password)}>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={inputValues.password}
                                        onChange={handleInputChange}
                                    />
                                    {errors.password && (
                                        <Typography color="error" variant="caption">
                                            {errors.password}
                                        </Typography>
                                    )}
                                </FormControl>

                                <Stack gap={4} sx={{ mt: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Link to="/forgot">Forgot your password?</Link>
                                    </Box>
                                    <Button type="submit" fullWidth color="success">Login</Button>
                                </Stack>
                            </form>
                        </Box>
                    </Box>
                </Box>

                <Box
                    sx={(theme) => ({
                        height: "100%",
                        position: "fixed",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        left: { xs: 0, md: "50vw" },
                        backgroundColor: "background.level1",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundImage: `url(${bg})`,
                    })}
                />
            </CssVarsProvider>
            <Toaster />
        </>
    );
}
