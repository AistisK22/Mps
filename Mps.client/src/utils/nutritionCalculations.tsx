import { Ingredient } from "../models/customRecipeModels";
import { NutritionPlanDay } from "../models/nutritionPlanModels";

export const getDayCalories = ({ selectedDay }: { selectedDay: NutritionPlanDay | undefined }) => {
    let totalCalories = 0;
    if (selectedDay) {
        for (const dish of selectedDay.nutritionPlanDishes) {
            for (const recipeIngredient of dish.idRecipeNavigation.recipeIngredients) {
                totalCalories += recipeIngredient.idProductNavigation.calories;
            }
        }
    }
    return totalCalories;
}

export const getDayProtein = ({ selectedDay }: { selectedDay: NutritionPlanDay | undefined }) => {
    let totalProtein = 0;
    if (selectedDay) {
        for (const dish of selectedDay.nutritionPlanDishes) {
            for (const recipeIngredient of dish.idRecipeNavigation.recipeIngredients) {
                totalProtein += recipeIngredient.idProductNavigation.protein;
            }
        }
    }
    return totalProtein;
}

export const getDayFat = ({ selectedDay }: { selectedDay: NutritionPlanDay | undefined }) => {
    let totalFat = 0;
    if (selectedDay) {
        for (const dish of selectedDay.nutritionPlanDishes) {
            for (const recipeIngredient of dish.idRecipeNavigation.recipeIngredients) {
                totalFat += recipeIngredient.idProductNavigation.fat;
            }
        }
    }
    return totalFat;
}

export const getDayCarbs = ({ selectedDay }: { selectedDay: NutritionPlanDay | undefined }) => {
    let totalCarbs = 0;
    if (selectedDay) {
        for (const dish of selectedDay.nutritionPlanDishes) {
            for (const recipeIngredient of dish.idRecipeNavigation.recipeIngredients) {
                totalCarbs += recipeIngredient.idProductNavigation.carbs;
            }
        }
    }
    return totalCarbs;
}

export const getDayConsumedCalories = ({ selectedDay }: { selectedDay: NutritionPlanDay | undefined }) => {
    let totalCalories = 0;
    if (selectedDay) {
        for (const dish of selectedDay.nutritionPlanDishes) {
            for (const recipeIngredient of dish.idRecipeNavigation.recipeIngredients) {
                totalCalories += recipeIngredient.idProductNavigation.calories * dish.servingsConsumed / dish.servings;
            }
        }
    }
    return totalCalories;
}

export const getDayConsumedProtein = ({ selectedDay }: { selectedDay: NutritionPlanDay | undefined }) => {
    let totalProtein = 0;
    if (selectedDay) {
        for (const dish of selectedDay.nutritionPlanDishes) {
            for (const recipeIngredient of dish.idRecipeNavigation.recipeIngredients) {
                totalProtein += recipeIngredient.idProductNavigation.protein * dish.servingsConsumed / dish.servings;
            }
        }
    }
    return totalProtein;
}

export const getDayConsumedFat = ({ selectedDay }: { selectedDay: NutritionPlanDay | undefined }) => {
    let totalFat = 0;
    if (selectedDay) {
        for (const dish of selectedDay.nutritionPlanDishes) {
            for (const recipeIngredient of dish.idRecipeNavigation.recipeIngredients) {
                totalFat += recipeIngredient.idProductNavigation.fat * dish.servingsConsumed / dish.servings;
            }
        }
    }
    return totalFat;
}

export const getDayConsumedCarbs = ({ selectedDay }: { selectedDay: NutritionPlanDay | undefined }) => {
    let totalCarbs = 0;
    if (selectedDay) {
        for (const dish of selectedDay.nutritionPlanDishes) {
            for (const recipeIngredient of dish.idRecipeNavigation.recipeIngredients) {
                totalCarbs += recipeIngredient.idProductNavigation.carbs * dish.servingsConsumed / dish.servings;
            }
        }
    }
    return totalCarbs;
}

export const getCustomRecipeCalories = (recipeIngredients: Ingredient[]) => {
    return recipeIngredients.reduce((acc, current) => {
        return acc + current.idProductNavigation.calories;
    }, 0)
}

export const getCustomRecipeProtein = (recipeIngredients: Ingredient[]) => {
    return recipeIngredients.reduce((acc, current) => {
        return acc + current.idProductNavigation.protein;
    }, 0)
}

export const getCustomRecipeFat = (recipeIngredients: Ingredient[]) => {
    return recipeIngredients.reduce((acc, current) => {
        return acc + current.idProductNavigation.fat;
    }, 0)
}

export const getCustomRecipeCarbs = (recipeIngredients: Ingredient[]) => {
    return recipeIngredients.reduce((acc, current) => {
        return acc + current.idProductNavigation.carbs;
    }, 0)
}