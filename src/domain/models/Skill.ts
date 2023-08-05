import {CharacterRaw} from "../../data/CharacterRaw";
import { Bloodline } from "./Bloodline";
import {Classe} from "./Classe";
import { Genre } from "./Genre";
import {BattleState} from "./BattleState";
import {SkillRaw} from "../../data/SkillRaw";
import {SkillCategory} from "./SkillCategory";

export class Skill {
    name: string
    category: SkillCategory
    constructor(p: SkillRaw) {
        this.name = p.name
        this.category = SkillCategory[p.category as keyof typeof SkillCategory]
    }

}