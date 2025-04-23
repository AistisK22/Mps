import { Avatar, Box, Button, Card, CardContent, CardHeader, Fade, FormControl, Grid, IconButton, TextField, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import HelpIcon from '@mui/icons-material/Help';
import React, { useState } from "react";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import { ToastContainer, toast } from 'react-toastify';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import InfoIcon from '@mui/icons-material/Info';
export default function ForgotPassword() {
    const [error, setError] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>('');

    const RemindClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        if (validateData(formData)) {
            axios.get(`${baseUrl()}User/RemindPassword`, {
                params: {
                    email: formData.get('email')
                }
            })
                .then((resp) => {
                    if (resp.status === 200) {
                        toast.success('Reminder link has been succesfully sent to your inbox');
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
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(String(data.get('email')).trim())) {
            setError(true);
            setErrorText("Please enter a valid email address");
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
                        <CardHeader title="Forgot Your Password?" />
                        <CardContent>
                            <Grid columnSpacing={4} container height="100%">
                                <Grid item lg={6}>
                                    <div style={{ position: 'relative' }}>
                                        <Tooltip title="Copyright 2024 Katerina Limpitsouni" placement="top">
                                            <IconButton style={{ position: 'absolute', top: 0, right: 0 }}>
                                                <InfoIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <img src="/forgot-password.svg" style={{ width: '100%', height: 'auto' }} />
                                    </div>
                                </Grid>
                                <Grid item lg={6}>
                                    <Avatar sx={{ margin: '0 auto', backgroundColor: '#4285F4' }}>
                                        <HelpIcon />
                                    </Avatar>
                                    <FormControl onSubmit={RemindClick} margin="normal" component="form" fullWidth>
                                        <TextField name="email" type="text" required margin="normal" variant="standard" label="Enter email address..."
                                            error={error}
                                            helperText={errorText}
                                            onChange={() => {
                                                setError(false);
                                                setErrorText("");
                                            }}
                                        />
                                        <Button endIcon={<ForwardToInboxIcon />} type="submit" variant="contained">
                                            Remind password
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
