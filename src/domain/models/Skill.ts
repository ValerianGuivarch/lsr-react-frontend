import {SkillRaw} from "../../data/api/SkillRaw";
import {DisplayCategory} from "./DisplayCategory";

export class Skill {
    id : string
    name: string
    shortName: string
    longName?: string
    description?: string
    displayCategory: DisplayCategory
    dailyUse?: number
    dailyUseMax?: number
    soldatCost: number
    isHeal: boolean
    constructor(p: SkillRaw) {
        this.id = p.id
        this.name = p.name
        this.shortName = p.shortName
        this.longName = p.longName
        this.description = p.description
        this.displayCategory = DisplayCategory[p.displayCategory as keyof typeof DisplayCategory]
        this.dailyUse = p.dailyUse
        this.dailyUseMax = p.dailyUseMax
        this.soldatCost = p.soldatCost
        this.isHeal = p.isHeal
    }

}