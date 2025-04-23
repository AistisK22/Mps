import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import baseUrl from "../../utils/baseUrl";
import { ShoppingListProduct } from "../../models/shoppingListModels";
import { Backdrop, Box, Button, Card, CardContent, CardHeader, CircularProgress, Dialog, DialogActions, DialogTitle, Fade, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Pagination, Select, TextField, Tooltip } from "@mui/material";
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
export default function ShoppingListView() {
    const [shoppingListProducts, setShoppingListProducts] = useState<ShoppingListProduct[]>([]);
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedRowId, setSelectedRowId] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(15);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");

    const authToken = localStorage.getItem('authToken');
    const { id } = useParams();
    const navigate = useNavigate();

    const indexOfLastProduct = currentPage * rowsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
    const currentProducts = shoppingListProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number): void => {
        setCurrentPage(value);
    };

    useEffect(() => {
        axios
            .get(`${baseUrl()}ShoppingList/${id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then((res) => {
                setNeedRefresh(false);
                if (res.status === 200) {
                    setShoppingListProducts(res.data);
                    setTitle(res.data[0].shoppingListTitle);
                }
                else
                    console.error(res.statusText);
            });
    }, [authToken, id, needRefresh])

    const handleDeleteClick = (rowId: number) => {
        setSelectedRowId(rowId);
        setOpenDialog(true);
    }

    const handleDeleteConfirmation = () => {
        axios.delete(`${baseUrl()}ShoppingList/${id}/${selectedRowId}`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Succesfully marked as purchased");
                }
                else {
                    console.error(resp.statusText);
                    toast.error("Error while marking product. Please try again");
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error while marking product. Please try again");
            });
    }

    const handleListTitleUpdate = () => {
        axios.put(`${baseUrl()}ShoppingList/${id}`, null,
            {
                headers: { 'Authorization': `Bearer ${authToken}` },
                params: { title: title }
            })
            .then((resp) => {
                setEditMode(false);
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Succesfully updated shopping list title");
                }
                else {
                    console.error(resp.statusText);
                    toast.error("Error while updating shopping list title product. Please try again");
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error while updating shopping list title product. Please try again");
            });
    }

    return (
        <>
            <IconButton sx={{ mt: '2rem' }} onClick={() => navigate(-1)}>
                <ArrowBackIcon fontSize="large" />
            </IconButton>
            <Grid container>
                <Grid item sm={6} lg={4}>
                    <Fade in>
                        <Card sx={{ mt: '1rem', ml: "4rem", borderRadius:'16px' }}>
                            {
                                shoppingListProducts.length > 0 &&
                                <CardHeader
                                    title=
                                    {
                                        editMode
                                            ? <>
                                                <TextField onChange={(e) => setTitle(e.target.value)} defaultValue={title} variant="standard" placeholder="test" />
                                                <IconButton onClick={() => setEditMode(false)}>
                                                    <ClearIcon color="error" />
                                                </IconButton>
                                                <IconButton onClick={handleListTitleUpdate}>
                                                    <SaveIcon color="success" />
                                                </IconButton>
                                            </>
                                            : <>
                                                {shoppingListProducts[0].shoppingListTitle}
                                                <IconButton onClick={() => setEditMode(true)}>
                                                    <ModeEditIcon sx={{ color: '#4285F4' }} />
                                                </IconButton>
                                            </>
                                    }
                                />
                            }
                            <CardContent>
                                {
                                    currentProducts.length > 0
                                        ?
                                        <>
                                            <Box display="flex" justifyContent="space-between">
                                                <Pagination
                                                    count={Math.ceil(
                                                        shoppingListProducts.length / rowsPerPage
                                                    )}
                                                    page={currentPage}
                                                    onChange={handlePageChange}
                                                />
                                                <FormControl sx={{ width: '7rem' }}>
                                                    <InputLabel id="page-size-label">Rows per page</InputLabel>
                                                    <Select
                                                        size="small"
                                                        variant="standard"
                                                        labelId="page-size-label"
                                                        id="page-size-select"
                                                        value={rowsPerPage}
                                                        label="Page size"
                                                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                                    >
                                                        <MenuItem value={15}>15</MenuItem>
                                                        <MenuItem value={30}>30</MenuItem>
                                                        <MenuItem value={45}>45</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <List>
                                                {currentProducts.map((slp) => (
                                                    <ListItem key={slp.idProduct}>
                                                        <ListItemIcon>
                                                            <IconButton onClick={() => handleDeleteClick(slp.idProduct)}>
                                                                <DoneOutlineIcon />
                                                            </IconButton>
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={slp.productTitle.toLowerCase()} />
                                                    </ListItem>))}
                                            </List>
                                            <Box display="flex" justifyContent="space-between">
                                                <Pagination
                                                    count={Math.ceil(
                                                        shoppingListProducts.length / rowsPerPage
                                                    )}
                                                    page={currentPage}
                                                    onChange={handlePageChange}
                                                />
                                                <FormControl sx={{ width: '7rem' }}>
                                                    <InputLabel id="page-size-label">Rows per page</InputLabel>
                                                    <Select
                                                        size="small"
                                                        variant="standard"
                                                        labelId="page-size-label"
                                                        id="page-size-select"
                                                        value={rowsPerPage}
                                                        label="Page size"
                                                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                                    >
                                                        <MenuItem value={15}>15</MenuItem>
                                                        <MenuItem value={30}>30</MenuItem>
                                                        <MenuItem value={45}>45</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </>
                                        : <Backdrop open>
                                            <CircularProgress color="inherit" />
                                        </Backdrop>
                                }
                            </CardContent>
                        </Card>
                    </Fade>
                </Grid>
                <Grid justifyContent="center" display="flex" item sm={6} lg={8}>
                    <div style={{ position: 'relative' }}>
                    <Tooltip title={<a href="https://storyset.com/food">Food illustrations by Storyset</a>} placement="top">
                        <IconButton style={{ position: 'absolute', top: 150, right: 0 }}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <img
                        style={{ maxWidth: "800px", maxHeight: "800px", width: "100%", height: '100%', borderRadius: '4px' }}
                        src="/shopping.gif"
                        alt="Grocery shopping"
                        />
                    </div>
                </Grid>
            </Grid>
            <ToastContainer />
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Mark as purchased?"}
                </DialogTitle>
                <DialogActions>
                    <Button color="error" onClick={() => setOpenDialog(false)}>Disagree</Button>
                    <Button color="success" onClick={() => { handleDeleteConfirmation(); setOpenDialog(false); }} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}