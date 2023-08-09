import {Character} from "../domain/models/Character";

export class CharacterUpdateRequest {
    chair: number
    esprit: number
    essence: number
    pv: number
    pvMax: number
    pf: number
    pfMax: number
    pp: number
    ppMax: number
    dettes: number
    arcanes: number
    arcanesMax: number
    niveau: number
    lux: string
    umbra: string
    secunda: string
    notes: string
    apotheoseName: string
    apotheoseImprovement?: string
    apotheoseImprovementList: string[]
    relance: number

    constructor(character: Character) {
        this.chair = character.chair
        this.esprit = character.esprit
        this.essence = character.essence
        this.pv = character.pv
        this.pvMax = character.pvMax
        this.pf = character.pf
        this.pfMax = character.pfMax
        this.pp = character.pp
        this.ppMax = character.ppMax
        this.dettes = character.dettes
        this.arcanes = character.arcanes
        this.arcanesMax = character.arcanesMax
        this.niveau = character.niveau
        this.lux = character.lux
        this.umbra = character.umbra
        this.secunda = character.secunda
        this.notes = character.notes
        this.apotheoseName = character.apotheoseName
        this.apotheoseImprovement = character.apotheoseImprovement
        this.apotheoseImprovementList = character.apotheoseImprovementList
        this.relance = character.relance
    }
}