import RecipeCard from '../../components/RecipeCard';
import { RecipeVM } from "../../models/recipeModels";
import { FormControl, Input, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import baseUrl from '../../utils/baseUrl';
import SearchIcon from '@mui/icons-material/Search';
import { AllergenVM } from '../../models/allergenModels';

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

export default function RecipeList() {
    const [filterText, setFilterText] = useState<string>("");
    const [recipes, setRecipes] = useState<RecipeVM[]>([]);
    const [allergens, setAllergens] = useState<AllergenVM[]>([]);
    const [cuisines, setCuisines] = useState<string[]>([]);
    const [mealTypes, setMealTypes] = useState<string[]>([]);
    const [openProgress, setOpenProgress] = useState<boolean>(true);

    const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        axios
            .get(`${baseUrl()}Allergen/Selected`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((res) => {
                if (res.status === 200) {
                    setAllergens(res.data)
                } else {
                    console.error(res.statusText);
                }
            })
            .catch((err) => console.error(err));
    }, [authToken]);

    useEffect(() => {
        const intolerances = allergens.filter(a => a.selected === true).map(a => a.name).join(',');

        axios
            .get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}`
                + `&query=${filterText}`
                + `&intolerances=${intolerances}`
                + `&number=6`
                + `&addRecipeInformation=true`
                + `&addRecipeNutrition=true`
                + (cuisines.length > 0 ? `&cuisine=${cuisines}` : "")
                + (mealTypes.length > 0 ? `&type=${mealTypes}` : "")
            )
            .then((res) => {
                setOpenProgress(false);
                if (res.status === 200)
                    setRecipes(res.data.results)
                else
                    console.error(res.statusText);
            })
            .catch((err) => { console.error(err); setOpenProgress(false); })
    }, [filterText, allergens, apiKey, cuisines, mealTypes])

    const recipeContent =
        <>
            {recipes.length > 0 ?
                <div style={{ display: 'flex', justifyContent: 'center', marginTop:'2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: '20px', rowGap: '20px' }}>
                        {recipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                </div>
                :
                <Typography mt="2rem" sx={{color:'#FFA500'}} variant="h5">No recipes found</Typography>
            }
            <Backdrop
                open={openProgress}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>

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

    return (
        <div style={{ textAlign: 'center' }}>
            <h1 style={{ textAlign: "center", margin:'0' }}>Recipes</h1>
            <FormControl size="small" sx={{ width: 300, mt: 2, mr: 5 }}>
                <Select
                    multiple
                    displayEmpty
                    value={mealTypes}
                    onChange={handleMealChange}
                    input={<Input />}
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <em>Select meal type</em>;
                        }

                        return selected.join(', ');
                    }}
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{ color: 'white' }}
                >
                    <MenuItem disabled value="">
                        <em>Select meal type</em>
                    </MenuItem>
                    {mealTypeList.map((mealType) => (
                        <MenuItem
                            key={mealType}
                            value={mealType}
                        >
                            {mealType}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                InputProps={{
                    startAdornment: (
                        <SearchIcon style={{ color: 'white' }} />
                    ),
                    sx: { color: 'white', mt:'0.85rem' },
                }}
                style={{ textAlign: 'center', width: '25rem' }}
                onChange={(e) => (setFilterText(e.target.value))}
                id="standard-basic"
                variant="standard"
                placeholder="Search..."
            />
            <FormControl size="small" sx={{ width: 300, mt:2, ml:5  }}>
                <Select
                    multiple
                    displayEmpty
                    value={cuisines}
                    onChange={handleChange}
                    input={<Input />}
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <em>Select cuisine</em>;
                        }

                        return selected.join(', ');
                    }}
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{ color: 'white' }}
                >
                    <MenuItem disabled value="">
                        <em>Select cuisine</em>
                    </MenuItem>
                    {cuisineList.map((cuisineSelection) => (
                        <MenuItem
                            key={cuisineSelection}
                            value={cuisineSelection}
                        >
                            {cuisineSelection}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {recipeContent}
        </div>
    );
}
