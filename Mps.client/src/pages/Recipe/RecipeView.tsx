import { RecipeVM } from "../../models/recipeModels";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import TimerIcon from '@mui/icons-material/Timer';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import axios from "axios";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Fade, Grid, Paper } from "@mui/material";
export default function RecipeView() {
    const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
    const query = useParams();
    const requestUrl = `https://api.spoonacular.com/recipes/${query.id}/information?apiKey=${apiKey}&includeNutrition=true`;
    const similarRecipesUrl = `https://api.spoonacular.com/recipes/${query.id}/similar?apiKey=${apiKey}&number=10`;

    const [recipe, setRecipe] = useState<RecipeVM>();
    const [recipes, setRecipes] = useState<RecipeVM[]>([]);
    const [openProgress, setOpenProgress] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(requestUrl)
            .then((res) => {
                setOpenProgress(false);
                if (res.status === 200)
                    setRecipe(res.data);
                else {
                    console.error(res.statusText);
                }
            }
            )
            .catch((error) => {
                console.error('Error making API request:', error);
                setOpenProgress(false)
            })

        axios
            .get(similarRecipesUrl)
            .then((res) => {
                setOpenProgress(false);
                if (res.status === 200)
                    setRecipes(res.data);
                else {
                    console.error(res.statusText);
                }
            }
            )
            .catch((error) => {
                console.error('Error making API request:', error);
                setOpenProgress(false)
            })
    }, [requestUrl, similarRecipesUrl])

    return (
        <>
            {
                recipe && recipes
                    ?
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '6rem', width: 'auto', flexDirection: "column" }}>
                        <Card id="selection-card" sx={{ boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px', width: '1200px' }}>
                            <CardHeader
                                sx={{ textAlign: 'center' }}
                                title={recipe?.title}
                            />
                            <CardContent>
                                <Grid container spacing={5}>
                                    <Grid item lg={6}>
                                        <img style={{ borderRadius: '16px', objectFit: 'cover', width: '100%', height: '100%', maxWidth: '650px', maxHeight: '300px', minHeight: '300px' }} src={recipe?.image} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography fontWeight="bold" variant="body2" style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                                                <TimerIcon />
                                                Ready in:&nbsp;{recipe?.readyInMinutes}&nbsp;minutes
                                            </Typography>
                                            <Typography fontWeight="bold" variant="body2" style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                                                <LocalDiningIcon />
                                                Servings:&nbsp;{recipe?.servings}
                                            </Typography>
                                        </div>
                                        <hr />
                                        <Typography variant="h5">Instructions:</Typography>
                                        <ol style={{ textAlign: 'left', fontWeight: '400', fontSize: '0.875rem', lineHeight: '1.43', fontFamily: 'Roboto' }}>
                                            {recipe?.analyzedInstructions[0].steps.map((step) => (
                                                <li key={step.number}><Typography variant="body2">{step.step}</Typography></li>
                                            ))}
                                        </ol>
                                    </Grid>
                                    <Grid item lg={6}>
                                        <Typography marginBottom="0.5rem" variant="h5">Ingredients:</Typography>
                                        <Grid spacing={2} container>
                                            {recipe?.extendedIngredients.map((ingredient) => (
                                                <Grid item md={6}><Typography component="li" variant="body2">{ingredient.name}:&nbsp;{ingredient.amount}&nbsp;{ingredient.unit}</Typography></Grid>
                                            ))}
                                        </Grid>
                                        <hr />
                                        <Typography variant="h5">Nutrition Facts:</Typography>
                                        <div style={{ display: "grid", gridTemplateColumns: '1fr 1fr 1fr' }}>
                                            {recipe?.nutrition.nutrients.map((nutrient) => (
                                                <Typography component="li" key={nutrient.name} variant="body2" style={{ margin: '0.5rem 0' }}>{nutrient.name}:&nbsp;{nutrient.amount}&nbsp;{nutrient.unit}</Typography>
                                            ))}
                                        </div>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Typography margin="2rem 0" fontWeight="bold" variant="h5">Similar recipes:</Typography>
                        <Grid width="1200px" container spacing={3}>
                            {
                                recipes.map((r) => (
                                    <Fade key={r.idRecipe} in>
                                        <Grid item lg={3}>
                                            <Paper
                                                onClick={() => navigate("/recipe/" + r.id)}
                                                key={r.idRecipe}
                                                className="similar-recipe-paper"
                                                sx={{
                                                    padding: '1rem',
                                                    borderRadius: '16px',
                                                    maxWidth: '300px',
                                                    height: "200px",
                                                    boxShadow:
                                                        "0 0 2px 0 rgba(145 158 171 / 0.2),0 12px 24px -4px rgba(145 158 171 / 0.12)",
                                                }}
                                                elevation={4}
                                            >
                                                <Typography fontWeight="bold" variant="h6">{r.title}</Typography>
                                                <img
                                                    style={{ borderRadius: '16px', objectFit: 'cover', width: '100%', height: '100%', maxHeight: '100px', minHeight: '100px' }}
                                                    src={"https://img.spoonacular.com/recipes/" + r.image}
                                                />
                                            </Paper>
                                        </Grid>
                                    </Fade>
                                ))
                            }
                        </Grid>
                    </div>
                    : <Backdrop
                        open={openProgress}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
            }
        </>
    );
}