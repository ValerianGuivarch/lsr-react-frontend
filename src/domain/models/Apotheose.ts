import {DisplayCategory} from "./DisplayCategory";
import {ApotheoseRaw} from "../../data/ApotheoseRaw";

export class Apotheose {
    name: string
    displayCategory: DisplayCategory
    cost: number
    constructor(p: ApotheoseRaw) {
        this.name = p.name
        this.displayCategory = DisplayCategory[p.displayCategory as keyof typeof DisplayCategory]
        this.cost = p.cost
    }

}