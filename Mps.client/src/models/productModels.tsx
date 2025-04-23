export class ProductVM {
    title: string = "";
    calories: number = 0;
    fat: number = 0;
    protein: number = 0;
    carbs: number = 0;
    expirationDate: Date = new Date();
    note: string = "";
    quantity: number = 0;
    measurementUnit: number = 0;
    category: number = 0;
}

export class Product {
    expirationDate: Date = new Date();
    note: string = "";
    quantity: number = 0;
    measurementUnit: number = 0;
    idProductNavigation: ProductNavigation = new ProductNavigation();
    categories: number[] = [];
}

export class ProductNavigation {
    idProduct: number = 0;
    image: string = "";
    title: string = "";
    calories: number = 0;
    fat: number = 0;
    protein: number = 0;
    carbs: number = 0;
}

