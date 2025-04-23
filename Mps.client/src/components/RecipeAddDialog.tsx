import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TimerIcon from '@mui/icons-material/Timer';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import { RecipeVM } from '../models/recipeModels';
import { DishType } from '../models/nutritionPlanModels';

interface RecipeDialogProps {
    openRecipeDialog: boolean;
    handleCloseRecipeDialog: () => void;
    recipe: RecipeVM | null;
    dishTypes: DishType[];
    setSelectedDishType: (value: number) => void;
    handleAddDishClick: () => void;
    handleDetailedInfoClick: () => void;
    updateRecipe: (updatedRecipe: RecipeVM) => void;
}

export default function RecipeAddDialog({
    openRecipeDialog,
    handleCloseRecipeDialog,
    recipe,
    dishTypes,
    setSelectedDishType,
    handleAddDishClick,
    handleDetailedInfoClick,
    updateRecipe
}: RecipeDialogProps) {
    return (
        <>
            <Dialog
                onClose={handleCloseRecipeDialog}
                aria-labelledby="customized-dialog-title"
                open={openRecipeDialog}
            >
                <DialogTitle sx={{ m: 0, p: 2, bgcolor: "#4285F4", color: 'white' }} id="customized-dialog-title">
                    {recipe && recipe?.title}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseRecipeDialog}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <img src={recipe?.image} className="recipe-dialog-img" />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                            <TimerIcon />
                            <Typography variant="body2">Ready in:&nbsp;{recipe?.readyInMinutes}&nbsp;minutes</Typography>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                            <LocalDiningIcon />
                            <Typography variant="body2">Servings:&nbsp;</Typography>
                            <TextField
                                sx={{ width: '3rem' }}
                                required
                                variant="standard"
                                id="standard-adornment-servings"
                                aria-describedby="standard-servings-helper-text"
                                inputProps={{
                                    sx: { textAlign: 'center' }
                                }}
                                name="servings"
                                type='number'
                                value={recipe?.servings}
                                onChange={(e) => {
                                    if (recipe) {
                                        const updatedRecipe = { ...recipe, servings: Number(e.target.value) };
                                        updateRecipe(updatedRecipe);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel id="dish-type-label">Dish type</InputLabel>
                        <Select
                            labelId="dish-type-label"
                            id="dish-type-select"
                            label="Dish-type"
                            required
                            defaultValue={dishTypes.length > 0 ? dishTypes[0].idDishTypes : ''}
                            onChange={(e) => setSelectedDishType(Number(e.target.value))}
                        >
                            {
                                dishTypes && dishTypes.map((dishType) => (
                                    <MenuItem key={dishType.idDishTypes} value={dishType.idDishTypes}>{dishType.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <Button onClick={handleAddDishClick} fullWidth variant="contained" endIcon={<AddIcon />}>Add</Button>
                    <hr />
                    <Typography marginBottom="0.5rem" variant="h5">Ingredients:</Typography>
                    <Grid container spacing={2}>
                        {recipe?.extendedIngredients.map((ingredient) => (
                            <Grid key={ingredient.name + ' ' + Math.random()} item md={6}>
                                <Typography variant="body2">{ingredient.name}:&nbsp;{ingredient.amount}&nbsp;{ingredient.unit}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                    <hr />
                    <Typography variant="h5">Nutrition Facts:</Typography>
                    <div style={{ display: "grid", gridTemplateColumns: '1fr 1fr' }}>
                        {recipe?.nutrition.nutrients.slice(0, 6).map((nutrient) => (
                            <Typography variant="body2" key={nutrient.name} sx={{ margin: '0.5rem 0' }}>{nutrient.name}:&nbsp;{nutrient.amount}&nbsp;{nutrient.unit}</Typography>
                        ))}
                    </div>
                    <hr />
                    <div style={{ textAlign: 'center' }}>
                        <Button onClick={handleDetailedInfoClick} startIcon={<ArticleIcon />}>Detailed information</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}