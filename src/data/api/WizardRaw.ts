import { WizardStatRaw } from "./WizardStatRaw";
import { WizardKnowledgeRaw } from "./WizardKnowledgeRaw";
import { WizardSpellRaw } from "./WizardSpellRaw";

export interface WizardRaw {
  id: string;
  name: string;
  category: string;
  stats: WizardStatRaw[];
  knowledges: WizardKnowledgeRaw[];
  spells: WizardSpellRaw[];
}
