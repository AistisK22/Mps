import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, Tooltip } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Gender, PhysicalActivityLevel, ValidationUser, ValidationUserText } from '../../models/userModels';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseUrl from '../../utils/baseUrl';
import { GoalVM } from '../../models/goalModels';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InfoIcon from '@mui/icons-material/Info';
export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<ValidationUser>(new ValidationUser()); 
    const [errorText, setErrorText] = useState<ValidationUserText>(new ValidationUserText());
    const [genders, setGenders] = useState<Gender[]>([]);
    const [PALS, setPALS] = useState<PhysicalActivityLevel[]>([]);
    const [goals, setGoals] = useState<GoalVM[]>([]);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${baseUrl()}User/GetGenderList`)
            .then((resp) => {
                if (resp.status === 200) {
                    setGenders(resp.data);
                }
                else {
                    toast.error(resp.statusText);
                }
            })
            .catch((err) => console.error(err));

        axios
            .get(`${baseUrl()}User/GetPalList`)
            .then((resp) => {
                if (resp.status === 200) {
                    setPALS(resp.data);
                }
                else {
                    toast.error(resp.statusText);
                }
            })
            .catch((err) => console.error(err));

        axios
            .get(`${baseUrl()}Goal`)
            .then((resp) => {
                if (resp.status === 200) {
                    setGoals(resp.data);
                }
                else {
                    toast.error(resp.statusText);
                }
            })
            .catch((err) => console.error(err));
    }, [])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (validateData(data)) {
            axios
                .post(`${baseUrl()}User/Register`, {
                    email: data.get('email'),
                    password: data.get('password'),
                    name: data.get('name'),
                    surname: data.get('surname'),
                    weight: data.get('weight'),
                    height: data.get('height'),
                    birthdate: data.get('birthdate'),
                    gender: Number(data.get('gender')),
                    physicalActivityLevel: Number(data.get('physicalActivityLevel')),
                    idGoal: Number(data.get('goal')),
                    role: "",
                    active:true
                })
                .then((resp) => {
                    if (resp.status === 200) {
                        navigate("/Login");
                        localStorage.setItem("InfoMessage", "Registration was successful. Please sign in with your new account.");
                    }
                    else {
                        toast.error(resp.statusText);
                    }})
                .catch((error) => {
                    toast.error(error.response.data);
                })
        }
    };

    const validateData = (data: FormData) => {
        let isValid = true;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const uppercaseRegex = /[A-Z]/;
        if (data.get('email') === null || String(data.get('email')).trim() === '') {
            setError((errors) => ({ ...errors, email: true }));
            setErrorText((errors) => ({ ...errors, email: "Email can't be empty" }));
            isValid = false;
        }

        if (!emailRegex.test(String(data.get('email')).trim())) {
            setError((errors) => ({ ...errors, email: true }));
            setErrorText((errors) => ({ ...errors, email: "Please enter a valid email address" }));
            isValid = false;
        }

        if (!uppercaseRegex.test(String(data.get('password')).trim())) {
            setError((errors) => ({ ...errors, password: true }));
            setErrorText((errors) => ({ ...errors, password: "Password must have an uppercase letter" }));
            isValid = false;
        }

        if (data.get('password') === null
            || String(data.get('password')).trim().length < 8) {
            setError((errors) => ({ ...errors, password: true }));
            setErrorText((errors) => ({ ...errors, password: "Password length must be 8 or more characters" }));
            isValid = false;
        }

        if (data.get('name') === null
            || String(data.get('name')).trim() === '') {
            setError((errors) => ({ ...errors, name: true }));
            setErrorText((errors) => ({ ...errors, name: "Name can't be empty" }));
            isValid = false;
        }

        if (data.get('surname') === null
            || String(data.get('surname')).trim() === '') {
            setError((errors) => ({ ...errors, surname: true }));
            setErrorText((errors) => ({ ...errors, surname: "Surname can't be empty" }));
            isValid = false;
        }

        if (String(data.get('weight')).includes(".")) {
            if (String(data.get('weight')).length > 5) {
                setError((errors) => ({ ...errors, weight: true }));
                setErrorText((errors) => ({ ...errors, weight: "Please enter a valid weight (e.g., 65.5)" }));
                isValid = false;
            }
        }
        else {
            if (String(data.get('weight')).length > 3) {
                setError((errors) => ({ ...errors, weight: true }));
                setErrorText((errors) => ({ ...errors, weight: "Please enter a valid weight (max 999 kg)" }));
                isValid = false;
            }
        }

        if (String(data.get('height')).includes(".")) {
            if (String(data.get('height')).length > 5) {
                setError((errors) => ({ ...errors, height: true }));
                setErrorText((errors) => ({ ...errors, height: "Please enter a valid height (e.g., 185.2)" }));
                isValid = false;
            }
        }
        else {
            if (String(data.get('height')).length > 3) {
                setError((errors) => ({ ...errors, height: true }));
                setErrorText((errors) => ({ ...errors, height: "Please enter a valid height (max 999 cm)" }));
                isValid = false;
            }
        }

        if (data.get('weight') === null
            || String(data.get('weight')).trim() === '') {
            setError((errors) => ({ ...errors, weight: true }));
            setErrorText((errors) => ({ ...errors, weight: "Weight can't be empty" }));
            isValid = false;
        }

        if (data.get('height') === null
            || String(data.get('height')).trim() === '') {
            setError((errors) => ({ ...errors, height: true }));
            setErrorText((errors) => ({ ...errors, height: "Height can't be empty" }));
            isValid = false;
        }

        if (data.get('birthdate') === null
            || String(data.get('birthdate')).trim() === '') {
            setError((errors) => ({ ...errors, birth: true }));
            setErrorText((errors) => ({ ...errors, birth: "Birth date can't be empty" }));
            isValid = false;
        }

        return isValid;
    }

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <ToastContainer />
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
                    <Avatar sx={{ m: 1, backgroundColor:'#4285F4' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 1 }}>
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
                        <TextField
                            margin="normal"
                            required
                            name="name"
                            label="Name"
                            type="name"
                            id="name"
                            autoComplete="current-name"
                            error={error.name}
                            helperText={errorText.name}
                            sx={{ width: "49%" }}
                            onChange={() => {
                                setError((errors) => ({ ...errors, name: false }));
                                setErrorText((errors) => ({ ...errors, name: "" }));
                            }}
                        />
                        &nbsp;
                        <TextField
                            margin="normal"
                            sx={{ width: "50%" }}
                            required
                            name="surname"
                            label="Surname"
                            type="surname"
                            id="surname"
                            autoComplete="current-surname"
                            error={error.surname}
                            helperText={errorText.surname}
                            onChange={() => {
                                setError((errors) => ({ ...errors, surname: false }));
                                setErrorText((errors) => ({ ...errors, surname: "" }));
                            }}
                        />
                        <FormControl sx={{ width: "49%" }} margin="normal" fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: error.birth,
                                        },
                                    }}
                                    name="birthdate"
                                    format="YYYY-MM-DD"
                                    label="Birth date *"
                                    disableFuture
                                    onChange={() => {
                                        setError((errors) => ({ ...errors, birth: false }));
                                        setErrorText((errors) => ({ ...errors, birth: "" }));
                                    }}
                                />
                            </LocalizationProvider>
                            {error.birth && <FormHelperText error>{errorText.birth}</FormHelperText>}
                        </FormControl>
                        &nbsp;
                        <FormControl sx={{ width: "50%" }} margin="normal">
                            <InputLabel id="goal-label">Goal</InputLabel>
                            <Select
                                labelId="gender-label"
                                id="goal"
                                name="goal"
                                label="Goal"
                                defaultValue="1"
                            >
                                {goals && goals.map((goal) => (
                                    <MenuItem key={goal.name} value={goal.idGoal}>{goal.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            required
                            margin="normal"
                            id="outlined-adornment-weight"
                            InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'weight',
                            }}
                            label="Weight"
                            name="weight"
                            sx={{ width: "49%" }}
                            type='number'
                            error={error.weight}
                            helperText={errorText.weight}
                            onChange={() => {
                                setError((errors) => ({ ...errors, weight: false }));
                                setErrorText((errors) => ({ ...errors, weight: "" }));
                            }}
                        />&nbsp;
                        <TextField
                            required
                            margin="normal"
                            id="outlined-adornment-height"
                            InputProps={{ endAdornment: <InputAdornment position="end">cm</InputAdornment> }}
                            aria-describedby="outlined-height-helper-text"
                            inputProps={{
                                'aria-label': 'height',
                            }}
                            name="height"
                            label="Height"
                            sx={{ width: "50%" }}
                            type='number'
                            error={error.height}
                            helperText={errorText.height}
                            onChange={() => {
                                setError((errors) => ({ ...errors, height: false }));
                                setErrorText((errors) => ({ ...errors, height: "" }));
                            }}
                        />
                        <FormControl sx={{ width: "49%" }} margin="normal">
                            <InputLabel id="demo-simple-select-label">Physical activity level</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="physicalActivityLevel"
                                name="physicalActivityLevel"
                                label="Physical Activity Level"
                                defaultValue="1"
                            >
                                {PALS && PALS.map((level) => (
                                    <MenuItem key={level.name} value={level.idPhysicalActivityLevels}>{level.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        &nbsp;
                        <FormControl sx={{ width: "50%" }} margin="normal">
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select
                                labelId="gender-label"
                                id="gender"
                                name="gender"
                                label="Gender"
                                defaultValue="1"
                            >
                                {genders && genders.map((gender) => (
                                    <MenuItem key={gender.name} value={gender.idGenders}>{gender.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                            endIcon={<PersonAddIcon />}
                        >
                            Sign up
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to="/Login">
                                    {"Have an account? Sign in"}
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
                                <img style={{ maxHeight: "326px", maxWidth: "450px", width: "auto", height: 'auto', marginTop: '8rem' }} src="/signup.svg" alt="Signup" />
                            </div>
                        </Stack>
                    </Box>
                </Box>
            </Grid>
        </Grid>

    );
}

