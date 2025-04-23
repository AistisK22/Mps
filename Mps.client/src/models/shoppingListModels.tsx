export class ShoppingList {
    title: string = "";
    idShoppingList: number = 0;
    shoppingListProducts: ShoppingListProduct[] = [];
}

export class ShoppingListProduct {
    shoppingListTitle: string = "";
    productTitle: string = "";
    idProduct: number = 0;
    idShoppingList: number = 0;
}