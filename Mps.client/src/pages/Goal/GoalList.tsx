import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogActions, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import { GoalVM } from '../../models/goalModels';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseUrl from '../../utils/baseUrl';
import CloseIcon from '@mui/icons-material/Close';

export default function GoalList() {
    const [Goals, setGoals] = useState<GoalVM[]>([]);
    const [Goal, setGoal] = useState<GoalVM>(new GoalVM());
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedRowId, setSelectedRowId] = useState<number>(0);
    const [nameError, setNameError] = useState<boolean>(false);
    const authToken = localStorage.getItem('authToken');

    const columns: GridColDef[] = [
        //{ field: 'idGoal', headerName: 'ID', flex: 0.5 },
        { field: 'name', headerName: 'Goal', flex: 1, editable: true },
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
        axios.get(`${baseUrl()}Goal`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((results) => {
                if (results.status === 200) {
                    setGoals(results.data.map((Goal: GoalVM) => ({ ...Goal, id: Goal.idGoal })))
                }
                else {
                    console.error(results.statusText);
                }
            }
            )
            .catch(err => console.error(err));
        setNeedRefresh(false)
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
            .delete(`${baseUrl()}Goal/${selectedRowId}`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Goal was succesfully deleted");
                }
                else {
                    toast.error("Error:" + resp.statusText);
                }
            })
            .catch((error) => console.error('Error making API request:', error))
    }

    const handleAddClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (Goal.name.trim() === '' || Goal.name === undefined) {
            setNameError(true);
            return;
        }

        axios
            .post(`${baseUrl()}Goal`, {
                name: Goal.name.trim(),
                description: Goal.description.trim()
            }, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Goal was succesfully created");
                }
                else {
                    toast.error("Error:" + resp.statusText);
                }
            })
            .catch((err) => (console.log(err)))
    }

    const handleEditClick = (updatedRow: GridRowModel) => {
        const data = {
            name: updatedRow.name.trim(),
            description: updatedRow.description.trim(),
            idGoal: updatedRow.idGoal
        };

        if (data.name === '' || data.name === undefined) {
            toast.error('Goal\'s name can\'t be empty');
        }
        else {
            axios
                .put(`${baseUrl()}Goal/${data.idGoal}`,
                    data,
                    { headers: { 'Authorization': `Bearer ${authToken}` } })
                .then((resp) => {
                    if (resp.status === 200) {
                        setNeedRefresh(true);
                        toast.success("Goal's information was succesfully updated");
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
            <h1 style={{ textAlign: "center" }}>Goals</h1>
            <div id="selection-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                <Box sx={{ height: 400, width: '50%' }}>
                    <DataGrid
                        rows={Goals}
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
                <Box component="form" onSubmit={handleAddClick} sx={{ backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 0 9px gray' }} padding='2rem' width="45%">
                    <Typography variant="h6" color="black">Enter new Goal</Typography>
                    <Divider component="h6" />
                    <TextField
                        error={nameError}
                        sx={{ margin: '1rem 0' }}
                        required
                        name="Name"
                        label="Name"
                        placeholder="nuts"
                        fullWidth={true}
                        helperText={nameError ? "Incorrect entry." : ""}
                        onChange={(e) => {
                            setGoal({ ...Goal, name: e.target.value });
                            setNameError(false)
                        }}
                        inputProps={{ maxLength: '50' }}
                    />
                    <Divider component="h6" />
                    <TextField
                        sx={{ margin: '1rem 0' }}
                        name="description"
                        label="Description"
                        multiline
                        rows={4}
                        fullWidth={true}
                        onChange={(e) => {
                            setGoal({ ...Goal, description: e.target.value })
                        }}
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
                    {"Do you really want to delete this goal?"}
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

