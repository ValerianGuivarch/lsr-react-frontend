export interface RollRaw {
    id: string;
    rollerName: string;
    date: Date;
    secret: boolean;
    displayDices: boolean;
    focus: boolean;
    power: boolean;
    proficiency: boolean;
    bonus: number;
    malus: number;
    result: number[];
    success: number | null;
    juge12: number | null;
    juge34: number | null;
    resistRoll?: string;
    picture?: string;
    data?: string;
    empirique?: string;
    display: string;
    stat: string;
}