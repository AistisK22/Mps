import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { CustomRecipe } from "../models/customRecipeModels";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScaleIcon from '@mui/icons-material/Scale';
import { PieChart } from "@mui/x-charts/PieChart";
import { getCustomRecipeCalories, getCustomRecipeCarbs, getCustomRecipeFat, getCustomRecipeProtein } from "../utils/nutritionCalculations";
import AddIcon from '@mui/icons-material/Add';
import { DishType } from "../models/nutritionPlanModels";
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { Link } from "react-router-dom";
export default function CustomRecipeListDialog({ open, onClose, customRecipes, dishTypes, setSelectedDishType, onRecipeSelect, handleAddDishClick }
    : { open: boolean, onClose: () => void, customRecipes: CustomRecipe[], dishTypes: DishType[], setSelectedDishType: (value: number) => void, onRecipeSelect: (recipe: CustomRecipe) => void, handleAddDishClick: () => void }) {
    const [selectedRecipe, setSelectedRecipe] = useState<CustomRecipe>(new CustomRecipe());

    return (
        <Dialog
            maxWidth="xl"
            fullWidth
            open={open}
            onClose={onClose}
        >
            <DialogTitle sx={{ m: 0, p: 2, bgcolor: "#4285F4", color: 'white' }} id="customized-dialog-title">
                Choose a custom recipe
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <Link to="/CustomRecipes">Custom recipe creation</Link>
                <Grid container spacing={1}>
                    <Grid item lg={selectedRecipe.idRecipe > 0 ? 6 : 12}>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon style={{ color: 'gray' }} />
                                ),
                            }}
                            sx={{ textAlign: 'center', mb: "1rem" }}
                            id="standard-basic"
                            variant="standard"
                            placeholder="Search..."
                            fullWidth
                        />
                        {customRecipes && customRecipes.length > 0 && customRecipes.map((recipe) => (
                            <React.Fragment key={recipe.idRecipe}>
                                <div onClick={() => setSelectedRecipe(recipe)} className="choose-recipe-list">
                                    <img
                                        src=
                                        {
                                            recipe.image === null || recipe.image === ""
                                            ? '/custom-recipe.svg'
                                            : 'Uploads/' + recipe.image
                                        }
                                        alt={recipe.title}
                                        style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px', width: 'auto', height: 'auto', borderRadius: '4px' }}
                                    />
                                    <Typography variant="body2">{recipe.title}</Typography>
                                </div>
                                <br />
                                <Divider />
                                <br />
                            </React.Fragment>
                        ))}
                    </Grid>
                    {selectedRecipe.idRecipe > 0 &&
                        <Grid textAlign="center" item lg={6}>
                            <Paper sx={{ width: "100%", height: '100%', padding: '1rem', boxSizing: 'border-box' }} elevation={1}>
                                <Typography variant="h4">
                                    {selectedRecipe.title}
                                </Typography>
                                <img
                                    src=
                                    {
                                        selectedRecipe.image === null || selectedRecipe.image === ""
                                        ? '/custom-recipe.svg'
                                        : 'Uploads/' + selectedRecipe.image
                                    }
                                    alt={selectedRecipe.title}
                                    style={{ maxWidth: '600px', maxHeight: '600px', width: 'auto', height: 'auto', borderRadius: '4px', margin: '2rem 0' }}
                                />
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body1">
                                        <AccessTimeIcon fontSize="small" />&nbsp;{selectedRecipe.readyInMinutes}&nbsp;minutes
                                    </Typography>
                                    <Typography variant="body1">
                                        <ScaleIcon fontSize="small" />&nbsp;{selectedRecipe.weightPerServing}(-s) per serving
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box mt="1rem" display="flex" alignItems="center" justifyContent="center">
                                    <LocalDiningIcon />
                                    <Typography variant="body1">Servings:&nbsp;</Typography>
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
                                        value={selectedRecipe.servings}
                                        onChange={(e) => {
                                            const updatedRecipe = { ...selectedRecipe, servings: Number(e.target.value) };
                                            onRecipeSelect(updatedRecipe);
                                        }}
                                    />
                                </Box>
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
                                <Button onClick={handleAddDishClick} sx={{ mb: "1rem" }} fullWidth variant="contained" endIcon={<AddIcon />}>Add</Button>
                                <Divider />
                                <Typography marginBottom="0.5rem" variant="h5">Ingredients:</Typography>
                                <Grid container spacing={2}>
                                    {selectedRecipe.recipeIngredients.map(ri => (
                                        <Grid item lg={6}>
                                            <Typography variant="body1">
                                                {ri.quantity}&nbsp;{ri.measurementUnitNavigation.name}{ri.idProductNavigation.title}
                                            </Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Divider />
                                <Typography marginBottom="0.5rem" variant="h5">Nutrition facts:</Typography>
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
                                    width={600}
                                    height={100}
                                />
                                <Divider />
                                <Typography marginBottom="0.5rem" variant="h5">Instructions:</Typography>
                                <Typography variant="body1">{selectedRecipe.instructions}</Typography>
                            </Paper>
                        </Grid>
                    }
                </Grid>
            </DialogContent>
        </Dialog>
    )
}