import { Avatar, Box, Button, Card, CardContent, CardHeader, Fade, FormControl, Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PasswordIcon from '@mui/icons-material/Password';
import PinIcon from '@mui/icons-material/Pin';
export default function ChangePassword() {
    const [error, setError] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>(''); 
    const [confirmErrorText, setConfirmErrorText] = useState<string>(''); 
    const [confirmError, setConfirmError] = useState<boolean>(false); 
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const { id } = useParams();

    const ChangeClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        if (validateData(formData)) {
            axios.post(`${baseUrl()}User/ChangePassword`,
                {
                    email: '',
                    password: formData.get('newPassword')
                },
                {
                    params: {
                        encryptedId: id
                    }
                })
                .then((resp) => {
                    if (resp.status === 200) {
                        toast.success('Password has been succesfully changed');
                    }
                    else {
                        toast.error(resp.statusText);
                        console.error(resp.statusText);
                    }
                })
                .catch((err) => {
                    console.error(err); toast.error('Internal error. Please try again');
                })
        }
    }

    const validateData = (data: FormData) => {
        let isValid = true;
        const uppercaseRegex = /[A-Z]/;

        if (!uppercaseRegex.test(String(data.get('newPassword')).trim())) {
            setError(true);
            setErrorText("Password must have an uppercase letter");
            isValid = false;
        }

        if (String(data.get('newPassword')).trim().length < 8) {
            setError(true);
            setErrorText("Password length must be 8 or more characters");
            isValid = false;
        }

        if (String(data.get('newPassword')).trim() !== String(data.get('confirmPassword')).trim()) {
            setConfirmError(true);
            setConfirmErrorText("Passwords don't match");
            isValid = false;
        }

        return isValid;
    }

    return (
        <>
            <ToastContainer />
            <Fade in>
                <Box height="92vh" alignItems="center" justifyContent="center" display="flex">
                    <Card sx={{ boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px' }}>
                        <CardHeader title="Password Recovery" />
                        <CardContent>
                            <Grid columnSpacing={4} container height="100%">
                                <Grid item lg={6}>
                                    <img src="/change-password.svg" style={{ width: '100%', height: 'auto' }} />
                                </Grid>
                                <Grid item lg={6}>
                                    <Avatar sx={{ margin: '0 auto', backgroundColor: '#4285F4' }}>
                                        <PasswordIcon />
                                    </Avatar>
                                    <FormControl onSubmit={ChangeClick} margin="normal" component="form" fullWidth>
                                        <TextField
                                            required
                                            margin="normal"
                                            id="outlined-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            fullWidth
                                            variant="standard"
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
                                            label="New password"
                                            name="newPassword"
                                            error={error}
                                            helperText={errorText}
                                            onChange={() => {
                                                setError(false);
                                                setErrorText("");
                                            }}
                                        />
                                        <TextField
                                            required
                                            id="outlined-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            fullWidth
                                            variant="standard"
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
                                            label="Confirm password"
                                            name="confirmPassword"
                                            error={confirmError}
                                            helperText={confirmErrorText}
                                            onChange={() => {
                                                setConfirmError(false);
                                                setConfirmErrorText("");
                                            }}
                                        />
                                        <Button endIcon={<PinIcon />} sx={{ mt: '1rem' }} type="submit" variant="contained">
                                            Change password
                                        </Button>
                                    </FormControl>
                                    <Link to="/Login">
                                        {"Back to sign in page"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </Fade>
        </>
    );
}
