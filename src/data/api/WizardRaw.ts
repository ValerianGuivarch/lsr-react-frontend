import { WizardStatRaw } from "./WizardStatRaw";
import { WizardKnowledgeRaw } from "./WizardKnowledgeRaw";

export interface WizardRaw {
  id: string;
  name: string;
  category: string;
  stats: WizardStatRaw[];
  knowledges: WizardKnowledgeRaw[];
}
