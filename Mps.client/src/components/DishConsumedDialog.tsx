import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, SvgIcon, Tooltip, Typography } from "@mui/material";
import { NutritionPlanDish } from "../models/nutritionPlanModels";
import { useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
interface DishDialogProps {
    openDishConsumedDialog: boolean;
    handleCloseDishConsumedDialog: () => void;
    dish: NutritionPlanDish;
    handleDishConsumption: (value: number) => void;
    setSelectedConsumedDish: (value: NutritionPlanDish) => void;
}

export default function DishConsumedDialog({
    openDishConsumedDialog,
    handleCloseDishConsumedDialog,
    dish,
    handleDishConsumption,
    setSelectedConsumedDish
}: DishDialogProps) {
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setError(false);
    }, [openDishConsumedDialog]);

    return (
        <Dialog
            open={openDishConsumedDialog}
            onClose={handleCloseDishConsumedDialog}
            PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const formJson = Object.fromEntries((formData as any).entries());
                    const servingsConsumed = Number(formJson.servingsConsumed);
                    if (servingsConsumed > dish.servings) {
                        setError(true);
                    }
                    else if (servingsConsumed < 0) {
                        setError(true);
                    }
                    else {
                        handleDishConsumption(+servingsConsumed.toFixed(2));
                        handleCloseDishConsumedDialog();
                    }
                },
            }}
        >
            <DialogTitle>Dish's consumption</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={() => handleCloseDishConsumedDialog()}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <div style={{ position: 'relative' }}>
                    <Tooltip title={<a href="https://storyset.com/food">Food illustrations by Storyset</a>} placement="top">
                        <IconButton style={{ position: 'absolute', top: 0, right: 0 }}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <img
                        style={{ maxWidth: "525px", maxHeight: "525px", width: "100%", height: '100%', borderRadius: "4px" }}
                        src="/consumption.gif"
                        alt="Eating healthy food"
                    />
                </div>
                <br />
                <Typography variant="body1">Amount eaten:</Typography>
                <Button onClick={() => (setSelectedConsumedDish({ ...dish, servingsConsumed: dish.servings * 0.25 }))} style={{ border: "1px solid #4285F4" }} startIcon={<SvgIcon>
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="black"
                        strokeWidth={1}
                    />
                    <path
                        fill="#ffa500"
                        d="M12 2 A 10 10 0 0 1 12 12 L12 12 Z M12 12 L2 12 A 10 10 0 0 1 12 2 Z"
                    />
                </SvgIcon>} />&nbsp;
                <Button onClick={() => (setSelectedConsumedDish({ ...dish, servingsConsumed: dish.servings * 0.5 }))} style={{ border: "1px solid #4285F4" }} startIcon={<SvgIcon>
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="black"
                        strokeWidth={1}
                    />
                    <path
                        d="M12 2 A 10 10 0 0 0 12 22 Z"
                        fill="#ffa500"
                    />
                </SvgIcon>} />&nbsp;
                <Button onClick={() => (setSelectedConsumedDish({ ...dish, servingsConsumed: dish.servings * 0.75 }))} style={{ border: "1px solid #4285F4" }} startIcon={<SvgIcon>
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke={"black"}
                        strokeWidth={1}
                    />
                    <path
                        d="M11 2 A 10 10 0 0 1 22 12 L12 12 Z"
                        fill="#ffa500"
                    />
                    <path
                        d="M12 2 A 10 10 0 0 1 2 12 L12 12 Z"
                        fill="#ffa500"
                    />
                    <path
                        d="M12 22 A 10 10 0 0 1 12 2 L12 12 Z"
                        fill="#ffa500"
                    />
                </SvgIcon>} />&nbsp;
                <Button onClick={() => (setSelectedConsumedDish({ ...dish, servingsConsumed: dish.servings }))} style={{ border: "1px solid #4285F4" }} startIcon={<SvgIcon>
                    <circle stroke="black" cx="12" cy="12" r="10" fill="#ffa500" />
                </SvgIcon>} />
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Input
                        autoFocus
                        required
                        sx={{
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                appearance: 'none'
                            },
                        }}
                        type="number"
                        margin="dense"
                        id="servingsConsumed"
                        name="servingsConsumed"
                        inputProps={{ style: { textAlign: 'right' } }}
                        style={{ width: "4ch", color: '#FFA500', fontSize: "4rem" }}
                        value={dish.servingsConsumed}
                        error={error}
                        onChange={(e) => { setError(false); setSelectedConsumedDish({ ...dish, servingsConsumed: Number(e.target.value) }) }}
                    />
                    <Typography fontSize="4rem">&nbsp;/&nbsp;</Typography>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Typography fontSize="4rem" style={{ position: 'relative', display: 'inline-block' }}>{dish.servings}&nbsp;servings</Typography>
                        <Tooltip placement="top" title={<Typography variant="body2">Serving's size: {dish.idRecipeNavigation.weightPerServing}</Typography>} style={{ position: 'absolute', top: '-10px', right: '0' }}>
                            <IconButton>
                                <HelpIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Box>
                {
                    error &&
                    <>
                        <br />
                        <Typography variant="h6" color="error">
                            *The consumed amount of the dish cannot be greater<br />than the entire amount of the dish ({dish?.servings}&nbsp;servings).<br />Also it can't be negative.
                        </Typography>
                    </>
                }
            </DialogContent>
            <DialogActions>
                <Button endIcon={<CloseIcon />} onClick={handleCloseDishConsumedDialog}>Cancel</Button>
                <Button endIcon={<DoneIcon />} sx={{ color: '#FFA500' }} type="submit">Update</Button>
            </DialogActions>
        </Dialog>
    )
}