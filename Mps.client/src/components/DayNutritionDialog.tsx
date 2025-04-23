import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { NutritionPlanDay } from '../models/nutritionPlanModels';
import { getDayCalories, getDayCarbs, getDayConsumedCalories, getDayConsumedCarbs, getDayConsumedFat, getDayConsumedProtein, getDayFat, getDayProtein } from '../utils/nutritionCalculations';
import { PieChart } from '@mui/x-charts/PieChart';

interface DayNutritionDialogProps {
    open: boolean;
    onClose: () => void;
    selectedDay: NutritionPlanDay | undefined; 
}

const DayNutritionDialog: React.FC<DayNutritionDialogProps> = ({
    open,
    onClose,
    selectedDay
}) => {
    return (
        <Dialog maxWidth="xl" onClose={onClose} open={open}>
            <DialogTitle>{selectedDay?.date.toString()}&nbsp;nutrition information</DialogTitle>
            <DialogContent>
                <Typography variant="h6">{getDayCalories({ selectedDay: selectedDay }).toFixed(2)}&nbsp;kcal total</Typography>
                <PieChart
                    colors={["#FFA500", "#4285F4", "black"]}
                    series={[
                        {
                            data: [
                                { id: 0, value: getDayFat({ selectedDay: selectedDay }), label: 'Fats, g' },
                                { id: 1, value: getDayCarbs({ selectedDay: selectedDay }), label: 'Carbs, g' },
                                { id: 2, value: getDayProtein({ selectedDay: selectedDay }), label: 'Protein, g' },
                            ],
                        },
                    ]}
                    width={600}
                    height={200}
                />
                <Divider />
                <Typography variant="h6">{getDayConsumedCalories({ selectedDay: selectedDay }).toFixed(2)}&nbsp;kcal consumed</Typography>
                <PieChart
                    colors={["#008080", "#FF7F50", "#FFD700"]}
                    series={[
                        {
                            data: [
                                { id: 0, value: getDayConsumedFat({ selectedDay: selectedDay }), label: 'Fats consumed, g' },
                                { id: 1, value: getDayConsumedCarbs({ selectedDay: selectedDay }), label: 'Carbs consumed, g' },
                                { id: 2, value: getDayConsumedProtein({ selectedDay: selectedDay }), label: 'Protein consumed, g' },
                            ],
                        },
                    ]}
                    width={600}
                    height={200}
                />
                <Divider />
                <Typography variant="h6">Day's completion</Typography>
                <Gauge
                    width={600}
                    height={200}
                    value={(getDayConsumedCalories({ selectedDay: selectedDay }) / getDayCalories({ selectedDay: selectedDay }) * 100)}
                    text={(getDayConsumedCalories({ selectedDay: selectedDay }) / getDayCalories({ selectedDay: selectedDay }) * 100).toFixed(2) + "%"}
                    cornerRadius="50%"
                    sx={(theme) => ({
                        [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 40,
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: (getDayConsumedCalories({ selectedDay: selectedDay }) / getDayCalories({ selectedDay: selectedDay }) * 100) === 100 ? 'green' : '#FFA500',
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                            fill: theme.palette.text.disabled,
                        },
                    })}
                />
            </DialogContent>
        </Dialog>
    );
};

export default DayNutritionDialog;
