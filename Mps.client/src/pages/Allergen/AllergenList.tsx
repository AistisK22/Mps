import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogActions, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import { AllergenVM } from '../../models/allergenModels';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseUrl from '../../utils/baseUrl';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

export default function AllergenList() {
    const [allergens, setAllergens] = useState<AllergenVM[]>([]);
    const [allergen, setAllergen] = useState<AllergenVM>(new AllergenVM());
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedRowId, setSelectedRowId] = useState<number>(0);
    const [nameError, setNameError] = useState<boolean>(false);
    const authToken = localStorage.getItem('authToken');

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Allergen', flex: 1, editable: true },
        { field: 'description', headerName: 'Description', flex: 1.5, editable: true },
        {
            field: 'actions', headerName: '', renderCell: (params) => {
                return (
                    <IconButton onClick={() => handleDeleteClick(params.row.id)} aria-label="delete">
                        <DeleteIcon color="error" />
                    </IconButton>
                );
            }
        }
    ];

    useEffect(() => {
        axios.get(`${baseUrl()}Allergen`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((results) => {
                if (results.status === 200) {
                    setAllergens(results.data.map((allergen: AllergenVM) => ({ ...allergen, id: allergen.idAllergen })))
                }
                else {
                    console.error(results.statusText);
                }
            }
            )
            .catch(err => console.error(err));
        setNeedRefresh(false)
    }, [authToken, needRefresh])

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
            .delete(`${baseUrl()}Allergen/${selectedRowId}`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Allergen was succesfully deleted");
                }
                else {
                    toast.error("Error:" + resp.statusText);
                }
            })
            .catch((error) => console.error('Error making API request:', error))
    }

    const handleAddClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (allergen?.name === undefined || allergen?.name.trim() === '') {
            setNameError(true);
            return;
        }

        axios
            .post(`${baseUrl()}Allergen`, {
                name: allergen.name.trim(),
                description: allergen.description.trim()
            }
                , { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Allergen was succesfully created");
                }
                else {
                    toast.error("Error:" + resp.statusText);
                }
            })
            .catch((err) => (console.error(err)))
    }

    const handleEditClick = (updatedRow: GridRowModel) => {
        const data = {
            name: updatedRow.name,
            description: updatedRow.description,
            idAllergen: updatedRow.idAllergen
        };

        if (data.name.trim() === '' || data.name === undefined) {
            toast.error('Allergen\'s name can\'t be empty');
        }
        else if (data.name.trim().length > 50) {
            toast.error('Allergen\'s name can\'t be longer than 50 letters');
        }
        else if (data.description.trim().length > 255) {
            toast.error('Allergen\'s description can\'t be longer than 255 letters');
        }
        else {
            axios
                .put(`${baseUrl()}Allergen/${updatedRow.idAllergen}`,
                    data,
                    { headers: { 'Authorization': `Bearer ${authToken}` } })
                .then((resp) => {
                    if (resp.status === 200) {
                        setNeedRefresh(true);
                        toast.success("Allergen's information was succesfully updated");
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
            <h1 style={{ textAlign: "center" }}>Allergens</h1>
            <div id="selection-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                <Box sx={{ height: 400, width: '50%' }}>
                    <DataGrid
                        rows={allergens}
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
                        onProcessRowUpdateError={() => toast.error("Internal server error")}
                    />
                </Box>
            </div>
            <div id="selection-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                <Box onSubmit={handleAddClick} component="form" sx={{ backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 0 9px gray' }} padding='2rem' width="45%">
                    <Typography variant="h6">Enter new allergen</Typography>
                    <Divider component="h6" />
                    <TextField
                        error={nameError}
                        sx={{ margin: '1rem 0' }}
                        required
                        name="Name"
                        label="Name"
                        placeholder="dairy"
                        fullWidth={true}
                        helperText={nameError ? "Incorrect entry." : ""}
                        onChange={(e) => {
                            setAllergen({ ...allergen, name: e.target.value });
                            setNameError(false)
                        }}
                        inputProps={{maxLength:'50'}}
                    />
                    <Divider component="h6" />
                    <TextField
                        sx={{ margin: '1rem 0' }}
                        name="description"
                        label="Description"
                        onChange={(e) => {
                            setAllergen({ ...allergen, description: e.target.value });
                        }}
                        multiline
                        rows={4}
                        fullWidth={true}
                        inputProps={{ maxLength: '255' }}
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
                    {"Do you really want to delete this allergen?"}
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

