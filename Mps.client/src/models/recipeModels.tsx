export class Recipe {
    title: string = "";
    imageUrl: string = "";
    servings: number = 0;
    readyInMinutes: number = 0;
    spoonacularId: number = 0;
    recipeId: number = 0;
    sourceURL: string = "";
    extendedIngredients: RecipeIngredient[] = [];
}
export class RecipeVM {
    readyInMinutes: number = 0;
    servings: number = 0;
    title: string = "";
    image: string = "";
    id: number = 0;
    idRecipe: number = 0;
    summary: string = "";
    analyzedInstructions: AnalyzedInstructions[] = [];
    extendedIngredients: RecipeIngredient[] = [];
    nutrition: Nutrition = {
        nutrients: [],
        weightPerServing: new WeightPerServing()
    };
    vegan: boolean = false;
    glutenFree: boolean = false;
    dairyFree: boolean = false;
    sustainable: boolean = false;
    healthScore: number = 0;
    planDate: Date = new Date();
    dishType: number = 0;
    weightPerServing: string = "";
}

class AnalyzedInstructions {
    name: string = "";
    steps: Step[] = [];
}

export class Step {
    number: number = 0;
    step: string = "";
}

class Nutrition {
    nutrients: Nutritien[] = [];
    weightPerServing: WeightPerServing = new WeightPerServing();
}

class Nutritien {
    name: string = "";
    amount: number = 0;
    unit: string = "";
}

export class RecipeIngredient {
    name: string = "";
    servings: number = 0;
    amount: number = 0;
    image: string = "";
    aisle: string = "";
    unit: string = "";
}

class WeightPerServing {
    amount: number = 0;
    unit: string = "";
}