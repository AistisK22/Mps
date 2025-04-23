export class User {
    name: string = "";
    surname: string = "";
    email: string = "";
    birthdate: string = "";
    active: string = "";
    idUser: number = 0;
    height: number = 0;
    weight: number = 0;
    bmi: number = 0;
    idGoal: number = 0;
    gender: number = 0;
    physicalActivityLevel: number = 0;
    physicalActivityLevelNavigation: PhysicalActivityLevelNavigation = new PhysicalActivityLevelNavigation();
}

export class ValidationUser {
    name: boolean = false;
    surname: boolean = false;
    email: boolean = false;
    birth: boolean = false;
    password: boolean = false;
    weight: boolean = false;
    height: boolean = false;
}

export class ValidationUserText {
    name: string = "";
    surname: string = "";
    email: string = "";
    birth: string = "";
    password: string = "";
    weight: string = "";
    height: string = "";
}

export class Gender {
    idGenders: number = 0;
    name: string = "";
}

export class PhysicalActivityLevel {
    idPhysicalActivityLevels: number = 0;
    name: string = "";
}

export enum GenderEnum {
    Female = 1,
    Male = 2,
    Other = 3
}

export enum PhysicalActivityLevelEnum {
    Sedentary = 1,
    LightlyActive = 2,
    ModeratelyActive = 3,
    VeryActive = 4,
    ExtremelyActive = 5
}

class PhysicalActivityLevelNavigation {
    value: number = 0;
}