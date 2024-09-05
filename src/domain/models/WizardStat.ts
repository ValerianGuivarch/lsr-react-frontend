import { Stat } from "./Stat";

export class WizardStat {
  stat: Stat;
  level: number;
  xp: number;

  constructor(wizardStat: { stat: Stat; level: number; xp: number }) {
    this.stat = wizardStat.stat;
    this.level = wizardStat.level;
    this.xp = wizardStat.xp;
  }
}
