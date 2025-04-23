import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, Grid, Typography } from "@mui/material";
import { NutritionPlanDish } from "../models/nutritionPlanModels";
import { PieChart } from "@mui/x-charts/PieChart";
import ArticleIcon from '@mui/icons-material/Article';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { styled } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import getMeasurementUnit from "../utils/measurementUnitConverter";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FeedIcon from '@mui/icons-material/Feed';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ScaleIcon from '@mui/icons-material/Scale';
interface Props {
    dishViewDialog: boolean;
    selectedDish: NutritionPlanDish | null;
    setDishViewDialog: (isOpen: boolean) => void;
    handleDetailedDishInfoClick: (id: number) => void;
}

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

export default function DishViewDialog({
    dishViewDialog,
    selectedDish,
    setDishViewDialog,
    handleDetailedDishInfoClick }
    : Props) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleExpand = () => {
        setExpanded(!expanded);
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <Dialog onClose={() => setDishViewDialog(false)} open={dishViewDialog}>
            {selectedDish &&
                <>
                <DialogTitle><b>{selectedDish.idRecipeNavigation.title}</b></DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => setDishViewDialog(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent>
                        <img src={selectedDish.idRecipeNavigation.image}
                        style={{
                            marginBottom: '1rem',
                                objectFit: 'cover',
                                width: "100%",
                                height: 'auto',
                                maxWidth: '800px',
                                minWidth: '500px',
                                borderRadius: '4px',
                                boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px'
                            }}
                        />
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><FeedIcon /></TableCell>
                                        <TableCell>Servings</TableCell>
                                        <TableCell>Calories</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>Total</TableCell>
                                        <TableCell>{selectedDish.servings}</TableCell>
                                        <TableCell>
                                            {selectedDish.idRecipeNavigation.recipeIngredients.reduce((acc, ingredient) => {
                                                return acc + ingredient.idProductNavigation.calories;
                                            }, 0).toFixed(2)}&nbsp;kcal
                                        </TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>Consumed</TableCell>
                                        <TableCell>{selectedDish.servingsConsumed}</TableCell>
                                        <TableCell>
                                            {selectedDish.idRecipeNavigation.recipeIngredients.reduce((acc, ingredient) => {
                                                return acc + (ingredient.idProductNavigation.calories * selectedDish.servingsConsumed / selectedDish.servings);
                                            }, 0).toFixed(2)}&nbsp;kcal
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <br />
                        <Grid container>
                            <Grid item lg={12}>
                                <PieChart
                                    colors={["#FFA500", "#4285F4", "black"]}
                                    series={[
                                        {
                                            data: [
                                                {
                                                    id: 0, value: selectedDish.idRecipeNavigation.recipeIngredients.reduce((acc, ingredient) => {
                                                        return acc + ingredient.idProductNavigation.fat;
                                                    }, 0), label: 'Fats, g'
                                                },
                                                {
                                                    id: 1, value: selectedDish.idRecipeNavigation.recipeIngredients.reduce((acc, ingredient) => {
                                                        return acc + ingredient.idProductNavigation.carbs;
                                                    }, 0), label: 'Carbs, g'
                                                },
                                                {
                                                    id: 2, value: selectedDish.idRecipeNavigation.recipeIngredients.reduce((acc, ingredient) => {
                                                        return acc + ingredient.idProductNavigation.protein;
                                                    }, 0), label: 'Protein, g'
                                                },
                                            ],
                                        },
                                    ]}
                                    width={450}
                                    height={100}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Accordion expanded={expanded} onChange={handleExpand}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="summary-content"
                                id="summary-header"
                            >
                                <Typography variant="body1">Summary</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: selectedDish.idRecipeNavigation.summary }} />
                                <br />
                                <Box display="flex" alignItems="center">
                                    <ScaleIcon />&nbsp;<Typography variant="body2">Serving's size:&nbsp;{selectedDish.idRecipeNavigation.weightPerServing}</Typography>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleDrawer} startIcon={<ArticleIcon />}>Detailed information</Button>
                    </DialogActions>
                    <Drawer sx={{ zIndex: '9999' }} anchor="right" open={drawerOpen} onClose={toggleDrawer}>
                        <DrawerHeader>
                            <IconButton onClick={toggleDrawer}>
                                <ChevronRightIcon />
                            </IconButton>
                        </DrawerHeader>
                        <Box maxWidth="600px" p="1.5rem" borderRadius="4px">
                            <Typography mb="1rem" variant="h5">
                                Dish's ingredients
                            </Typography>
                            {selectedDish.idRecipeNavigation.recipeIngredients.map((ri) => (
                                <SimpleTreeView key={ri.idRecipeIngredient}>
                                    <TreeItem itemId="grid" label={ri.idProductNavigation.title + ' - ' + (ri.quantity * selectedDish.servings).toFixed(2) + ' ' + getMeasurementUnit(ri.measurementUnit)}>
                                        <TreeItem itemId="grid-calories" label={'Calories - ' + ri.idProductNavigation.calories + ' kcal'} />
                                        <TreeItem itemId="grid-fat" label={'Fat - ' + ri.idProductNavigation.fat + ' g'} />
                                        <TreeItem itemId="grid-protein" label={'Protein - ' + ri.idProductNavigation.protein + ' g'} />
                                        <TreeItem itemId="grid-carbs" label={'Carbs - ' + ri.idProductNavigation.carbs + ' g'} />
                                    </TreeItem>
                                </SimpleTreeView>
                            ))}
                            <br />
                            <Typography mb="1rem" variant="h5">
                                Recipe's instructions
                            </Typography>
                            <ol>
                            {
                                selectedDish.idRecipeNavigation.instructions?.length > 0
                                ?
                                selectedDish.idRecipeNavigation.instructions.split('.').map(i => {
                                    return i && (<Typography component="li">{i}</Typography>)
                                })
                                : <Typography>No instructions provided</Typography>
                            }
                            </ol>
                            <Button sx={{ mt: '1rem' }} onClick={() => handleDetailedDishInfoClick(selectedDish.idRecipeNavigation.spoonacularId)} startIcon={<ArticleIcon />}>More information</Button>
                        </Box>
                    </Drawer>
                </>
            }
        </Dialog>
    )
}