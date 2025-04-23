import { Box, Button, Card, CardContent, CardHeader, Fade, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import baseUrl from "../../utils/baseUrl";
import { UnitVM } from "../../models/unitModels";
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router';
import { CustomRecipe, Ingredient } from "../../models/customRecipeModels";

interface FileWithPreview extends File {
    preview: string;
}

export default function CustomRecipeView() {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [units, setUnits] = useState<UnitVM[]>([]);
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const [recipe, setRecipe] = useState<CustomRecipe>(new CustomRecipe({ recipeIngredients: [new Ingredient()] }));
    const authToken = localStorage.getItem('authToken');
    const navigate = useNavigate();
    const { id } = useParams();

    const thumbs = files.length > 0 ? files.map(file => (
        <div key={file.name}>
            <div>
                <img
                    className="thumbnail"
                    src={file.preview}
                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                />
            </div>
        </div>
    )) : "";

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    useEffect(() => {
        axios
            .get(`${baseUrl()}Unit`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then((res) => {
                if (res.status === 200)
                {
                    setUnits(res.data)
                }
                else
                    console.error(res.statusText);
            })
            .catch(err => console.error(err));

        if (id) {
            axios
                .get(`${baseUrl()}Recipes/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                })
                .then((res) => {
                    if (res.status === 200)
                        setRecipe(res.data)
                    else
                        console.error(res.statusText);
                })
                .catch(err => console.error(err));
        }
    }, [authToken, id, needRefresh]);

    const onAddInput = () => {
        setRecipe(prevRecipe => ({
            ...prevRecipe,
            recipeIngredients: [...prevRecipe.recipeIngredients, new Ingredient()]
        }));
    };

    const onDeleteInput = (index: number) => {
        if (recipe.recipeIngredients.length > 1) {
            setRecipe(prevRecipe => ({
                ...prevRecipe,
                recipeIngredients: prevRecipe.recipeIngredients.filter((_input, i) => i !== index)
            }));
        } else {
            toast.warning("Recipe must have at least one ingredient");
        }
    };

    const onCreateClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        recipe.recipeIngredients.forEach((ingredient, index) => {
            const mu = {
                idMeasurementUnits: ingredient.measurementUnit,
                name: "sdfds"
            };

            const pr = {
                calories: ingredient.idProductNavigation.calories,
                fat: ingredient.idProductNavigation.fat,
                carbs: ingredient.idProductNavigation.carbs,
                protein: ingredient.idProductNavigation.protein,
                title: ingredient.idProductNavigation.title
            };

            const r = {
                title: recipe.title,
                image: files.length > 0 ? files[0].name : recipe.image,
                summary: recipe.summary
            };

            formData.append(`recipeIngredients[${index}].IdRecipeIngredient`, String(ingredient.idRecipeIngredient));
            formData.append(`recipeIngredients[${index}].Quantity`, String(ingredient.quantity));
            formData.append(`recipeIngredients[${index}].MeasurementUnit`, String(ingredient.measurementUnit));
            formData.append(`recipeIngredients[${index}].IdProduct`, String(ingredient.idProduct));
            formData.append(`recipeIngredients[${index}].IdRecipe`, String(ingredient.idRecipe));
            formData.append(`recipeIngredients[${index}].IdProductNavigation.calories`, String(pr.calories));
            formData.append(`recipeIngredients[${index}].IdProductNavigation.fat`, String(pr.fat));
            formData.append(`recipeIngredients[${index}].IdProductNavigation.carbs`, String(pr.carbs));
            formData.append(`recipeIngredients[${index}].IdProductNavigation.protein`, String(pr.protein));
            formData.append(`recipeIngredients[${index}].IdProductNavigation.title`, pr.title);
            formData.append(`recipeIngredients[${index}].IdRecipeNavigation.title`, r.title);
            formData.append(`recipeIngredients[${index}].IdRecipeNavigation.image`, r.image);
            formData.append(`recipeIngredients[${index}].IdRecipeNavigation.summary`, r.summary);
            formData.append(`recipeIngredients[${index}].MeasurementUnitNavigation.idMeasurementUnits`, String(mu.idMeasurementUnits));
            formData.append(`recipeIngredients[${index}].MeasurementUnitNavigation.name`, mu.name);
        });
        if (files.length > 0) {
            formData.append("imageFile", files[0]);
        }
        formData.append("image", files.length > 0 ? files[0].name : recipe.image);
        formData.append("instructions", recipe.instructions);
        formData.set("weightPerServing", String(formData.get('weightPerServing')) + " " + String(formData.get('unit')));
        if (recipe.idRecipe > 0) {
            axios
                .put(`${baseUrl()}Recipes/${recipe.idRecipe}`, formData
                    , { headers: {'Authorization': `Bearer ${authToken}`, 'Content-Type': 'multipart/form-data' } })
                .then((resp) => {
                    if (resp.status === 200) {
                        setNeedRefresh(true);
                        navigate("/CustomRecipes");
                        toast.success("Custom recipe was succesfully updated");
                    }
                    else {
                        toast.error("Error:" + resp.statusText);
                    }
                })
                .catch((err) => (console.error(err)));
        }
        else {
            axios
                .post(`${baseUrl()}Recipes`, formData
                    , { headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'multipart/form-data' } })
                .then((resp) => {
                    if (resp.status === 200) {
                        setNeedRefresh(true);
                        navigate("/CustomRecipes");
                        toast.success("Custom recipe was succesfully created");
                    }
                    else {
                        toast.error("Error:" + resp.statusText);
                    }
                })
                .catch((err) => (console.error(err)));
        }
    }

    return (
        <Fade in>
            <Box component="form" onSubmit={onCreateClick}>
                <ToastContainer />
                <Box display="flex" justifyContent="space-between" marginTop='2rem' gap="6rem">
                    <Card sx={{ width: '100%', borderRadius: '16px' }}>
                        <CardHeader title="Custom recipe creation" />
                        <CardContent>
                            <InputLabel id="image-label">Dish's image</InputLabel>
                            <section className="container">
                                <div  {...getRootProps({ className: 'dropzone dropzone-border' })}>
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                </div>
                                <aside>
                                    {thumbs}
                                    {
                                        files.length === 0 && recipe.image !== ""
                                            ? <img className="thumbnail"
                                                src=
                                                {
                                                    recipe.image === null || recipe.image === ""
                                                        ? '/custom-recipe.svg'
                                                        : '/Uploads/' + recipe.image
                                                }
                                            />
                                            : <></>
                                    }
                                </aside>
                            </section>
                            <TextField
                                margin="dense"
                                autoFocus
                                required
                                id="title"
                                name="title"
                                label="Title"
                                type="text"
                                fullWidth
                                variant="standard"
                                inputProps={{ maxLength: "100" }}
                                value={recipe.title}
                                onChange={(e) => setRecipe(recipe => ({ ...recipe, title: e.target.value }))}
                            />
                            <TextField
                                margin="dense"
                                required
                                id="summary"
                                name="summary"
                                label="Summary"
                                type="text"
                                fullWidth
                                multiline
                                variant="standard"
                                inputProps={{ maxLength: "100" }}
                                value={recipe.summary}
                                onChange={(e) => setRecipe(recipe => ({ ...recipe, summary: e.target.value }))}
                            />
                            <TextField
                                sx={{ width: '9rem', mr: "2rem" }}
                                margin="dense"
                                required
                                id="readyInMinutes"
                                name="readyInMinutes"
                                label="Ready in minutes"
                                type="number"
                                variant="standard"
                                inputProps={{ min: 0, max: 999 }}
                                value={recipe.readyInMinutes}
                                onChange={(e) => setRecipe(recipe => ({ ...recipe, readyInMinutes: Number(e.target.value) }))}
                            />
                            {
                                recipe.idRecipe <= 0 &&
                                <>
                                    <TextField
                                        sx={{ width: '10rem' }}
                                        margin="dense"
                                        required
                                        id="weightPerServing"
                                        name="weightPerServing"
                                        label="Weight per serving"
                                        type="number"
                                        variant="standard"
                                        inputProps={{ min: 0, max: 9999 }}
                                    />
                                    <FormControl sx={{ maxWidth: '120px', mt: '1.5rem' }} margin="dense">
                                        {units.length > 0 && (
                                            <Select
                                                labelId="unit-label"
                                                id="unit"
                                                variant="standard"
                                                name="unit"
                                                defaultValue=
                                                {units[3].name}
                                            >
                                                {units.filter(unit => unit.idMeasurementUnits == 2 || unit.idMeasurementUnits == 3).map((unit) => (
                                                    <MenuItem key={unit.idMeasurementUnits} value={unit.name}>{unit.name}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </FormControl>
                                </>
                            }
                            <TextField
                                margin="dense"
                                id="instructions"
                                name="instructions"
                                label="Instructions"
                                type="text"
                                fullWidth
                                multiline
                                variant="standard"
                                inputProps={{ maxLength: "100" }}
                                value={recipe.instructions}
                                onChange={(e) => setRecipe(recipe => ({ ...recipe, instructions: e.target.value }))}
                            />
                        </CardContent>
                    </Card>
                    <Card sx={{ width: '100%', borderRadius:'16px' }}>
                        <CardHeader title="Recipe's ingredients" />
                        <CardContent>
                            {recipe.recipeIngredients.map((input, index) => (
                                <div key={index} style={{ marginBottom: '1rem' }}>
                                    <TextField
                                        margin="dense"
                                        required
                                        id={`ingredientTitle${index}`}
                                        label="Title"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        value={input.idProductNavigation.title}
                                        inputProps={{ maxLength: "100" }}
                                        onChange={(e) => {
                                            const newIngredients = [...recipe.recipeIngredients];
                                            newIngredients[index].idProductNavigation.title = e.target.value;
                                            setRecipe({ ...recipe, recipeIngredients: newIngredients });
                                        }}
                                    />
                                    <TextField
                                        sx={{ width: '10rem' }}
                                        margin="dense"
                                        required
                                        id={`quantity${index}`}
                                        value={input.quantity}
                                        label="Quantity"
                                        type="number"
                                        variant="standard"
                                        inputProps={{ min: 0, max: 9999 }}
                                        onChange={(e) => {
                                            const newIngredients = [...recipe.recipeIngredients];
                                            newIngredients[index].quantity = Number(e.target.value);
                                            setRecipe({ ...recipe, recipeIngredients: newIngredients });
                                        }}
                                    />
                                    <FormControl sx={{ maxWidth: '120px', marginRight: '3rem', mt: "1.5rem" }} margin="dense">
                                        {units.length > 0 && (
                                            <Select
                                                labelId={`unit-label-${index}`}
                                                id={`unit${index}`}
                                                variant="standard"
                                                value={input.measurementUnit}
                                                onChange={(e) => {
                                                    const newIngredients = [...recipe.recipeIngredients];
                                                    newIngredients[index].measurementUnit = Number(e.target.value);
                                                    setRecipe({ ...recipe, recipeIngredients: newIngredients });
                                                }}
                                            >
                                                {units.map((unit) => (
                                                    <MenuItem key={unit.idMeasurementUnits} value={unit.idMeasurementUnits}>{unit.name}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </FormControl>
                                    <TextField
                                        margin="dense"
                                        required
                                        id={`calories${index}`}
                                        label="Calories, kcal"
                                        type="number"
                                        variant="standard"
                                        sx={{
                                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                                appearance: 'none'
                                            },
                                            maxWidth: "120px",
                                            marginRight: "1rem"
                                        }}
                                        inputProps={{ min: '1' }}
                                        value={input.idProductNavigation.calories}
                                        onChange={(e) => {
                                            const newIngredients = [...recipe.recipeIngredients];
                                            newIngredients[index].idProductNavigation.calories = Number(e.target.value);
                                            setRecipe({ ...recipe, recipeIngredients: newIngredients });
                                        }}
                                    />
                                    <TextField
                                        margin="dense"
                                        required
                                        id={`carbs${index}`}
                                        label="Carbs, g"
                                        type="number"
                                        variant="standard"
                                        sx={{
                                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                                appearance: 'none'
                                            },
                                            maxWidth: "100px",
                                            marginRight: "1rem"
                                        }}
                                        inputProps={{ min: '1' }}
                                        value={input.idProductNavigation.carbs}
                                        onChange={(e) => {
                                            const newIngredients = [...recipe.recipeIngredients];
                                            newIngredients[index].idProductNavigation.carbs = Number(e.target.value);
                                            setRecipe({ ...recipe, recipeIngredients: newIngredients });
                                        }}
                                    />
                                    <TextField
                                        margin="dense"
                                        required
                                        id={`fat${index}`}
                                        label="Fat, g"
                                        type="number"
                                        variant="standard"
                                        sx={{
                                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                                appearance: 'none'
                                            },
                                            maxWidth: "100px",
                                            marginRight: "1rem"
                                        }}
                                        inputProps={{ min: '1' }}
                                        value={input.idProductNavigation.fat}
                                        onChange={(e) => {
                                            const newIngredients = [...recipe.recipeIngredients];
                                            newIngredients[index].idProductNavigation.fat = Number(e.target.value);
                                            setRecipe({ ...recipe, recipeIngredients: newIngredients });
                                        }}
                                    />
                                    <TextField
                                        margin="dense"
                                        required
                                        id={`protein${index}`}
                                        label="Protein, g"
                                        type="number"
                                        variant="standard"
                                        sx={{
                                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                                appearance: 'none'
                                            },
                                            maxWidth: "100px",
                                            marginRight: "6rem"
                                        }}
                                        inputProps={{ min: '1' }}
                                        value={input.idProductNavigation.protein}
                                        onChange={(e) => {
                                            const newIngredients = [...recipe.recipeIngredients];
                                            newIngredients[index].idProductNavigation.protein = Number(e.target.value);
                                            setRecipe({ ...recipe, recipeIngredients: newIngredients });
                                        }}
                                    />
                                    <IconButton onClick={() => onDeleteInput(index)}>
                                        <CloseIcon color="error" />
                                    </IconButton>
                                </div>
                            ))}
                            <br />
                            <Button onClick={onAddInput} endIcon={<AddIcon />} variant="contained">Add More</Button>
                        </CardContent>
                    </Card>
                </Box>
                <Box display="flex" justifyContent="center" marginTop='2rem'>
                    <Button type="submit" size="large" endIcon={<DoneIcon />} variant="contained">{recipe.idRecipe > 0 ? "Update" : "Create"}</Button>
                </Box>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon fontSize="large" />
                </IconButton>
            </Box>
        </Fade>
    )
}
