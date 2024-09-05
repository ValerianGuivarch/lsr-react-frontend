import { Knowledge } from "./Knowledge";

export class WizardKnowledge {
  knowledge: Knowledge;
  level: number;
  xp: number;

  constructor(wizardKnowledge: {
    knowledge: Knowledge;
    level: number;
    xp: number;
  }) {
    this.knowledge = wizardKnowledge.knowledge;
    this.level = wizardKnowledge.level;
    this.xp = wizardKnowledge.xp;
  }
}
