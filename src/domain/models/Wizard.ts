import { WizardStat } from "./WizardStat";
import { WizardKnowledge } from "./WizardKnowledge";

export class Wizard {
  id: string;
  name: string;
  category: string;
  stats: WizardStat[];
  knowledges: WizardKnowledge[];

  constructor(wizard: {
    id: string;
    name: string;
    category: string;
    stats: WizardStat[];
    knowledges: WizardKnowledge[];
  }) {
    this.id = wizard.id;
    this.name = wizard.name;
    this.category = wizard.category;
    this.stats = wizard.stats;
    this.knowledges = wizard.knowledges;
  }

  static getDisplayNameAndDescription(wizard: Wizard) {
    return `${wizard.name} - ${wizard.category}`;
  }
}
