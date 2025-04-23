import { useEffect, useState } from "react"
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Fade, Grid, IconButton, Menu, MenuItem, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScaleIcon from '@mui/icons-material/Scale';
import EditIcon from '@mui/icons-material/Edit';
import { CustomRecipe } from "../../models/customRecipeModels";
import { PieChart } from "@mui/x-charts/PieChart";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getCustomRecipeCalories, getCustomRecipeCarbs, getCustomRecipeFat, getCustomRecipeProtein } from "../../utils/nutritionCalculations";
export default function CustomRecipeList() {
    const [recipes, setRecipes] = useState<CustomRecipe[]>([]);
    const authToken = localStorage.getItem('authToken');
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const [selectedID, setSelectedID] = useState<number>(0);
    const [openImageDialog, setOpenImageDialog] = useState<boolean>(false);
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [selectedRecipe, setSelectedRecipe] = useState<CustomRecipe>(new CustomRecipe());
    const [filterText, setFilterText] = useState<string>("");
    const [filterMinutesFrom, setFilterMinutesFrom] = useState<number>(1);
    const [filterMinutesTo, setFilterMinutesTo] = useState<number>(50);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openSortMenu = Boolean(anchorEl);

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${baseUrl()}Recipes`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    setRecipes(
                        res.data
                            .filter((r: CustomRecipe) =>
                                r.title.toLowerCase()
                                    .includes(filterText.toLowerCase())
                                &&
                                r.readyInMinutes >= filterMinutesFrom
                                &&
                                r.readyInMinutes <= filterMinutesTo
                            )
                        .sort((a: CustomRecipe, b: CustomRecipe) => {
                            if (sortAsc) {
                                return a.title.localeCompare(b.title);
                            } else {
                                return b.title.localeCompare(a.title);
                            }
                        })
                    );
                    setNeedRefresh(false);
                }
                else
                    console.error(res.statusText);
            })
            .catch(err => console.error(err));
    }, [authToken, filterMinutesFrom, filterMinutesTo, filterText, needRefresh, sortAsc]);

    const onCreateNewClick = () => {
        navigate("/CustomRecipe");
    }

    const handleEditOpenClick = (id: number) => {
        navigate(`/CustomRecipe/${id}`);
    }

    const handleDeleteClick = (id: number) => {
        setOpenDialog(true);
        setSelectedID(id);
    }

    const handleDeleteConfirmation = () => {
        axios
            .delete(`${baseUrl()}Recipes/${selectedID}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Custom recipe was successfully deleted");
                }
                else {
                    toast.error("Error while deleting custom recipe");
                    console.error(res.statusText);
                }
            })
            .catch(err => console.error(err));
    }

    const handleRecipeImageClick = (r: CustomRecipe) => {
        setSelectedRecipe(r);
        setOpenImageDialog(true);
    }

    const handleSortMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
            <IconButton onClick={(e) => handleSortMenuClick(e)}>
                <FilterListIcon />
            </IconButton>
            <Box display="flex">
                <ToastContainer />
                <Dialog fullWidth onClose={() => setOpenImageDialog(false)} open={openImageDialog}>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenImageDialog(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogTitle fontWeight="bold">{selectedRecipe.title}</DialogTitle>
                    <DialogContent>
                        <Box display="flex" justifyContent="center">
                            <img style={{ width: 'auto', height: "auto", maxHeight: "500px", borderRadius:'16px' }} alt="custom recipe"
                            src={
                                    selectedRecipe.image === null || selectedRecipe.image === ""
                                    ? '/custom-recipe.svg'
                                    : 'Uploads/' + selectedRecipe.image
                        } />
                        </Box>
                        <Box mt="1rem" display="flex" justifyContent="space-between">
                            <Typography variant="body1">
                                <AccessTimeIcon fontSize="small" />&nbsp;{selectedRecipe.readyInMinutes}&nbsp;minutes
                            </Typography>
                            <Typography variant="body1">
                                <ScaleIcon fontSize="small" />&nbsp;{selectedRecipe.weightPerServing}(-s) per serving
                            </Typography>
                        </Box>
                        <Divider />
                        <Typography variant="h6">
                            Summary:
                        </Typography>
                        <Typography variant="body1">
                            {selectedRecipe.summary}
                        </Typography>
                        <Divider />
                        <Typography variant="h6">
                            Ingredients:
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item lg={6}>
                                {selectedRecipe.recipeIngredients.map(ri => (
                                    <Typography variant="body1">
                                        {ri.quantity}&nbsp;{ri.measurementUnitNavigation.name}{ri.idProductNavigation.title}
                                    </Typography>
                                ))}
                            </Grid>
                            <Grid item lg={6}>
                                <Typography variant="body1">{getCustomRecipeCalories(selectedRecipe.recipeIngredients)}&nbsp;kcal total</Typography>
                                <PieChart
                                    colors={["#FFA500", "#4285F4", "black"]}
                                    series={[
                                        {
                                            data: [
                                                { id: 0, value: getCustomRecipeFat(selectedRecipe.recipeIngredients), label: 'Fats, g' },
                                                { id: 1, value: getCustomRecipeCarbs(selectedRecipe.recipeIngredients), label: 'Carbs, g' },
                                                { id: 2, value: getCustomRecipeProtein(selectedRecipe.recipeIngredients), label: 'Protein, g' },
                                            ],
                                        },
                                    ]}
                                    width={250}
                                    height={100}
                                />
                            </Grid>
                        </Grid>
                        <Divider />
                        <Typography variant="h6">
                            Instructions:
                        </Typography>
                        <Typography variant="body1">
                            {selectedRecipe.instructions === "" ? "Not available" : selectedRecipe.instructions}
                        </Typography>
                    </DialogContent>
                </Dialog>
                <Box flex="3" marginRight="1rem">
                    <Fade in>
                        <Grid spacing={7} container>
                            {
                                recipes.length > 0
                                    ? recipes.map((r, index) => (
                                        <Grid key={index} item xl={3} lg={4} md={6} sm={12}>
                                            <Card key={index + 1} sx={{ boxShadow: 7, borderRadius:'16px' }}>
                                                <CardActionArea onClick={() => handleRecipeImageClick(r)}>
                                                    <CardMedia
                                                        sx={{ height: 300 }}
                                                        image={
                                                            r.image === null || r.image === ""
                                                            ? '/custom-recipe.svg'
                                                            : 'Uploads/' + r.image
                                                        }
                                                        title="Custom recipe"
                                                        className="custom-recipe-image"
                                                    />
                                                </CardActionArea>
                                                <CardContent>
                                                    <Typography variant="h5">
                                                        {r.title}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        <AccessTimeIcon fontSize="small" />&nbsp;{r.readyInMinutes}&nbsp;minutes
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        <ScaleIcon fontSize="small" />&nbsp;{r.weightPerServing}(-s) per serving
                                                    </Typography>
                                                </CardContent>
                                                <CardActionArea sx={{ ml: '11px' }}>
                                                    <IconButton size="small" onClick={() => handleEditOpenClick(r.idRecipe)} title="Details" aria-label="view details">
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => handleDeleteClick(r.idRecipe)} title="Delete" aria-label="delete">
                                                        <DeleteIcon color="error" />
                                                    </IconButton>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    ))
                                    : <Grid textAlign="center" item lg={12}><Typography sx={{ color: "#FFA500" }} variant="h6">No custom recipes available</Typography></Grid>
                            }
                        </Grid>
                    </Fade>
                </Box>
                <Box flex="1">
                    <Button onClick={onCreateNewClick} endIcon={<AddIcon />} sx={{ width: '100%' }} variant="contained">Create new</Button>
                    <TextField
                        InputProps={{
                            startAdornment: (
                                <SearchIcon style={{ color: 'white' }} />
                            ),
                            style: {
                                color: 'white',
                            },
                        }}
                        sx={{
                            textAlign: 'center',
                            mt: '1rem',
                            '& .MuiInput-underline:before': {
                                borderBottomColor: 'white', // Default color
                            },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                borderBottomColor: 'white', // Hover color
                            },
                            '& .MuiInput-underline:after': {
                                borderBottomColor: 'white', // Focused color
                            },
                            '& .MuiInput-input::placeholder': {
                                color: 'white', // Placeholder color
                                opacity: 1, // Fully opaque
                            },
                        }}
                        id="standard-basic"
                        variant="standard"
                        placeholder="Search..."
                        fullWidth
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <TextField
                            margin="dense"
                            id="minutesFrom"
                            label="Minutes, from"
                            type="number"
                            variant="standard"
                            sx={{
                                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                    appearance: 'none'
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: 'white', // Default color
                                },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                    borderBottomColor: 'white', // Hover color
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: 'white', // Focused color
                                },
                                '& .MuiInput-input::placeholder': {
                                    color: 'white', // Placeholder color
                                    opacity: 1, // Fully opaque
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'white', // Label color
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'white', // Focused label color
                                },
                                maxWidth: "200px",
                                color: 'white'
                            }}
                            inputProps={{
                                min: '0',
                                style: {
                                    color: 'white',
                                },
                            }}
                            defaultValue={filterMinutesFrom}
                            onChange={(e) => setFilterMinutesFrom(Number(e.target.value))}
                        />
                        <hr style={{ width: "3rem", color: "white" }} />
                        <TextField
                            margin="dense"
                            id="minutesTo"
                            label="Minutes, to"
                            type="number"
                            variant="standard"
                            sx={{
                                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                    appearance: 'none'
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: 'white', // Default color
                                },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                    borderBottomColor: 'white', // Hover color
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: 'white', // Focused color
                                },
                                '& .MuiInput-input::placeholder': {
                                    color: 'white', // Placeholder color
                                    opacity: 1, // Fully opaque
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'white', // Label color
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'white', // Focused label color
                                }
                            }}
                            defaultValue={filterMinutesTo}
                            inputProps={{
                                min: '0',
                                style: {
                                    color: 'white',
                                },
                            }}
                            onChange={(e) => setFilterMinutesTo(Number(e.target.value))}
                        />
                    </Box>
                </Box>
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Do you really want to delete this custom recipe?"}
                    </DialogTitle>
                    <DialogActions>
                        <Button endIcon={<CloseIcon />} onClick={() => setOpenDialog(false)}>Disagree</Button>
                        <Button endIcon={<DeleteIcon />} color="error" onClick={() => { handleDeleteConfirmation(); setOpenDialog(false) }} autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openSortMenu}
                    onClose={() => setAnchorEl(null)}
                    MenuListProps={{
                        'aria-labelledby': 'add-dish-button',
                    }}
                >
                    <MenuItem onClick={() => { setAnchorEl(null); setSortAsc(true) }}>Sort by title ascending</MenuItem>
                    <MenuItem onClick={() => { setAnchorEl(null); setSortAsc(false) }}>Sort by title descending</MenuItem>
                </Menu>
            </Box>
        </>
    )
}