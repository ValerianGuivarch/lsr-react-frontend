export interface SkillRaw {
    name: string
    shortName: string
    longName?: string
    description?: string
    displayCategory: string
    dailyUse?: number
    limitationMax?: number
    soldatCost: number
    isHeal: boolean
}