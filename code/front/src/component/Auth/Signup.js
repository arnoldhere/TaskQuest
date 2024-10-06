import bg from "../../assets/bg.jpg"
import React, { useState } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { Link } from "react-router-dom";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import toast, { Toaster } from 'react-hot-toast';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Select from "@mui/joy/Select"
import Option from '@mui/joy/Option';



const SignupForm = () => {
    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState({
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        rePassword: '',
        role: '',
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const errors = {};

        // Required fields:
        if (!inputValues.firstname) {
            errors.firstname = "First name is required";
        }

        if (!inputValues.lastname) {
            errors.lastname = "Last name is required";
        }

        if (!inputValues.password) {
            errors.password = "Password is required";
        }

        // Email validation (using regular expression):
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValues.email)) {
            errors.email = "Invalid email address";
        }

        // Password validation with advanced checks:
        if (inputValues.password) {
            if (inputValues.password.length < 6) {
                errors.password = "Password must be at least 6 characters";
            } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(inputValues.password)) {
                errors.password = "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character";
            }
        }

        // Re-typed password validation:
        if (inputValues.rePassword && inputValues.password !== inputValues.rePassword) {
            errors.rePassword = "Passwords do not match";
        }


        return errors;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target || event;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix the errors before submitting");
        } else {
            setErrors({});
            // Proceed with form submission logic
            try {
                inputValues.role = "member";
                // encrypt your data
                const finalData = CryptoJS.DES.encrypt(JSON.stringify(inputValues), 'signupData').toString();
                console.log(finalData);

                // send the data to backend through axios api 
                const res = await axios.post("http://localhost:3333/auth/register", {
                    data: finalData
                });
                // Handle response based on status
                if (res.status === 201) {
                    if (res.data.user_status === "active") {
                        toast.success(res.data.message);
                        navigate("/login", { state: { message: res.data.message } })
                    } else if (res.data.user_status === "pending") {
                        toast.loading(res.data.message + "Please wait until you got the access...", { duration: 5000 })
                        navigate('/wait')
                    }
                } else {
                    toast.error(res.data.message);
                }

            } catch (error) {
                console.log(error.message)
                toast.error("Registration interrupted !! \n Email is already in use ");
            }

        }
    };

    return (
        <>
            <Toaster />
            <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
                <CssBaseline />
                <GlobalStyles
                    styles={{
                        ":root": {
                            "--Form-maxWidth": "800px",
                            "--Transition-duration": "0.4s",
                        },
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
                            backgroundColor: "rgba(19 19 24 / 0.4)",
                        },
                    })}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100dvh",
                            width: "100%",
                            px: 2,
                        }}
                    >
                        <Box
                            component="header"
                            sx={{
                                py: 3,
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                        </Box>
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
                                "& form": {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                },
                                [`& .MuiFormLabel-asterisk`]: {
                                    visibility: "hidden",
                                },
                            }}
                        >
                            <Stack gap={4} sx={{ mb: 2 }}>
                                <Stack gap={1}>
                                    <Typography component="h1" level="h3">
                                        Fill valid details to create account
                                    </Typography>
                                    <Typography level="body-sm">
                                        Already a user?{" "}
                                        <Link to="/login" level="title-sm" className="text-danger">
                                            Login
                                        </Link>
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Divider
                                sx={(theme) => ({
                                    [theme.getColorSchemeSelector("light")]: {
                                        color: { xs: "#FFF", md: "text.tertiary" },
                                    },
                                })}
                            >
                                or
                            </Divider>
                            <Stack gap={4} sx={{ mt: 2 }}>
                                <form onSubmit={handleSubmit}>
                                    <FormControl error={Boolean(errors.email)}>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            name="email"
                                            autoComplete="off"
                                            value={inputValues.email}
                                            onChange={handleInputChange}
                                            sx={{
                                                transition: "all 0.3s ease",
                                                borderColor: errors.email ? 'error.main' : '',
                                                "&:focus": {
                                                    borderColor: errors.email ? 'error.main' : 'success.main',
                                                    boxShadow: errors.email ? '0 0 8px 0 rgba(255, 0, 0, 0.5)' : '0 0 8px 0 rgba(0, 128, 0, 0.5)',
                                                },
                                                "&:hover": {
                                                    borderColor: errors.email ? 'error.main' : 'primary.main',
                                                },
                                            }}
                                        />
                                        {errors.email && (
                                            <Typography color="error" variant="caption">
                                                {errors.email}
                                            </Typography>
                                        )}
                                    </FormControl>
                                    <FormControl error={Boolean(errors.firstname)}>
                                        <FormLabel>First Name</FormLabel>
                                        <Input
                                            type="text"
                                            name="firstname"
                                            autoComplete="off"
                                            value={inputValues.firstname}
                                            onChange={handleInputChange}
                                            sx={{
                                                transition: "all 0.3s ease",
                                                borderColor: errors.firstname ? 'error.main' : '',
                                                "&:focus": {
                                                    borderColor: errors.firstname ? 'error.main' : 'success.main',
                                                    boxShadow: errors.firstname ? '0 0 8px 0 rgba(255, 0, 0, 0.5)' : '0 0 8px 0 rgba(0, 128, 0, 0.5)',
                                                },
                                                "&:hover": {
                                                    borderColor: errors.firstname ? 'error.main' : 'primary.main',
                                                },
                                            }}
                                        />
                                        {errors.firstname && (
                                            <Typography color="error" variant="caption">
                                                {errors.firstname}
                                            </Typography>
                                        )}
                                    </FormControl>
                                    <FormControl error={Boolean(errors.lastname)}>
                                        <FormLabel>Last Name</FormLabel>
                                        <Input
                                            type="text"
                                            name="lastname"
                                            autoComplete="off"
                                            value={inputValues.lastname}
                                            onChange={handleInputChange}
                                            sx={{
                                                transition: "all 0.3s ease",
                                                borderColor: errors.lastname ? 'error.main' : '',
                                                "&:focus": {
                                                    borderColor: errors.lastname ? 'error.main' : 'success.main',
                                                    boxShadow: errors.lastname ? '0 0 8px 0 rgba(255, 0, 0, 0.5)' : '0 0 8px 0 rgba(0, 128, 0, 0.5)',
                                                },
                                                "&:hover": {
                                                    borderColor: errors.lastname ? 'error.main' : 'primary.main',
                                                },
                                            }}
                                        />
                                        {errors.lastname && (
                                            <Typography color="error" variant="caption">
                                                {errors.lastname}
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
                                            sx={{
                                                transition: "all 0.3s ease",
                                                borderColor: errors.password ? 'error.main' : '',
                                                "&:focus": {
                                                    borderColor: errors.password ? 'error.main' : 'success.main',
                                                    boxShadow: errors.password ? '0 0 8px 0 rgba(255, 0, 0, 0.5)' : '0 0 8px 0 rgba(0, 128, 0, 0.5)',
                                                },
                                                "&:hover": {
                                                    borderColor: errors.password ? 'error.main' : 'primary.main',
                                                },
                                            }}
                                        />
                                        {errors.password && (
                                            <Typography color="error" variant="caption">
                                                {errors.password}
                                            </Typography>
                                        )}
                                    </FormControl>
                                    <FormControl error={Boolean(errors.rePassword)}>
                                        <FormLabel>Re-enter Password</FormLabel>
                                        <Input
                                            type="password"
                                            name="rePassword"
                                            value={inputValues.rePassword}
                                            onChange={handleInputChange}
                                            sx={{
                                                transition: "all 0.3s ease",
                                                borderColor: errors.rePassword ? 'error.main' : '',
                                                "&:focus": {
                                                    borderColor: errors.rePassword ? 'error.main' : 'success.main',
                                                    boxShadow: errors.rePassword ? '0 0 8px 0 rgba(255, 0, 0, 0.5)' : '0 0 8px 0 rgba(0, 128, 0, 0.5)',
                                                },
                                                "&:hover": {
                                                    borderColor: errors.rePassword ? 'error.main' : 'primary.main',
                                                },
                                            }}
                                        />
                                        {errors.rePassword && (
                                            <Typography color="error" variant="caption">
                                                {errors.rePassword}
                                            </Typography>
                                        )}
                                    </FormControl>
                                    {/* <FormControl error={Boolean(errors.role)}>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            color="neutral"
                                            placeholder="Choose one…"
                                            variant="soft"
                                            name="role"
                                            value={inputValues.role}
                                            onChange={(event, newValue) => handleRoleInputChange(event, newValue)}  // Pass the value
                                            sx={{
                                                transition: "all 0.3s ease",
                                                borderColor: errors.role ? 'error.main' : '',
                                                "&:focus": {
                                                    borderColor: errors.role ? 'error.main' : 'success.main',
                                                    boxShadow: errors.role ? '0 0 8px 0 rgba(255, 0, 0, 0.5)' : '0 0 8px 0 rgba(0, 128, 0, 0.5)',
                                                },
                                                "&:hover": {
                                                    borderColor: errors.role ? 'error.main' : 'primary.main',
                                                },
                                            }}
                                        >
                                            <Option value="leader">Team Leader</Option>
                                            <Option value="member">Team Member</Option>
                                        </Select>
                                        {errors.role && (
                                            <Typography color="error" variant="caption">
                                                {errors.role}
                                            </Typography>
                                        )}
                                    </FormControl> */}

                                    <Stack gap={4} sx={{ mt: 2 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                        </Box>
                                        <Button type="submit" fullWidth color="warning">
                                            Sign up
                                        </Button>
                                    </Stack>
                                </form>
                            </Stack>
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
                        transition:
                            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
                        transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
                        backgroundColor: "background.level1",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundImage: `url(${bg})`,

                    })}
                />
            </CssVarsProvider>
        </>
    );
};

export default SignupForm;
