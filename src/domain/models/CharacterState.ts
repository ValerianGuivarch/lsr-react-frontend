import {Character} from "./Character";

export class CharacterState {
    focusActivated: boolean
    powerActivated: boolean
    bonusActivated: boolean
    malusActivated: boolean
    bonus: number
    malus: number
    proficiencies: Map<string, boolean>
    lux: boolean
    umbra: boolean
    secunda: boolean
    secret: boolean
    selected: boolean

    constructor(state?: CharacterState, character?: Character) {
        this.focusActivated = (state && character?.pf && character?.pf >0) ? state.focusActivated : false
        this.powerActivated = (state && character?.pp && character?.pp >0) ? state.powerActivated : false
        this.bonusActivated = state ? state.bonusActivated : false
        this.malusActivated = state ? state.malusActivated : false
        this.bonus = state ? state.bonus : 0
        this.malus = state ? state.malus : 0
        this.proficiencies = state ? state.proficiencies : new Map<string, boolean>()
        this.lux = state ? state.lux : false
        this.umbra = state ? state.umbra : false
        this.secunda = state ? state.secunda : false
        this.secret = state ? state.secret : false
        this.selected = state ? state.selected : false
    }
}