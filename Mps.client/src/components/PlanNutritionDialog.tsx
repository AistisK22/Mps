import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { PieChart } from '@mui/x-charts/PieChart';
import { PlanNutrition, PlanNutritionBar } from '../models/nutritionPlanModels';
import { Box, DialogContent, Fade, Grid, Paper, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { BarChart } from '@mui/x-charts/BarChart';

interface PlanNutritionDialogProps {
    openPlanNutritionDialog: boolean;
    setOpenPlanNutritionDialog: (value: boolean) => void;
    planNutrition: PlanNutrition;
    planNutritionBar: PlanNutritionBar[];
}

const PlanNutritionDialog: React.FC<PlanNutritionDialogProps> = ({ openPlanNutritionDialog, setOpenPlanNutritionDialog, planNutrition, planNutritionBar }) => {
    const valueFormatter = (value: number | null) => `${value} kcal`;
    const dataset = planNutritionBar && planNutritionBar.map(item => ({
        day: item.day,
        calories: item.totalCalories,
        consumedCalories: item.consumedCalories
    }));

    const datasetNutrition = planNutritionBar && planNutritionBar.map(item => ({
        day: item.day,
        fat: item.totalFat,
        consumedFat: item.consumedFat,
        protein: item.totalProtein,
        consumedProtein: item.consumedProtein,
        carbs: item.totalCarbs,
        consumedCarbs: item.consumedCarbs
    }));

    return (
        <Dialog PaperProps={{ style: { backgroundColor: '#4285F4' } }} fullScreen
            onClose={() => setOpenPlanNutritionDialog(false)} open={openPlanNutritionDialog}>
            <DialogTitle>Nutrition plan's information</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={() => setOpenPlanNutritionDialog(false)}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent sx={{ overflowX: 'hidden' }}>
                {planNutrition && dataset.length > 0 && (
                    <Grid rowSpacing={3} columnSpacing={3} container>
                        <Grid item md={12} xl={6}>
                            <Fade in>
                                <Paper sx={{ padding: '1rem' }} elevation={16}>
                                    <Typography variant="h6">{planNutrition.calories.toFixed(2)}&nbsp;kcal total,&nbsp;~{Math.round(planNutrition.calories / 7)}&nbsp;kcal per day</Typography>
                                    <PieChart
                                        colors={["#FFA500", "#4285F4", "black"]}
                                        series={[
                                            {
                                                data: [
                                                    { id: 0, value: planNutrition.fat, label: 'Fats, g' },
                                                    { id: 1, value: planNutrition.carbs, label: 'Carbs, g' },
                                                    { id: 2, value: planNutrition.protein, label: 'Protein, g' },
                                                ],
                                            },
                                        ]}
                                        width={600}
                                        height={200}
                                    />
                                </Paper>
                            </Fade>
                            <Fade in>
                                <Paper sx={{ padding: '1rem', marginTop: '1rem', overflow: 'hidden' }} elevation={16}>
                                    <Typography variant="h6">Weekly nutrition distribution</Typography>
                                    <BarChart
                                        colors={["#FFA500", "#008080", "black", "#FFD700", "#4285F4", "#FF7F50"]}
                                        xAxis={[{ scaleType: 'band', dataKey: 'day' }]}
                                        dataset={datasetNutrition}
                                        width={900}
                                        height={300}
                                        series={[
                                            { dataKey: 'fat', label: 'Total fat', valueFormatter: (value: number | null) => `${value} g` },
                                            { dataKey: 'consumedFat', label: 'Consumed fat', valueFormatter: (value: number | null) => `${value} g` },
                                            { dataKey: 'protein', label: 'Total protein', valueFormatter: (value: number | null) => `${value} g` },
                                            { dataKey: 'consumedProtein', label: 'Consumed protein', valueFormatter: (value: number | null) => `${value} g` },
                                            { dataKey: 'carbs', label: 'Total carbs', valueFormatter: (value: number | null) => `${value} g` },
                                            { dataKey: 'consumedCarbs', label: 'Consumed carbs', valueFormatter: (value: number | null) => `${value} g` }
                                        ]}
                                    />
                                </Paper>
                            </Fade>
                        </Grid>
                        <Grid item md={12} xl={6}>
                            <Fade in>
                                <Paper sx={{ padding: '1rem' }} elevation={16}>
                                    <Typography variant="h6">{planNutrition.consumedCalories.toFixed(2)}&nbsp;kcal consumed</Typography>
                                    <PieChart
                                        colors={["#008080", "#FF7F50", "#FFD700"]}
                                        series={[
                                            {
                                                data: [
                                                    { id: 0, value: planNutrition.consumedFat, label: 'Fats consumed, g' },
                                                    { id: 1, value: planNutrition.consumedCarbs, label: 'Carbs consumed, g' },
                                                    { id: 2, value: planNutrition.consumedProtein, label: 'Protein consumed, g' },
                                                ],
                                            },
                                        ]}
                                        width={600}
                                        height={200}
                                    />
                                </Paper>
                            </Fade>
                            <Fade in>
                                <Paper sx={{ padding: '1rem', marginTop: '1rem', overflow: 'hidden' }} elevation={16}>
                                    <Typography variant="h6">Weekly calorie distribution</Typography>
                                    <BarChart
                                        colors={["#800000", "#FFD700"]}
                                        xAxis={[{ scaleType: 'band', dataKey: 'day' }]}
                                        dataset={dataset}
                                        width={900}
                                        height={300}
                                        series={[
                                            { dataKey: 'calories', label: 'Total calories', valueFormatter },
                                            { dataKey: 'consumedCalories', label: 'Consumed calories', valueFormatter }
                                        ]}
                                    />
                                </Paper>
                            </Fade>
                        </Grid>
                        <Grid item lg={12} xl={12} md={12}>
                            <Fade in>
                                <Paper sx={{ padding: '1rem' }} elevation={16}>
                                    <Typography variant="h6">Plan's completion</Typography>
                                    <Box display="flex" justifyContent="center">
                                        <Gauge
                                            width={600}
                                            height={200}
                                            value={(planNutrition.consumedCalories / planNutrition.calories * 100)}
                                            text={(planNutrition.consumedCalories / planNutrition.calories * 100).toFixed(2) + "%"}
                                            cornerRadius="50%"
                                            sx={(theme) => ({
                                                [`& .${gaugeClasses.valueText}`]: {
                                                    fontSize: 40,
                                                },
                                                [`& .${gaugeClasses.valueArc}`]: {
                                                    fill: '#FFA500',
                                                },
                                                [`& .${gaugeClasses.referenceArc}`]: {
                                                    fill: theme.palette.text.disabled,
                                                },
                                            })}
                                        />
                                    </Box>
                                </Paper>
                            </Fade>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PlanNutritionDialog;
