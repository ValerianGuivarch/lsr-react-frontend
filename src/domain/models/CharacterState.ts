import {CharacterRaw} from "../../data/CharacterRaw";
import {Genre} from "./Genre";
import {BattleState} from "./BattleState";
import {Skill} from "./Skill";
import {SkillCategory} from "./SkillCategory";

export class CharacterState {
    focusActivated: boolean
    powerActivated: boolean
    bonus: number
    malus: number
    legacyActivated: boolean

    constructor(state?: CharacterState) {
        this.focusActivated = state ? state.focusActivated : false
        this.powerActivated = state ? state.powerActivated : false
        this.bonus = state ? state.bonus : 0
        this.malus = state ? state.malus : 0
        this.legacyActivated = state ? state.legacyActivated : false
    }
}