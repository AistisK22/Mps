import { useEffect, useState } from "react";
import { PlanInformation } from "../../models/nutritionPlanModels";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Pagination, Select, Typography } from "@mui/material";
import PreviewIcon from '@mui/icons-material/Preview';
import Delete from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
function NutritionPlanList() {
    const [nutritionPlans, setNutritionPlans] = useState<PlanInformation[]>([]);
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedRowId, setSelectedRowId] = useState<number>(0);
    const [startDateFromFilter, setStartDateFromFilter] = useState<Dayjs | null>(getFirstMondayOfMonth(dayjs()));
    const [startDateToFilter, setStartDateToFilter] = useState<Dayjs | null>(getLastMondayOfMonth(dayjs()));
    const authToken = localStorage.getItem('authToken');
    const navigate = useNavigate();
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const indexOfLastPlan = currentPage * rowsPerPage;
    const indexOfFirstPlan = indexOfLastPlan - rowsPerPage;
    const currentNutritionPlans = nutritionPlans.slice(
        indexOfFirstPlan,
        indexOfLastPlan
    );

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number): void => {
        setCurrentPage(value);
    };

    function getFirstMondayOfMonth(date: Dayjs): Dayjs {
        return date.startOf('month').day(1);
    }

    function getLastMondayOfMonth(date: Dayjs): Dayjs {
        return date.endOf('month').day(1);
    }

    const shouldDisableDate = (date: Dayjs): boolean => {
        return date.day() !== 1;
    };

    useEffect(() => {
        axios.get(`${baseUrl()}NutritionPlan/GetAll`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    if (startDateFromFilter !== null && startDateToFilter !== null)
                        setNutritionPlans(resp.data.filter((np: PlanInformation) => dayjs(np.startDate) >= startDateFromFilter
                            && dayjs(np.endDate) <= startDateToFilter
                        ));
                    else {
                        setNutritionPlans(resp.data);
                    }
                }
                else
                    console.error(resp.statusText);
            })
            .catch((err) => console.error(err));

        setNeedRefresh(false);
    }, [authToken, needRefresh, startDateFromFilter, startDateToFilter]);

    const handleViewClick = (id: number) => {
        navigate(`/${id}`);
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
        axios.delete(`${baseUrl()}NutritionPlan/${selectedRowId}`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Succesfully deleted nutrition plan");
                }
                else {
                    console.error(resp.statusText);
                    toast.error("Error while deleting nutrition plan. Please try again");
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error while deleting nutrition plan. Please try again");
            });
    }

    return (
        <>
            <Typography textAlign="center" mt="2rem" variant="h3">
                Nutrition plans
            </Typography>
            <Box display="flex" justifyContent="center">
                <FormControl margin="normal">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            sx={{ backgroundColor: 'white', borderRadius: '5px', mr: '4rem' }}
                            name="plan-week"
                            format="YYYY-MM-DD"
                            label="Plan's start date from"
                            shouldDisableDate={shouldDisableDate}
                            value={startDateFromFilter}
                            onChange={(e) => setStartDateFromFilter(e)}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl margin="normal">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            sx={{ backgroundColor: 'white', borderRadius: '5px' }}
                            name="plan-week"
                            format="YYYY-MM-DD"
                            label="Plan's start date to"
                            shouldDisableDate={shouldDisableDate}
                            value={startDateToFilter}
                            onChange={(e) => setStartDateToFilter(e)}
                        />
                    </LocalizationProvider>
                </FormControl>
            </Box>
            &nbsp;
            {currentNutritionPlans.length > 0 ?
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <Box width="40%" display="flex" alignItems="center" justifyContent="space-between">
                        <Pagination
                            color="secondary"
                            count={Math.ceil(
                                nutritionPlans.length / rowsPerPage
                            )}
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                        <FormControl sx={{ width: '7rem' }}>
                            <InputLabel sx={{ color: 'white' }} id="page-size-label">Rows per page</InputLabel>
                            <Select
                                sx={{ color: 'white' }}
                                size="small"
                                variant="standard"
                                id="demo-simple-select"
                                value={rowsPerPage}
                                label="Age"
                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    {
                        currentNutritionPlans.map((nutritionPlan) => (
                            <Card id="selection-card" sx={{ width: '40%', marginTop: '2rem' }} key={nutritionPlan.idNutritionPlan}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {nutritionPlan.startDate.toString()}&nbsp;-&nbsp;{nutritionPlan.endDate.toString()}
                                    </Typography>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <IconButton onClick={() => handleViewClick(nutritionPlan.idNutritionPlan)}>
                                                <PreviewIcon fontSize="large" />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(nutritionPlan.idNutritionPlan)}>
                                                <Delete color="error" fontSize="large" />
                                            </IconButton>
                                        </div>
                                        <div>
                                            <Typography variant="body1">
                                                Total calories:&nbsp;{nutritionPlan.calories.toFixed(2)}&nbsp;kcal
                                            </Typography>
                                            <Typography variant="body1">
                                                Consumed calories:&nbsp;{nutritionPlan.consumedCalories.toFixed(2)}&nbsp;kcal
                                            </Typography>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                        )
                    }
                    &nbsp;
                    <Box width="40%" display="flex" alignItems="center" justifyContent="space-between">
                        <Pagination
                            color="secondary"
                            count={Math.ceil(
                                nutritionPlans.length / rowsPerPage
                            )}
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                        <FormControl sx={{ width: '7rem' }}>
                            <InputLabel sx={{ color: 'white' }} id="page-size-label">Rows per page</InputLabel>
                            <Select
                                sx={{ color: 'white' }}
                                size="small"
                                variant="standard"
                                id="demo-simple-select"
                                value={rowsPerPage}
                                label="Age"
                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                : <Typography textAlign="center" sx={{ color: '#FFA500' }} variant="h5">No nutrition plans available</Typography>
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

export default NutritionPlanList;