import { Stat } from "./Stat";

export class WizardStat {
  stat: Stat;
  level: number;

  constructor(wizardStat: { stat: Stat; level: number }) {
    this.stat = wizardStat.stat;
    this.level = wizardStat.level;
  }
}
