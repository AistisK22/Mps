import { Box, Button, Card, CardContent, Chip, Divider, FormControl, IconButton, List, ListItem, Menu, MenuItem, SelectChangeEvent, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import axios from "axios";
import { RecipeVM } from "../../models/recipeModels";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import baseUrl from "../../utils/baseUrl";
import { DishType, NutritionPlan, NutritionPlanDay, NutritionPlanDish, PlanNutrition, PlanNutritionBar } from "../../models/nutritionPlanModels";
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ClearIcon from '@mui/icons-material/Clear';
import RecipeAddDialog from "../../components/RecipeAddDialog";
import RecipeSearchList from "../../components/RecipeSearchList";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DishConsumedDialog from "../../components/DishConsumedDialog";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PlanNutritionDialog from "../../components/PlanNutritionDialog";
import DishViewDialog from "../../components/DishViewDialog";
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ShoppingListDialog from "../../components/ShoppingListDialog";
import DayNutritionDialog from "../../components/DayNutritionDialog";
import ProgressCircle from "../../components/ProgressCircle";
import { CustomRecipe } from "../../models/customRecipeModels";
import CustomRecipeListDialog from "../../components/CustomRecipeListDialog";
import MoreVertIcon from '@mui/icons-material/MoreVert';

const cuisineList = [
    'African', 'British', 'Cajun', 'Caribbean',
    'Asian', 'American', 'Irish', 'Italian',
    'Chinese', 'Japanese', 'Jewish', 'Korean',
    'Eastern European', 'European', 'French',
    'German', 'Greek', 'Indian', 'Latin American',
    'Mediterranean', 'Mexican', 'Middle Eastern',
    'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'
];

const mealTypeList = [
    'main course', 'side dish', 'dessert', 'appetizer',
    'salad', 'bread', 'breakfast', 'soup',
    'beverage', 'sauce', 'marinade', 'fingerfood',
    'snack', 'drink'
];

export default function NutritionPlanView() {
    const [open, setOpen] = useState<boolean>(false);
    const [openRecipeDialog, setOpenRecipeDialog] = useState<boolean>(false);
    const [openDishConsumedDialog, setOpenDishConsumedDialog] = useState<boolean>(false);
    const [selectedConsumedDish, setSelectedConsumedDish] = useState<NutritionPlanDish>(new NutritionPlanDish());
    const [filterText, setFilterText] = useState<string>("");
    const [recipes, setRecipes] = useState<RecipeVM[]>([]);
    const [recipe, setRecipe] = useState<RecipeVM>(new RecipeVM());
    const [dishTypes, setDishTypes] = useState<DishType[]>([]);
    const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const [rows, setRows] = useState<JSX.Element[]>([]);
    const [startingDate, setStartingDate] = useState<Date>(new Date());
    const [selectedDishType, setSelectedDishType] = useState<number>(1);
    const [selectedDayId, setSelectedDayId] = useState<string | undefined>("");
    const [planExists, setPlanExists] = useState<boolean>(false);
    const [planDate, setPlanDate] = useState<string>("");
    const [cuisines, setCuisines] = useState<string[]>([]);
    const [mealTypes, setMealTypes] = useState<string[]>([]);
    const [openPlanNutritionDialog, setOpenPlanNutritionDialog] = useState<boolean>(false);
    const [planNutrition, setPlanNutrition] = useState<PlanNutrition>(new PlanNutrition());
    const [planNutritionBar, setPlanNutritionBar] = useState<PlanNutritionBar[]>([]);
    const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan>(new NutritionPlan());
    const [selectedDish, setSelectedDish] = useState<NutritionPlanDish>(new NutritionPlanDish());
    const [dishViewDialog, setDishViewDialog] = useState<boolean>(false);
    const [shoppingListTitle, setShoppingListTitle] = useState<string>("");
    const [openShoppingListDialog, setOpenShoppingListDialog] = useState<boolean>(false);
    const [openDayNutritionDialog, setOpenDayNutritionDialog] = useState<boolean>(false);
    const [selectedDay, setSelectedDay] = useState<NutritionPlanDay>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openDishSelection = Boolean(anchorEl);
    const [openCustomRecipeListDialog, setOpenCustomRecipeListDialog] = useState<boolean>(false);
    const [customRecipes, setCustomRecipes] = useState<CustomRecipe[]>([]);
    const [selectedCustomRecipe, setSelectedCustomRecipe] = useState<CustomRecipe>(new CustomRecipe());
    const [planAnchorEl, setPlanAnchorEl] = useState<null | HTMLElement>(null);
    const openPlanMenu = Boolean(planAnchorEl);

    const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
    const authToken = localStorage.getItem('authToken');
    const { id } = useParams();
    const navigate = useNavigate();

    const todaysDate = new Date();
    const startDate = startingDate;
    const todayDayOfWeek = startDate.getDay();
    const daysUntilMonday = (todayDayOfWeek + 6) % 7;
    startDate.setDate(startDate.getDate() - daysUntilMonday);

    const shouldDisableDate = (date: Date): boolean => {
        date = new Date(date);
        return date.getDay() !== 1;
    };

    useEffect(() => {
        axios
            .get(`https://api.spoonacular.com/recipes/complexSearch`
                + `?apiKey=${apiKey}`
                + `&query=${filterText}`
                + `&number=6`
                + `&addRecipeInformation=true`
                + `&addRecipeNutrition=true`
                + (cuisines.length > 0 ? `&cuisine=${cuisines}` : "")
                + (mealTypes.length > 0 ? `&type=${mealTypes}` : "")
            )
            .then((res) => {
                if (res.status === 200)
                    setRecipes(res.data.results)
                else
                    console.error(res.statusText);
            });

        axios
            .get(`${baseUrl()}NutritionPlan/GetDishTypes`)
            .then((res) => {
                if (res.status === 200)
                    setDishTypes(res.data)
                else
                    console.error(res.statusText);
            });

        axios
            .get(`${baseUrl()}NutritionPlan/${id ? id : 0}`, {
                params: {
                    startDate: startingDate
                },
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    setRows(renderNutritionPlanLayout(res.data));
                    setPlanExists(true);
                    setNutritionPlan(res.data)
                }
                else if (res.status === 204) {
                    setRows(renderNutritionPlanLayout(new NutritionPlan()));
                    setPlanExists(false);
                    setNutritionPlan(new NutritionPlan());
                }
                else
                    console.error(res.statusText);
            });

        setNeedRefresh(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterText, apiKey, needRefresh, id, startingDate, cuisines, mealTypes, authToken]);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpenRecipeDialog = (id: number) => {
        axios
            .get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=true`)
            .then((res) => {
                if (res.status === 200)
                    setRecipe(res.data)
                else
                    console.error(res.statusText);
            })
            .catch((error) => console.error('Error making API request:', error));
        setOpenRecipeDialog(true);
    };
    const handleCloseRecipeDialog = () => {
        setOpenRecipeDialog(false);
    };

    const handleDetailedInfoClick = () => {
        window.open(`/recipe/${recipe?.id}`, "_blank");
    }

    const handleDetailedDishInfoClick = (id: number) => {
        window.open(`/recipe/${id}`, "_blank");
    }

    const renderNutritionPlanLayout = (nutritionPlan: NutritionPlan) => {
        const currentDate = nutritionPlan.idNutritionPlan !== 0 ? new Date(nutritionPlan.startDate) : new Date(startDate);
        const rows = [];
        for (let i = 0; i < 7; i++) {
            nutritionPlan?.nutritionPlanDays.length > 0 && nutritionPlan.nutritionPlanDays.some(npd => npd.date.toString() === currentDate.toLocaleDateString("lt-LT"))
                ? rows.push(
                    <Card
                        className="plan-card"
                        id="selection-card"
                        sx={{ border: currentDate.toDateString() === todaysDate.toDateString() ? "5px solid #FFA500" : "1px solid white" }}
                        key={currentDate.toISOString() + '-' + i}
                    >
                        <CardContent key={'-' + i} sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    {currentDate.toLocaleString('default', { month: 'long' })}&nbsp;
                                    {currentDate.getDate()}
                                </div>
                                <IconButton
                                    data-nutritionplandaydate={nutritionPlan.nutritionPlanDays.find(npd => npd.date.toString() === currentDate.toLocaleDateString("lt-LT"))?.date}
                                    onClick={(e) => {
                                        setOpenDayNutritionDialog(true);
                                        setSelectedDay(nutritionPlan.nutritionPlanDays.find(npd => npd.date.toString() === e.currentTarget.dataset.nutritionplandaydate))
                                    }}
                                    sx={{ p: "0.2rem" }}>
                                    <AnalyticsIcon fontSize="medium" />
                                </IconButton>
                            </div>
                            <Typography variant="h5">
                                {currentDate.toLocaleString('en-us', { weekday: 'long' })}
                            </Typography>
                            {
                                nutritionPlan.nutritionPlanDays
                                    .find(npd => npd.date.toString() === currentDate.toLocaleDateString("lt-LT"))
                                    ?.nutritionPlanDishes.map((dish) => (
                                        <List sx={{ width: '100%', bgcolor: 'inherit' }}>
                                            <ListItem id="plan-list-item" alignItems="flex-start">
                                                <ListItemAvatar onClick={() => handleDishViewClick(dish)}>
                                                    <Avatar variant="rounded" alt="dish" src={dish.idRecipeNavigation.image} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    onClick={() => handleDishViewClick(dish)}
                                                    primary={dish.idRecipeNavigation.title}
                                                    secondary={
                                                        <>
                                                            <Typography
                                                                sx={{ display: 'inline' }}
                                                                component="span"
                                                                variant="body2"
                                                                color="text.primary"
                                                            >
                                                                Servings:&nbsp;{dish.servings}
                                                            </Typography>
                                                            <br />
                                                            <Chip
                                                                color={
                                                                    dish.dishType === 1
                                                                        ? "info"
                                                                        : dish.dishType === 2
                                                                            ? "secondary"
                                                                            : "warning"
                                                                }
                                                                size="small"
                                                                label={getDishType(dish.dishType)}
                                                            />
                                                        </>
                                                    }
                                                />
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <IconButton onClick={() => handleConsumeDishClick(dish)}>
                                                        <TaskAltIcon sx={{ color: dish.servings === dish.servingsConsumed ? "green" : "#FFA500" }} />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleRemoveDishClick(dish.idNutritionPlanDish)}>
                                                        <ClearIcon color="error" />
                                                    </IconButton>
                                                </div>
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </List>
                                    ))
                            }
                            <Button
                                id="add-dish-button"
                                data-nutritionplandayid={nutritionPlan.nutritionPlanDays.find(npd => npd.date.toString() === currentDate.toLocaleDateString("lt-LT"))?.idNutritionPlanDay}
                                sx={{ borderColor: "#FFA500", color: '#FFA500', marginTop: 'auto', marginBottom: "2rem" }} onClick={(e) => {
                                    handleDishMenuClick(e);
                                    setSelectedDayId(e.currentTarget.dataset.nutritionplandayid)
                                }}
                                aria-controls={openDishSelection ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openDishSelection ? true : undefined}
                                variant="outlined"
                                endIcon={<AddIcon />}>
                                Add a dish
                            </Button>
                        </CardContent>
                    </Card>
                )
                : rows.push(
                    <Card
                        id="selection-card"
                        className="plan-card"
                        key={currentDate.toISOString()}
                        sx={{ border: currentDate.toDateString() === todaysDate.toDateString() ? "5px solid #FFA500" : "1px solid white" }}
                    >
                        <CardContent >
                            {currentDate.toLocaleString('default', { month: 'long' })}&nbsp;
                            {currentDate.getDate()}
                            <br />
                            <Typography variant="h5">{currentDate.toLocaleString('en-us', { weekday: 'long' })}</Typography>
                            <br />
                            <Button
                                id="add-dish-button"
                                fullWidth
                                data-plandate={currentDate.toISOString()}
                                sx={{ borderColor: "#FFA500", color: '#FFA500' }}
                                onClick={(e) => { handleDishMenuClick(e); setPlanDate(e.currentTarget.dataset.plandate!); }}
                                variant="outlined"
                                aria-controls={openDishSelection ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openDishSelection ? true : undefined}
                                endIcon={<AddIcon />}
                            >
                                Add a dish
                            </Button>
                        </CardContent>
                    </Card>
                );
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return rows;
    }

    const handleGenerateClick = () => {
        setOpenBackdrop(true);
        const endDate: Date = new Date(startDate.getTime());
        endDate.setDate(startDate.getDate() + 7);
        axios.post(`${baseUrl()}NutritionPlan/Generate`, null, {
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            },
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
            .then(resp => {
                setOpenBackdrop(false);
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Nutrition plan was succesfully generated");
                }
                else {
                    toast.error(resp.data);
                }
            })
            .catch(err => {
                setOpenBackdrop(false);
                console.error(err);
                toast.error(err.response.data);
            });
    }

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const adjustedDate = new Date(date);
            adjustedDate.setTime(adjustedDate.getTime() - adjustedDate.getTimezoneOffset() * 60 * 1000);
            setStartingDate(adjustedDate);
        }
    }

    const handleAddDishClick = () => {
        //const customRecipe = new RecipeVM();
        //customRecipe.idRecipe = selectedCustomRecipe.idRecipe;
        //customRecipe.readyInMinutes = selectedCustomRecipe.readyInMinutes;
        //customRecipe.title = selectedCustomRecipe.title;
        //customRecipe.summary = selectedCustomRecipe.summary;
        //customRecipe.image = selectedCustomRecipe.image;
        //customRecipe.nutrition.weightPerServing.amount = Number(selectedCustomRecipe.weightPerServing.split(' ')[0]);
        //customRecipe.nutrition.weightPerServing.unit = selectedCustomRecipe.weightPerServing.split(' ')[1];
        //TODO

        recipe.dishType = selectedDishType;
        selectedCustomRecipe.dishType = selectedDishType;
        if (planExists) {
            axios
                .put(`${baseUrl()}NutritionPlan/AddRecipeToPlan/${selectedDayId}`,
                    openCustomRecipeListDialog ? selectedCustomRecipe : recipe,
                    { headers: { 'Authorization': `Bearer ${authToken}` } })
                .then((resp) => {
                    if (resp.status === 200) {
                        setNeedRefresh(true);
                        toast.success("Dish was succesfully added");
                    }
                    else {
                        toast.error("Error:" + resp.statusText);
                    }
                })
                .catch((error) => console.error('Error making API request:', error))
        }
        else {
            const endDate: Date = new Date(startDate.getTime());
            endDate.setDate(startDate.getDate() + 6);
            recipe.planDate = new Date(planDate);

            axios
                .post(`${baseUrl()}NutritionPlan/CreatePlan`,
                    openCustomRecipeListDialog ? selectedCustomRecipe : recipe,
                    {
                        params: {
                            startDate: startDate.toISOString(),
                            endDate: endDate.toISOString()
                        },
                        headers: { 'Authorization': `Bearer ${authToken}` }
                    })
                .then((resp) => {
                    if (resp.status === 200) {
                        setNeedRefresh(true);
                        toast.success("Dish was succesfully added");
                    }
                    else {
                        toast.error("Error:" + resp.statusText);
                    }
                })
                .catch((error) => console.error('Error making API request:', error))
        }
    }

    const handleRemoveDishClick = (id: number) => {
        axios
            .delete(`${baseUrl()}NutritionPlan/RemoveDish/${id}`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Dish was succesfully removed");
                }
                else {
                    toast.error("Error:" + resp.statusText);
                }
            })
            .catch((error) => console.error('Error making API request:', error))
    }

    const handleConsumeDishClick = (dish: NutritionPlanDish) => {
        setOpenDishConsumedDialog(true);
        setSelectedConsumedDish(dish);
    }

    const handleCloseDishConsumedDialog = () => {
        setOpenDishConsumedDialog(false);
    }

    const handleChange = (event: SelectChangeEvent<typeof cuisines>) => {
        const {
            target: { value },
        } = event;
        setCuisines(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleMealChange = (event: SelectChangeEvent<typeof mealTypes>) => {
        const {
            target: { value },
        } = event;
        setMealTypes(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const updateRecipe = (updatedRecipe: RecipeVM) => {
        setRecipe(updatedRecipe);
    };

    const handleDishConsumption = (servingsConsumed: number) => {
        axios
            .put(`${baseUrl()}NutritionPlan/UpdateDishConsumption/${selectedConsumedDish.idNutritionPlanDish}`,
                null,
                {
                    headers: { 'Authorization': `Bearer ${authToken}` },
                    params: {
                        servingsConsumed: servingsConsumed,
                    },
                })
            .then((resp) => {
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Dish was succesfully updated");
                }
                else {
                    toast.error("Error:" + resp.statusText);
                }
            })
            .catch((error) => console.error('Error making API request:', error))
    }

    const handlePlanNutritionClick = () => {
        axios
            .get(`${baseUrl()}NutritionPlan/GetPlanNutrition/${nutritionPlan.idNutritionPlan}`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((res) => {
                if (res.status === 200)
                    setPlanNutrition(res.data)
                else
                    console.error(res.statusText);
            });

        axios
            .get(`${baseUrl()}NutritionPlan/GetPlanNutritionForBarCharts/${nutritionPlan.idNutritionPlan}`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((res) => {
                if (res.status === 200)
                    setPlanNutritionBar(res.data)
                else
                    console.error(res.statusText);
            });
    }

    const handleDishViewClick = (dish: NutritionPlanDish) => {
        setSelectedDish(dish);
        setDishViewDialog(true);
    }

    const handleShoppingListClick = () => {
        setOpenShoppingListDialog(true);
    }

    const handleShoppingListConfirmation = (event: React.FormEvent<HTMLDivElement>) => {
        setOpenBackdrop(true);
        event.preventDefault();

        if (shoppingListTitle.trim() === '') {
            toast.error("Shopping list's name cant be empty");
        }

        axios
            .post(`${baseUrl()}ShoppingList/${nutritionPlan.idNutritionPlan}`,
                null,
                {
                    params: { title: shoppingListTitle.trim() },
                    headers: { 'Authorization': `Bearer ${authToken}` }
                })
            .then((resp) => {
                setOpenBackdrop(false);
                if (resp.status === 200) {
                    navigate(`/ShoppingList/${resp.data}`);
                }
                else {
                    toast.error("Error:" + resp.statusText);
                }
            })
            .catch((error) => {
                console.error('Error making API request:', error); setOpenBackdrop(true);
            })
    }

    const getDishType = (dishType: number): string => {
        switch (dishType) {
            case 1:
                return "Breakfast";
            case 2:
                return "Lunch";
            case 3:
                return "Dinner";
            default:
                return "Breakfast";
        }
    };

    const handleDishMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDishMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCustomRecipeListDialogClick = () => {
        axios
            .get(`${baseUrl()}Recipes`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then((res) => {
                if (res.status === 200)
                    setCustomRecipes(res.data)
                else
                    console.error(res.statusText);
            })
            .catch((error) => console.error('Error making API request:', error));
        setOpenCustomRecipeListDialog(true);
    }

    const handleCustomRecipeSelect = (recipe: CustomRecipe) => {
        setSelectedCustomRecipe(recipe);
    };

    const handlePlanMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setPlanAnchorEl(event.currentTarget);
    }

    const handlePlanMenuClose = () => {
        setPlanAnchorEl(null);
    }

    return (
        <>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openDishSelection}
                onClose={handleDishMenuClose}
                MenuListProps={{
                    'aria-labelledby': 'add-dish-button',
                }}
                slotProps={{
                    paper: {
                        style: {
                            width: anchorEl ? anchorEl.clientWidth : undefined,
                        }
                    },
                }}
            >
                <MenuItem onClick={() => { handleClickOpen(); handleDishMenuClose() }}><b>Spoonacular</b>&nbsp;recipes</MenuItem>
                <Divider />
                <MenuItem onClick={() => { handleDishMenuClose(); handleCustomRecipeListDialogClick() }}>My recipes</MenuItem>
            </Menu>
            <Menu
                id="plan-menu"
                anchorEl={planAnchorEl}
                open={openPlanMenu}
                onClose={handlePlanMenuClose}
                MenuListProps={{
                    'aria-labelledby': 'plan-button',
                    disablePadding: true,
                }}
            >
                <Button
                    fullWidth
                    onClick={handleGenerateClick}
                    startIcon={<AutorenewIcon />}
                    variant="contained"
                    sx={{borderRadius:'0px'}}
                >
                    Generate plan
                </Button>
                {nutritionPlan.idNutritionPlan > 0 && (
                    <>
                        <hr style={{ margin: "0", border: "solid 1px white" }} />
                        <Button
                            sx={{ borderRadius: '0px' }}
                            fullWidth
                            onClick={handleShoppingListClick}
                            startIcon={<LocalGroceryStoreIcon />}
                            variant="contained"
                        >
                            Create shopping list
                        </Button>
                    </>
                )}
            </Menu>
            <ToastContainer />
            <ProgressCircle message="Generating..." openBackdrop={openBackdrop} />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    marginTop: '1rem',
                }}
            >
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={openPlanMenu ? 'long-menu' : undefined}
                    aria-expanded={openPlanMenu ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handlePlanMenuClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexGrow: 1,
                    }}
                >
                    <Button
                        onClick={() =>
                            setStartingDate(new Date(startingDate.setDate(startingDate.getDate() - 7)))
                        }
                        sx={{
                            borderRadius: '25px',
                            padding: '0.1rem 0',
                            fontSize: '22px',
                            marginX: '0.5rem',
                        }}
                        variant="contained"
                    >
                        <b>&lt;</b>
                    </Button>
                    <FormControl sx={{ marginX: '0.5rem' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                sx={{ backgroundColor: 'white', borderRadius: '5px' }}
                                name="plan-week"
                                format="YYYY-MM-DD"
                                label="Plan week"
                                shouldDisableDate={shouldDisableDate}
                                onChange={(e) => handleDateChange(e)}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <Button
                        onClick={() =>
                            setStartingDate(new Date(startingDate.setDate(startingDate.getDate() + 7)))
                        }
                        sx={{
                            borderRadius: '25px',
                            padding: '0.1rem 0',
                            fontSize: '22px',
                            marginX: '0.5rem',
                        }}
                        variant="contained"
                    >
                        <b>&gt;</b>
                    </Button>
                </Box>
                {nutritionPlan.idNutritionPlan > 0 && (
                    <IconButton
                        onClick={() => {
                            setOpenPlanNutritionDialog(true);
                            handlePlanNutritionClick();
                        }}
                        sx={{ marginX: '0.5rem' }}
                    >
                        <AnalyticsIcon fontSize="large" />
                    </IconButton>
                )}
            </Box>
            <div className="plan-layout">
                {rows}
                <RecipeSearchList
                    open={open}
                    handleClose={handleClose}
                    setFilterText={setFilterText}
                    mealTypes={mealTypes}
                    handleMealChange={handleMealChange}
                    mealTypeList={mealTypeList}
                    cuisines={cuisines}
                    handleChange={handleChange}
                    cuisineList={cuisineList}
                    recipes={recipes}
                    handleClickOpenRecipeDialog={handleClickOpenRecipeDialog}
                />
                <RecipeAddDialog
                    openRecipeDialog={openRecipeDialog}
                    handleCloseRecipeDialog={handleCloseRecipeDialog}
                    recipe={recipe}
                    dishTypes={dishTypes}
                    setSelectedDishType={setSelectedDishType}
                    handleAddDishClick={handleAddDishClick}
                    handleDetailedInfoClick={handleDetailedInfoClick}
                    updateRecipe={updateRecipe}
                />
                <DishConsumedDialog
                    openDishConsumedDialog={openDishConsumedDialog}
                    handleCloseDishConsumedDialog={handleCloseDishConsumedDialog}
                    dish={selectedConsumedDish}
                    handleDishConsumption={handleDishConsumption}
                    setSelectedConsumedDish={setSelectedConsumedDish}
                />
                <PlanNutritionDialog
                    openPlanNutritionDialog={openPlanNutritionDialog}
                    setOpenPlanNutritionDialog={setOpenPlanNutritionDialog}
                    planNutrition={planNutrition}
                    planNutritionBar={planNutritionBar}
                />
                <DishViewDialog
                    dishViewDialog={dishViewDialog}
                    selectedDish={selectedDish}
                    setDishViewDialog={setDishViewDialog}
                    handleDetailedDishInfoClick={handleDetailedDishInfoClick}
                />
                <ShoppingListDialog
                    open={openShoppingListDialog}
                    setOpenShoppingListDialog={setOpenShoppingListDialog}
                    setShoppingListTitle={setShoppingListTitle}
                    handleShoppingListConfirmation={handleShoppingListConfirmation}
                />
                <DayNutritionDialog
                    open={openDayNutritionDialog}
                    onClose={() => setOpenDayNutritionDialog(false)}
                    selectedDay={selectedDay}
                />
                <CustomRecipeListDialog
                    dishTypes={dishTypes}
                    open={openCustomRecipeListDialog}
                    onClose={() => setOpenCustomRecipeListDialog(false)}
                    customRecipes={customRecipes}
                    setSelectedDishType={setSelectedDishType}
                    onRecipeSelect={handleCustomRecipeSelect}
                    handleAddDishClick={handleAddDishClick}
                />
            </div>
        </>
    );
}

