export default function getMeasurementUnit(unit: number): string {
    switch (unit) {
        case 1:
            return "l";
        case 2:
            return "kg";
        case 3:
            return "g";
        case 4:
            return "ml";
        case 5:
            return "piece (-s)";
        case 6:
            return "cup (-s)";
        case 7:
            return "servings";
        case 8:
            return "large";
        case 9:
            return "teaspoon (-s)";
        case 10:
            return "clove";
        case 11:
            return "slice (-s)";
        case 12:
            return "fruit";
        case 13:
            return "oz";
        case 14:
            return "small";
        case 15:
            return "tablespoon (-s)";
        case 16:
            return "pinch";
        case 17:
            return "pint";
        case 18:
            return "quart";
        case 19:
            return "pound (-s)";
        case 20:
            return "scoop (-s)";
        case 21:
            return "medium (-s)";
        case 22:
            return "handful (-s)";
        case 23:
            return "stalk (-s)";
        default:
            return "piece (-s)";
    }
}
