import { WizardStat } from "./WizardStat";
import { WizardKnowledge } from "./WizardKnowledge";
import { WizardSpell } from "./WizardSpell";

export class Wizard {
  id: string;
  name: string;
  category: string;
  stats: WizardStat[];
  knowledges: WizardKnowledge[];
  spells: WizardSpell[];

  constructor(wizard: {
    id: string;
    name: string;
    category: string;
    stats: WizardStat[];
    knowledges: WizardKnowledge[];
    spells: WizardSpell[];
  }) {
    this.id = wizard.id;
    this.name = wizard.name;
    this.category = wizard.category;
    this.stats = wizard.stats;
    this.knowledges = wizard.knowledges;
    this.spells = wizard.spells;
  }

  static getDisplayNameAndDescription(wizard: Wizard) {
    return `${wizard.name} - ${wizard.category}`;
  }
}
