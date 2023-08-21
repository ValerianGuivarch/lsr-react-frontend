import {SkillRaw} from "../../data/api/SkillRaw";
import {DisplayCategory} from "./DisplayCategory";

export class Skill {
    name: string
    shortName: string
    longName?: string
    description?: string
    displayCategory: DisplayCategory
    dailyUse?: number
    limitationMax?: number
    soldatCost: number
    isHeal: boolean
    constructor(p: SkillRaw) {
        this.name = p.name
        this.shortName = p.shortName
        this.longName = p.longName
        this.description = p.description
        this.displayCategory = DisplayCategory[p.displayCategory as keyof typeof DisplayCategory]
        this.dailyUse = p.dailyUse
        this.limitationMax = p.limitationMax
        this.soldatCost = p.soldatCost
        this.isHeal = p.isHeal
    }

}