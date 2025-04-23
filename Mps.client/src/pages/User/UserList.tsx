import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../../models/userModels";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { IconButton, Tooltip } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseUrl from "../../utils/baseUrl";
import InfoIcon from '@mui/icons-material/Info';
export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const authToken = localStorage.getItem('authToken');
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 0.5 },
        { field: 'surname', headerName: 'Surname', flex: 0.5 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'birthdate', headerName: 'Birth date', flex: 0.5 },
        { field: 'active', headerName: 'Active', flex: 0.5 },
        {
            field: 'actions', headerName: '', renderCell: (params) => {
                return (
                    <IconButton onClick={() => handleBlock(params.row.idUser, params.row.active)}>
                        {params.row.active ? <BlockIcon color="error" /> : <SettingsBackupRestoreIcon />}
                    </IconButton>
                );
            }
        }
    ];

    useEffect(() => {
        axios
            .get(`${baseUrl()}User`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((res) => (setUsers(res.data.map((user: User) => ({ ...user, id: user.idUser })))))
            .catch((err) => console.error(err))
        setNeedRefresh(false);
    }, [needRefresh, authToken])

    const handleBlock = (id: number, active: boolean) => {
        axios
            .post(`${baseUrl()}User/Block/${id}`, null, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    if (active)
                        toast.success("Succesfully blocked");
                    else
                        toast.success("Succesfully unblocked");
                }
                else {
                    toast.error(resp.statusText);
                }
            })
            .catch((err) => console.error(err))
    }

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Users</h1>
            <div id="selection-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', flexDirection: 'column' }}>
                <Box sx={{ height: 400, width: '50%' }}>
                    <DataGrid
                        rows={users}
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
                    />
                </Box>
                <div style={{ position: 'relative' }}>
                    <Tooltip title="Copyright 2024 Katerina Limpitsouni" placement="top">
                        <IconButton style={{ position: 'absolute', top: 90, right: 0 }}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <img style={{ maxHeight: "326px", maxWidth: "450px", width: "auto", height: 'auto', marginTop: '8rem' }} src="/userList.svg" alt="Users" />
                </div>
            </div>
            <ToastContainer />
        </>
    );
} 