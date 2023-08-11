import {SkillRaw} from "../../data/SkillRaw";
import {DisplayCategory} from "./DisplayCategory";

export class Skill {
    name: string
    shortName: string
    displayCategory: DisplayCategory
    constructor(p: SkillRaw) {
        this.name = p.name
        this.shortName = p.shortName
        this.displayCategory = DisplayCategory[p.displayCategory as keyof typeof DisplayCategory]
    }

}