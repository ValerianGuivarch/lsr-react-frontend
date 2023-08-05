export interface CharacterUpdateRequest {
    name: string
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
    apotheose: string
    apotheoseImprovement?: string
    apotheoseImprovementList: string[]
    relance: number
}