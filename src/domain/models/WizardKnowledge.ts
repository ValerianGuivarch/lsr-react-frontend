import { Knowledge } from "./Knowledge";

export class WizardKnowledge {
  knowledge: Knowledge;
  level: number;

  constructor(wizardKnowledge: { knowledge: Knowledge; level: number }) {
    this.knowledge = wizardKnowledge.knowledge;
    this.level = wizardKnowledge.level;
  }
}
