import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogActions, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import { Category, CategoryVM } from '../../models/categoryModels';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseUrl from '../../utils/baseUrl';
import CloseIcon from '@mui/icons-material/Close';
export default function CategoryList() {
    const [categories, setCategories] = useState<CategoryVM[]>([]);
    const [category, setCategory] = useState<Category>(new Category());
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedRowId, setSelectedRowId] = useState<number>(0);
    const [nameError, setNameError] = useState<boolean>(false);
    const authToken = localStorage.getItem('authToken');

    const columns: GridColDef[] = [
        //{ field: 'idCategory', headerName: 'ID', flex: 0.5 },
        { field: 'title', headerName: 'Category', flex: 1.5, editable: true },
        {
            field: 'actions', headerName: '', renderCell: (params) => {
                return (
                    <IconButton onClick={() => handleDeleteClick(params.row.id)}  aria-label="delete">
                        <DeleteIcon color="error" />
                    </IconButton>
                );
            }
        }
    ];

    useEffect(() => {
        axios.get(`${baseUrl()}Category`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((results) => {
                if (results.status === 200) {
                    setCategories(results.data.map((category: CategoryVM) => ({ ...category, id: category.idCategory })))
                }
                else {
                    console.error(results.statusText);
                }
            })
            .catch(err => console.error(err));
        setNeedRefresh(false);
    }, [needRefresh, authToken])

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
        axios
            .delete(`${baseUrl()}Category/${selectedRowId}`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Category was succesfully deleted");
                }
                else {
                    toast.error("Error:" + resp.statusText);
                }
            })
            .catch((error) => console.error('Error making API request:', error))
    }

    const handleAddClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (category.title === undefined || category.title.trim() === '') {
            setNameError(true);
            return;
        }

        axios
            .post(`${baseUrl()}Category`, {
                title: category.title.trim(),
            },
                { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Category was succesfully created");
                }
                else {
                    toast.error("Error:" + resp.statusText);
                }
            })
            .catch((err) => (console.log(err)))
    }

    const handleEditClick = (updatedRow: GridRowModel) => {
        const data = {
            title: updatedRow.title.trim(),
            idCategory: updatedRow.idCategory
        };

        if (data.title.trim() === '' || data.title === undefined) {
            toast.error('Category\'s title can\'t be empty');
        }
        else if (data.title.trim().length > 50) {
            toast.error('Category\'s title can\'t be longer than 50 letters');
        }
        else {
            axios
                .put(`${baseUrl()}Category/${data.idCategory}`,
                    data,
                    { headers: { 'Authorization': `Bearer ${authToken}` } })
                .then((resp) => {
                    if (resp.status === 200) {
                        setNeedRefresh(true);
                        toast.success("Category's information was succesfully updated");
                    }
                    else {
                        toast.error("Error:" + resp.statusText);
                    }
                })
                .catch((error) => console.error('Error making API request:', error))
        }
        return updatedRow;
    };

    return (
        <>
            <ToastContainer />
            <h1 style={{ textAlign: "center" }}>Categories</h1>
            <div id="selection-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                <Box sx={{ height: 400, width: '50%' }}>
                    <DataGrid
                        rows={categories}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5]}
                        disableRowSelectionOnClick
                        processRowUpdate={(updatedRow) => handleEditClick(updatedRow)}
                        onProcessRowUpdateError={(err) => alert(err)}
                    />
                </Box>
            </div>
            <div id="selection-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                <Box component="form" onSubmit={handleAddClick} sx={{ backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 0 9px gray' }} padding='2rem' width="45%">
                    <Typography variant="h6">Enter new category</Typography>
                    <Divider component="h6" />
                    <TextField
                        error={nameError}
                        sx={{ margin: '1rem 0' }}
                        required
                        name="Title"
                        label="Name"
                        placeholder="nuts"
                        fullWidth={true}
                        helperText={nameError ? "Incorrect entry." : ""}
                        onChange={(e) => {
                            setCategory({ ...category, title: e.target.value });
                            setNameError(false)
                        }}
                        inputProps={{ maxLength: '50' }}
                    />
                    <Divider component="h6" />
                    <Button type="submit" sx={{ margin: '1rem 0' }} endIcon={<AddIcon />} variant="contained">Add</Button>
                </Box>
            </div>
            <Dialog
                open={openDialog}
                onClose={handleClickClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Do you really want to delete this category?"}
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

