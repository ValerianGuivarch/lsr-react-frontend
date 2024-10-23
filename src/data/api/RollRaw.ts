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
  resultBis: number[] | null;
  successBis: number | null;
  juge12Bis: number | null;
  juge34Bis: number | null;
  avantage: boolean | null;
  resistRoll?: string;
  picture?: string;
  data?: string;
  empirique?: string;
  display: string;
  stat: string;
  resistRolls: RollRaw[];
  healPoint?: number;
  resistance: boolean;
  blessure: boolean;
  help: boolean;
  precision?: string;
  pictureUrl?: string;
}
