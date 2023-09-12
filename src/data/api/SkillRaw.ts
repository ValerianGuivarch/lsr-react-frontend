export interface SkillRaw {
  id: string;
  name: string;
  stat: string;
  shortName: string;
  longName?: string;
  description?: string;
  displayCategory: string;
  dailyUse?: number;
  dailyUseMax?: number;
  soldatCost: number;
  isHeal: boolean;
  blessure: boolean;
  resistance: boolean;
}
