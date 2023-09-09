import {RollRaw} from "../../data/api/RollRaw";
import {SkillStat} from "./SkillStat";

export class Roll {
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
  stat?: SkillStat;
  display: string;
  resistRolls: Roll[];
  healPoint?: number;

  constructor(p: RollRaw) {
    this.id = p.id;
    this.rollerName = p.rollerName;
    this.date = p.date;
    this.secret = p.secret;
    this.displayDices = p.displayDices;
    this.focus = p.focus;
    this.power = p.power;
    this.proficiency = p.proficiency;
    this.bonus = p.bonus;
    this.malus = p.malus;
    this.result = p.result;
    this.success = p.success;
    this.juge12 = p.juge12;
    this.juge34 = p.juge34;
    this.resistRoll = p.resistRoll;
    this.picture = p.picture;
    this.data = p.data;
    this.empirique = p.empirique;
    this.display = p.display;
    this.stat = SkillStat[p.stat  as keyof typeof SkillStat];
    this.resistRolls = p.resistRolls.map(r => new Roll(r));
    this.healPoint = p.healPoint;
  }
}