import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    TextField,
    FormControl,
    Select,
    MenuItem,
    OutlinedInput,
    Divider,
    SelectChangeEvent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { RecipeVM } from '../models/recipeModels';

interface RecipeSelectionDialogProps {
    open: boolean;
    handleClose: () => void;
    setFilterText: (text: string) => void;
    mealTypes: string[];
    handleMealChange: (event: SelectChangeEvent<string[]>) => void;
    mealTypeList: string[];
    cuisines: string[];
    handleChange: (event: SelectChangeEvent<string[]>) => void;
    cuisineList: string[];
    recipes: RecipeVM[] | null;
    handleClickOpenRecipeDialog: (recipeId: number) => void;
}

function RecipeSearchList({
    open,
    handleClose,
    setFilterText,
    mealTypes,
    handleMealChange,
    mealTypeList,
    cuisines,
    handleChange,
    cuisineList,
    recipes,
    handleClickOpenRecipeDialog
}: RecipeSelectionDialogProps) {
    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogTitle sx={{ m: 0, p: 2, bgcolor: "#4285F4", color: 'white' }} id="customized-dialog-title">
                Choose a recipe
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <TextField
                    InputProps={{
                        startAdornment: (
                            <SearchIcon style={{ color: 'gray' }} />
                        ),
                    }}
                    sx={{ textAlign: 'center' }}
                    onChange={(e) => (setFilterText(e.target.value))}
                    id="standard-basic"
                    variant="standard"
                    placeholder="Search..."
                    fullWidth
                />
                <FormControl size="small" sx={{ width: 270, mt: 1 }}>
                    <Select
                        multiple
                        displayEmpty
                        value={mealTypes}
                        onChange={handleMealChange}
                        input={<OutlinedInput />}
                        renderValue={(selected) => {
                            if (selected.length === 0) {
                                return <em>Select meal type</em>;
                            }

                            return selected.join(', ');
                        }}
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ bgcolor: 'white' }}
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
                &nbsp;
                <FormControl size="small" sx={{ width: 270, mt: 1, mb: 2 }}>
                    <Select
                        multiple
                        displayEmpty
                        value={cuisines}
                        onChange={handleChange}
                        input={<OutlinedInput />}
                        renderValue={(selected) => {
                            if (selected.length === 0) {
                                return <em>Select cuisine</em>;
                            }

                            return selected.join(', ');
                        }}
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ bgcolor: 'white' }}
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
                {recipes && recipes.length > 0 && recipes.map((recipe) => (
                    <React.Fragment key={recipe.id}>
                        <div onClick={() => handleClickOpenRecipeDialog(recipe.id)} className="choose-recipe-list">
                            <img
                                src={recipe.image}
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
            </DialogContent>
        </Dialog>
    );
}

export default RecipeSearchList;
