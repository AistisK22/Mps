import { Recipe } from "./nutritionPlanModels";
import { ProductNavigation } from "./productModels";

export class CustomRecipe {
    readyInMinutes: number;
    title: string;
    image: string;
    imageFile: File | null;
    idRecipe: number;
    summary: string;
    weightPerServing: string;
    recipeIngredients: Ingredient[];
    instructions: string;
    servings: number;
    dishType: number;
    constructor({
        readyInMinutes = 0,
        title = "",
        image = "",
        idRecipe = 0,
        summary = "",
        weightPerServing = "",
        recipeIngredients = [new Ingredient()],
        instructions = "",
        servings = 0,
        dishType = 0,
        imageFile = null
    }: Partial<CustomRecipe> = {}) {
        this.readyInMinutes = readyInMinutes;
        this.title = title;
        this.image = image;
        this.idRecipe = idRecipe;
        this.summary = summary;
        this.weightPerServing = weightPerServing;
        this.recipeIngredients = recipeIngredients;
        this.instructions = instructions;
        this.servings = servings;
        this.dishType = dishType;
        this.imageFile = imageFile;
    }
}

export class Ingredient {
    idRecipeIngredient: number;
    idProduct: number;
    idRecipe: number;
    quantity: number;
    measurementUnit: number;
    measurementUnitNavigation: MeasurementUnit = new MeasurementUnit();
    idProductNavigation: ProductNavigation = new ProductNavigation();
    idRecipeNavigation: Recipe = new Recipe();
    constructor({
        idRecipeIngredient = 0,
        quantity = 0,
        measurementUnit = 1,
        idProduct = 0,
        idRecipe = 0
    }: Partial<Ingredient> = {}) {
        this.quantity = quantity;
        this.idRecipeIngredient = idRecipeIngredient;
        this.measurementUnit = measurementUnit;
        this.idProduct = idProduct;
        this.idRecipe = idRecipe;
    }
}

export class MeasurementUnit {
    idMeasurementUnits: number = 0;
    name: string = "";
}
