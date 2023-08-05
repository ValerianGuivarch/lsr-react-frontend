import {SkillRaw} from "./SkillRaw";

export interface CharacterRaw {
    name: string
    classe: {
        name: string,
        display: string
    }
    bloodline: {
        name: string,
        display: string
    }
    arcaneList: {
        name: string
        type: string
        use: string
    }[]
    chair: number
    esprit: number
    essence: number
    bonus: number
    malus: number
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
    category: string
    apotheose: string
    apotheoseImprovement?: string
    apotheoseImprovementList: string[]
    genre: string
    relance: number
    playerName?: string
    picture?: string
    pictureApotheose?: string
    background?: string
    buttonColor?: string
    textColor?: string
    battleState: string
    skills: SkillRaw[]
}