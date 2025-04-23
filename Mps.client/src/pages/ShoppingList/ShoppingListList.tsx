import axios from "axios";
import { useEffect, useState } from "react";
import baseUrl from "../../utils/baseUrl";
import { useNavigate } from "react-router";
import { ShoppingList } from "../../models/shoppingListModels";
import { ToastContainer, toast } from "react-toastify";
import { Avatar, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import PreviewIcon from '@mui/icons-material/Preview';
import Delete from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ShoppingListList() {
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedRowId, setSelectedRowId] = useState<number>(0);
    const [filterText, setFilterText] = useState<string>("");

    const authToken = localStorage.getItem('authToken');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${baseUrl()}ShoppingList`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    setShoppingLists(resp.data.filter((sl: ShoppingList) => sl.title.toLowerCase().includes(filterText)));
                }
                else
                    console.error(resp.statusText);
            })
            .catch((err) => console.error(err));

        setNeedRefresh(false);
    }, [authToken, needRefresh, filterText]);

    const handleViewClick = (id: number) => {
        navigate(`/ShoppingList/${id}`);
    }

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClickClose = () => {
        setOpenDialog(false);
    };

    const handleDeleteClick = (rowId: number) => {
        setSelectedRowId(rowId);
        handleClickOpen();
    }

    const handleDeleteConfirmation = () => {
        axios.delete(`${baseUrl()}ShoppingList/${selectedRowId}`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Succesfully deleted shopping list");
                }
                else {
                    console.error(resp.statusText);
                    toast.error("Error while deleting shopping list. Please try again");
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error while deleting shopping list. Please try again");
            });
    }

    return (
        <>
            <Typography textAlign="center" mt="2rem" variant="h3">
                Shopping lists
            </Typography>
            {shoppingLists.length > 0 ?
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <TextField
                        InputProps={{
                            startAdornment: (
                                <SearchIcon style={{ color: 'white' }} />
                            ),
                            sx: { color: 'white' },
                        }}
                        style={{ textAlign: 'center', width: '25rem' }}
                        margin="normal"
                        onChange={(e) => (setFilterText(e.target.value))}
                        id="standard-basic"
                        variant="standard"
                        placeholder="Search..."
                    />
                    {
                        shoppingLists.map((shoppingList) => (
                            <Card id="selection-card" sx={{ width: '40%', marginTop: '2rem' }} key={shoppingList.idShoppingList}>
                                <CardHeader
                                    avatar={<Avatar sx={{ bgcolor: "#FFA500" }}>
                                        <ShoppingBasketIcon />
                                    </Avatar>}
                                    title={shoppingList.title}
                                    titleTypographyProps={{ variant: 'h5', style: { fontSize: '1.25rem' } }}
                                />
                                <CardContent>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <IconButton onClick={() => handleViewClick(shoppingList.idShoppingList)}>
                                                <PreviewIcon fontSize="large" />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(shoppingList.idShoppingList)}>
                                                <Delete color="error" fontSize="large" />
                                            </IconButton>
                                        </div>
                                        <Typography variant="body1">
                                            {shoppingList.shoppingListProducts.length}&nbsp;products
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                        )
                    }
                </div>
                : <Typography sx={{ color: '#FFA500' }} variant="h5">No shopping lists available</Typography>
            }
            <ToastContainer />
            <Dialog
                open={openDialog}
                onClose={handleClickClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Do you really want to delete this plan?"}
                </DialogTitle>
                <DialogActions>
                    <Button endIcon={<CloseIcon />} onClick={handleClickClose}>Disagree</Button>
                    <Button endIcon={<DeleteIcon />} color="error" onClick={() => { handleDeleteConfirmation(); handleClickClose(); }} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}