import {DisplayCategory} from "./DisplayCategory";
import {ProficiencyRaw} from "../../data/ProficiencyRaw";

export class Proficiency {
    name: string
    shortName: string
    displayCategory: DisplayCategory
    constructor(p: ProficiencyRaw) {
        this.name = p.name
        this.shortName = p.shortName
        this.displayCategory = DisplayCategory[p.displayCategory as keyof typeof DisplayCategory]
    }

}