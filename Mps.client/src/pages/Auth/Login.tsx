import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Backdrop, CircularProgress, Stack, Tooltip } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ValidationUser, ValidationUserText } from '../../models/userModels';
import baseUrl from '../../utils/baseUrl';
import { isUserAdmin } from './AuthUtils';
import LoginIcon from '@mui/icons-material/Login';
import InfoIcon from '@mui/icons-material/Info';
export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const [error, setError] = useState<ValidationUser>(new ValidationUser());
    const [errorText, setErrorText] = useState<ValidationUserText>(new ValidationUserText());
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            const msg = localStorage.getItem("InfoMessage");
            if (msg) {
                toast.success(msg);
            }
            localStorage.removeItem('InfoMessage');
        }, 1)
    }, [])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        if (validateData(data)) {
            setOpen(true);
            axios
                .post(`${baseUrl()}User/Login`, {
                    email: data.get('email'),
                    password: data.get('password')
                })
                .then((resp) => {
                    setOpen(false);
                    if (resp.status === 200) {
                        localStorage.setItem("authToken", resp.data.token);
                        localStorage.setItem("isAdmin", resp.data.isAdmin);
                        isUserAdmin() ? navigate("/User") : navigate("/");
                    }
                    else {
                        toast.error(resp.statusText);
                    }
                })
                .catch((error) => {
                    setOpen(false);
                    toast.error(error.response.data);
                })
        }
    };

    const validateData = (data: FormData) => {
        let isValid = true;

        if (data.get('email') === undefined || String(data.get('email')).trim() === '') {
            setError((errors) => ({ ...errors, email: true }));
            setErrorText((errors) => ({ ...errors, email: "Email can't be empty" }));
            isValid = false;
        }

        if (data.get('password') === undefined
            || String(data.get('password')).trim() === '') {
            setError((errors) => ({ ...errors, password: true }));
            setErrorText((errors) => ({ ...errors, password: "Password can't be empty" }));
            isValid = false;
        }
        return isValid;
    }

    return (
        <>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <ToastContainer />
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://images.pexels.com/photos/5966432/pexels-photo-5966432.jpeg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid id="selection-card" item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <img style={{ maxHeight: "125px", maxWidth: "300px", width: "auto", height: 'auto' }} src="/mps2.png" alt="Logo" />
                        <Avatar sx={{ m: 1, backgroundColor: '#4285F4' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                error={error.email}
                                helperText={errorText.email}
                                onChange={() => {
                                    setError((errors) => ({ ...errors, email: false }));
                                    setErrorText((errors) => ({ ...errors, email: "" }));
                                }}
                            />
                            <TextField
                                required
                                margin="normal"
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                }}
                                label="Password"
                                name="password"
                                error={error.password}
                                helperText={errorText.password}
                                onChange={() => {
                                    setError((errors) => ({ ...errors, password: false }));
                                    setErrorText((errors) => ({ ...errors, password: "" }));
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                                endIcon={<LoginIcon />}
                            >
                                Sign in
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link to="/Register">
                                        {"Don't have an account? Sign up"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item>
                                    <Link to="/ForgotPassword">
                                        {"Forgot password?"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <div style={{ position: 'relative' }}>
                                    <Tooltip title="Copyright 2024 Katerina Limpitsouni" placement="top">
                                        <IconButton style={{ position: 'absolute', top: 90, right: 0 }}>
                                            <InfoIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <img style={{ maxHeight: "326px", maxWidth: "450px", width: "auto", height: 'auto', marginTop: '8rem' }} src="/login.svg" alt="Login" />
                                </div>
                            </Stack>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Backdrop open={open}>
                <CircularProgress />
            </Backdrop>
        </>
    );
}

