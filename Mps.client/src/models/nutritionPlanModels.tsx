import { ProductVM } from "./productModels";
export interface DishType {
    idDishTypes: number;
    name: string;
}

export class NutritionPlan {
    idNutritionPlan: number = 0;
    startDate: Date = new Date();
    endDate: Date = new Date();
    title: string = "";
    description: string = "";
    nutritionPlanDays: NutritionPlanDay[] = [];
}

export class NutritionPlanDay {
    idNutritionPlanDay: number = 0;
    date: Date = new Date();
    nutritionPlanDishes: NutritionPlanDish[] = [];
}

export class NutritionPlanDish {
    idNutritionPlanDish: number = 0;
    servings: number = 0;
    servingsConsumed: number = 0;
    dishType: number = 0;
    idRecipeNavigation: Recipe = new Recipe(); 
}

export class Recipe {
    idRecipe: number = 0;
    title: string = "";
    summary: string = "";
    readyInMinutes: number = 0;
    image: string = "";
    spoonacularId: number = 0;
    instructions: string = "";
    weightPerServing: string = "";
    recipeIngredients: RecipeIngredient[] = [];
}

export class RecipeIngredient {
    idRecipeIngredient: number = 0;
    quantity: number = 0;
    measurementUnit: number = 0;
    idProductNavigation: ProductVM = new ProductVM();
    idRecipeNavigation: Recipe = new Recipe();
}

export class PlanNutrition {
    calories: number = 0;
    consumedCalories: number = 0;
    fat: number = 0;
    consumedFat: number = 0;
    protein: number = 0;
    consumedProtein: number = 0;
    carbs: number = 0;
    consumedCarbs: number = 0;
}

export class PlanNutritionBar {
    day: Date = new Date();
    totalCalories: number = 0;
    consumedCalories: number = 0;
    totalFat: number = 0;
    consumedFat: number = 0;
    totalProtein: number = 0;
    consumedProtein: number = 0;
    totalCarbs: number = 0;
    consumedCarbs: number = 0;
}

export class PlanInformation {
    idNutritionPlan: number = 0;
    startDate: Date = new Date();
    endDate: Date = new Date();
    calories: number = 0;
    consumedCalories: number = 0;
    fat: number = 0;
    consumedFat: number = 0;
    protein: number = 0;
    consumedProtein: number = 0;
    carbs: number = 0;
    consumedCarbs: number = 0;
}

// Add dish models START
export class RecipeDto {
    title: string = "";
    summary: string = "";
    readyInMinutes: number = 0;
    image: string = "";
    id: number = 0;
    dishType: number = 0;
    servings: number = 0;
    planDate: Date = new Date();
    nutrition: Nutrition = new Nutrition();
}

class Nutrition {
    ingredients: Ingredient[] = [];
}

class Ingredient {
    amount: number = 0;
    name: string = "";
    unit: number = 0;
    nutrients: Nutrient[] = [];
}

class Nutrient {
    amount: number = 0;
    name: string = "";
    unit: number = 0;
}
// Add dish models END