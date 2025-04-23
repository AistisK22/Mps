import { useEffect, useState } from "react";
import { Gender, GenderEnum, PhysicalActivityLevel, User, ValidationUser, ValidationUserText } from "../../models/userModels";
import axios from "axios";
import { Backdrop, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogTitle, Divider, FormControl, FormHelperText, Grid, InputAdornment, MenuItem, Select, TextField, Typography } from "@mui/material";
import ScaleIcon from '@mui/icons-material/Scale';
import CakeIcon from '@mui/icons-material/Cake';
import HeightIcon from '@mui/icons-material/Height';
import baseUrl from "../../utils/baseUrl";
import EmailIcon from '@mui/icons-material/Email';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router";
import SpeedIcon from '@mui/icons-material/Speed';
import Tooltip from '@mui/material/Tooltip';
import { GoalVM } from "../../models/goalModels";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import CachedIcon from '@mui/icons-material/Cached';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
export default function UserProfile() {
    const [user, setUser] = useState<User>();
    const authToken = localStorage.getItem('authToken');
    const [calories, setCalories] = useState<number>(0);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const [genders, setGenders] = useState<Gender[]>([]);
    const [PALS, setPALS] = useState<PhysicalActivityLevel[]>([]);
    const [goals, setGoals] = useState<GoalVM[]>([]);
    const [error, setError] = useState<ValidationUser>(new ValidationUser());
    const [errorText, setErrorText] = useState<ValidationUserText>(new ValidationUserText());
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

        axios
            .get(`${baseUrl()}User/GetUser`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((res) => {
                if (res.status === 200) {
                    setUser(res.data);
                    calculateNeededCalories(res.data);
                    setNeedRefresh(false);
                }
                else {
                    console.error(res.statusText);
                }
            })
            .catch((err) => console.error(err))

    }, [authToken, needRefresh]);

    const calculateNeededCalories = (user: User) => {
        const ageDifMs = Date.now() - new Date(user.birthdate).getTime();
        const ageDate = new Date(ageDifMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        let calories;

        if (user.gender === GenderEnum.Male) {
            if (age <= 30) {
                calories = Math.round((0.064 * user.weight + 2.84) * 240 * user.physicalActivityLevelNavigation.value);
            }
            else {
                calories = Math.round((0.0485 * user.weight + 3.67) * 240 * user.physicalActivityLevelNavigation.value);
            }
        }
        else {
            if (age <= 30) {
                calories = Math.round((0.0615 * user.weight + 2.08) * 240 * user.physicalActivityLevelNavigation.value);
            }
            else {
                calories = Math.round((0.0364 * user.weight + 3.47) * 240 * user.physicalActivityLevelNavigation.value);
            }
        }
        setCalories(calories);
    }

    const handleDeleteClick = () => {
        setOpenDialog(true);
    }

    const handleClickClose = () => {
        setOpenDialog(false);
    };

    const handleDeleteConfirmation = () => {
        axios
            .delete(`${baseUrl()}User`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    localStorage.removeItem("authToken");
                    navigate("/Login");
                    localStorage.setItem("InfoMessage", "Account has been succesfully deleted.");
                }
                else {
                    toast.error("Error:" + resp.statusText);
                }
            })
            .catch((error) => console.error('Error making API request:', error))
    }

    const handleUpdateClick = () => {

        if (validateData()) {
            axios
                .put(`${baseUrl()}User/Update`, {
                    birthdate: user?.birthdate,
                    height: user?.height,
                    weight: user?.weight,
                    gender: user?.gender,
                    physicalActivityLevel: user?.physicalActivityLevel,
                    idGoal: user?.idGoal
                }, { headers: { 'Authorization': `Bearer ${authToken}` } })
                .then((resp) => {
                    if (resp.status === 200) {
                        setNeedRefresh(true);
                        toast.success("Information has been succesfully updated.");
                    }
                    else {
                        toast.error("Error:" + resp.statusText);
                    }
                })
                .catch((error) => console.error('Error making API request:', error))
        }
    }


    const validateData = () => {
        let isValid = true;

        if (String(user?.weight).length > 3) {
            setError((errors) => ({ ...errors, weight: true }));
            setErrorText((errors) => ({ ...errors, weight: "Please enter a valid weight (max 999 kg)" }));
            isValid = false;
        }

        if (String(user?.height).length > 3) {
            setError((errors) => ({ ...errors, height: true }));
            setErrorText((errors) => ({ ...errors, height: "Please enter a valid height (e.g., 185.2)" }));
            isValid = false;
        }

        if (user?.birthdate === null || user?.birthdate === "") {
            setError((errors) => ({ ...errors, birth: true }));
            setErrorText((errors) => ({ ...errors, birth: "Birth date can't be empty" }));
            isValid = false;
        }

        return isValid;
    }

    return (
        <>
            <div className="profile-layout">
                <ToastContainer />
                {user ?
                    <>
                        <Card id="profile-card">
                            <CardContent style={{ display: 'flex',  justifyContent: "center", alignItems: 'center', flexDirection: 'column', padding: '2rem 4rem' }}>
                                <div className="avatar">
                                    {user?.name[0].toUpperCase()}{user?.surname[0].toUpperCase()}
                                </div>
                                <Typography variant="h4">
                                    {user?.name}&nbsp;{user?.surname}
                                </Typography>
                                <Typography mt="0.5rem" variant="h5">
                                    <div style={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                                        <EmailIcon />&nbsp;{user?.email}
                                    </div>
                                </Typography>
                                <Button sx={{mt:'0.5rem'}} onClick={handleDeleteClick} startIcon={<DeleteIcon />} color="error" variant="text">Delete account</Button>
                            </CardContent>
                        </Card>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <Card id="account-information" sx={{ maxWidth: '1200px', borderRadius:'16px' }}>
                            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
                                <Typography margin="1rem" fontWeight="bold" variant="h6">Account information</Typography>
                                <Button endIcon={<CachedIcon />} onClick={handleUpdateClick} type="submit" variant="contained" sx={{ margin: '1rem' }}>Update</Button>
                            </div>
                            <Divider />
                            <CardContent>
                                <Grid container>
                                    {/* First Grid */}
                                    <Grid item xs={12} lg={6}>
                                        <Grid container spacing={2}>
                                            <Grid container alignItems="center" justifyContent="flex-end" item xs={4}>
                                                <CakeIcon fontSize="small" />&nbsp;Birth date:
                                            </Grid>
                                            <Grid textAlign="left" item xs={8}>
                                                <FormControl margin="normal">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            sx={{ width: '250px' }}
                                                            required
                                                            slotProps={{ textField: { variant: 'standard', } }}
                                                            onChange={(e) => {
                                                            setUser({ ...user, birthdate: e?.format("YYYY-MM-DD") ?? "" });
                                                            setError((errors) => ({ ...errors, birth: false }));
                                                            setErrorText((errors) => ({ ...errors, birth: "" }));
                                                        }}
                                                            value={dayjs(user.birthdate)} name="birthdate" format="YYYY-MM-DD" disableFuture />
                                                    </LocalizationProvider>
                                                    {error.birth && <FormHelperText error>{errorText.birth}</FormHelperText>}
                                                </FormControl>
                                            </Grid>
                                            <Grid container alignItems="center" justifyContent="flex-end" item xs={4}>
                                                <HeightIcon fontSize="small" />&nbsp;Height:
                                            </Grid>
                                            <Grid textAlign="left" item xs={8}>
                                                <TextField
                                                    variant="standard"
                                                    sx={{ width: '250px' }}
                                                    required
                                                    margin="normal"
                                                    id="outlined-adornment-height"
                                                    InputProps={{ endAdornment: <InputAdornment position="end">cm</InputAdornment> }}
                                                    aria-describedby="outlined-height-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'height',
                                                    }}
                                                    name="height"
                                                    type='number'
                                                    value={user.height}
                                                    error={error.height}
                                                    helperText={errorText.height}
                                                    onChange={(e) => {
                                                        setUser({ ...user, height: Number(e.target.value) });
                                                        setError((errors) => ({ ...errors, height: false }));
                                                        setErrorText((errors) => ({ ...errors, height: "" }));
                                                    }}
                                                />
                                            </Grid>
                                            <Grid container alignItems="center" justifyContent="flex-end" item xs={4}>
                                                <ScaleIcon fontSize="small" />&nbsp;Weight:
                                            </Grid>
                                            <Grid textAlign="left" item xs={8}>
                                                <TextField
                                                    variant="standard"
                                                    sx={{ width: '250px' }}
                                                    required
                                                    margin="normal"
                                                    id="outlined-adornment-weight"
                                                    InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'weight',
                                                    }}
                                                    name="weight"
                                                    type='number'
                                                    value={user.weight}
                                                    error={error.weight}
                                                    helperText={errorText.weight}
                                                    onChange={(e) => {
                                                        setUser({ ...user, weight: Number(e.target.value) });
                                                        setError((errors) => ({ ...errors, weight: false }));
                                                        setErrorText((errors) => ({ ...errors, weight: "" }));
                                                    }}
                                                />
                                            </Grid>
                                            <Grid container alignItems="center" justifyContent="flex-end" item xs={4}>
                                                <PersonIcon fontSize="small" />&nbsp;Gender:
                                            </Grid>
                                            <Grid textAlign="left" item xs={8}>
                                                <FormControl margin="normal">
                                                    <Select
                                                        variant="standard"
                                                        sx={{ width: '250px' }}
                                                        labelId="gender-label"
                                                        id="gender"
                                                        name="gender"
                                                        defaultValue={user.gender}
                                                        onChange={(e) => {
                                                            setUser({ ...user, gender: Number(e.target.value) });
                                                        }}
                                                    >
                                                        {genders && genders.map((gender) => (
                                                            <MenuItem key={gender.name} value={gender.idGenders}>{gender.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {/* Second Grid */}
                                    <Grid item xs={12} lg={6}>
                                        <Grid container spacing={2}>
                                            <Grid container alignItems="center" justifyContent="flex-end" item xs={4}>
                                                <Tooltip title={
                                                    <>
                                                        <Typography variant="body2">Sedentary - 1,2</Typography>
                                                        <Typography variant="body2">Lightly active - 1,55</Typography>
                                                        <Typography variant="body2">Moderately active - 1,75</Typography>
                                                        <Typography variant="body2">Very active - 2</Typography>
                                                        <Typography variant="body2">Extremely active - 2,2</Typography>
                                                    </>
                                                }
                                                ><FitnessCenterIcon fontSize="small" /></Tooltip>&nbsp;Physical activity level:
                                            </Grid>
                                            <Grid textAlign="left" item xs={8}>
                                                <FormControl margin="normal">
                                                    <Select
                                                        variant="standard"
                                                        sx={{ width: '250px' }}
                                                        labelId="demo-simple-select-label"
                                                        id="physicalActivityLevel"
                                                        name="physicalActivityLevel"
                                                        defaultValue={user.physicalActivityLevel}
                                                        onChange={(e) => {
                                                            setUser({ ...user, physicalActivityLevel: Number(e.target.value) });
                                                        }}
                                                    >
                                                        {PALS && PALS.map((level) => (
                                                            <MenuItem key={level.name} value={level.idPhysicalActivityLevels}>{level.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid container alignItems="center" justifyContent="flex-end" item xs={4}>
                                                <Tooltip title={goals.map((goal) => (<span>
                                                    <Typography variant="body2">{goal.name}</Typography> - {goal.description}
                                                    <br />
                                                </span>))
                                                }>
                                                    <EmojiEventsIcon fontSize="small" />
                                                </Tooltip>&nbsp;Goal:
                                            </Grid>
                                            <Grid textAlign="left" item xs={8}>
                                                <FormControl margin="normal">
                                                    <Select
                                                        variant="standard"
                                                        sx={{ width: '250px' }}
                                                        labelId="gender-label"
                                                        id="goal"
                                                        name="goal"
                                                        defaultValue={user.idGoal}
                                                        onChange={(e) => {
                                                            setUser({ ...user, idGoal: Number(e.target.value) });
                                                        }}
                                                    >
                                                        {goals && goals.map((goal) => (
                                                            <MenuItem key={goal.name} value={goal.idGoal}>{goal.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid container alignItems="center" justifyContent="flex-end" item xs={4}>
                                                <Tooltip title="Calories are computed utilizing the Harris-Benedict formula and subsequently scaled by the values corresponding to the users's level of physical activity"><LocalDiningIcon fontSize="small" /></Tooltip>&nbsp;Calories needed:
                                            </Grid>
                                            <Grid textAlign="left" item xs={8}>
                                                <TextField
                                                    variant="standard"
                                                    sx={{ width: '250px' }}
                                                    margin="normal"
                                                    id="outlined-adornment-weight"
                                                    InputProps={{ endAdornment: <InputAdornment position="end">kcal</InputAdornment> }}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'calories',
                                                    }}
                                                    name="calories"
                                                    value=
                                                    {
                                                        user.idGoal === 1
                                                            ? (calories * 1.1).toFixed(2) + ' (+10% gain weight)'
                                                            : user.idGoal === 2
                                                                ? (calories * 0.9).toFixed(2) + ' (-10% lose weight)'
                                                                    : calories
                                                    }
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid container alignItems="center" justifyContent="flex-end" item xs={4}>
                                                <Tooltip title="BMI - Body Mass Index" ><SpeedIcon fontSize="small" /></Tooltip>
                                                &nbsp;BMI:
                                            </Grid>
                                            <Grid textAlign="left" item xs={8}>
                                                <TextField
                                                    variant="standard"
                                                    sx={{ width: '250px' }}
                                                    margin="normal"
                                                    id="outlined-adornment-bmi"
                                                    InputProps={{
                                                        endAdornment: <InputAdornment
                                                            position="end">
                                                            <Typography variant="body2"
                                                                color={
                                                                    user.bmi <= 18.5 ? 'blue'
                                                                        : user.bmi <= 24.99 ? 'green'
                                                                            : user.bmi <= 29.99 ? 'orange'
                                                                                : user.bmi <= 39.99 ? 'red'
                                                                                    : 'purple'
                                                                }
                                                            >
                                                                {
                                                                    user.bmi <= 18.5
                                                                        ? "Underweight"
                                                                        : user.bmi >= 18.5 && user.bmi <= 24.99
                                                                            ? "Normal"
                                                                            : user.bmi >= 25 && user.bmi <= 29.99
                                                                                ? "Overweight"
                                                                                : user.bmi >= 30 && user.bmi <= 39.99
                                                                                    ? "Obesity"
                                                                                    : "Morbid Obesity"
                                                                }
                                                            </Typography>
                                                        </InputAdornment>
                                                    }}
                                                    aria-describedby="outlined-bmi-helper-text"
                                                    name="bmi"
                                                    value={user.bmi}
                                                    disabled
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </>
                    : <Backdrop open>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                }
                <Dialog
                    open={openDialog}
                    onClose={handleClickClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Do you really want to delete your account?"}
                    </DialogTitle>
                    <DialogActions>
                        <Button endIcon={<CloseIcon />} onClick={handleClickClose}>Disagree</Button>
                        <Button endIcon={<DeleteIcon />} color="error" onClick={() => { handleDeleteConfirmation(); handleClickClose(); }} autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <Tooltip title="Copyright 2024 Katerina Limpitsouni" placement="top">
                        <IconButton style={{ position: 'absolute', top: 100, right: 250 }}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <img style={{ maxHeight: "364px", maxWidth: "722px", width: "auto", height: 'auto', marginTop: '4rem' }} src="/profile.svg" alt="Profile" />
                </div>
            </div>
        </>
    );
}

