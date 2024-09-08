import { WizardStat, WizardStatToUpdate } from "./WizardStat";
import { WizardKnowledge, WizardKnowledgeToUpdate } from "./WizardKnowledge";
import { WizardSpell, WizardSpellToUpdate } from "./WizardSpell";

export interface WizardToUpdate {
  category: string;
  stats: WizardStatToUpdate[];
  knowledges: WizardKnowledgeToUpdate[];
  spells: WizardSpellToUpdate[];
}

export class Wizard {
  name: string;
  category: string;
  stats: WizardStat[];
  knowledges: WizardKnowledge[];
  spells: WizardSpell[];

  constructor(wizard: {
    name: string;
    category: string;
    stats: WizardStat[];
    knowledges: WizardKnowledge[];
    spells: WizardSpell[];
  }) {
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
