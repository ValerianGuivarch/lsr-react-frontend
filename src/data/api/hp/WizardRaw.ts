import { WizardStatRaw } from "./WizardStatRaw";
import { WizardKnowledgeRaw } from "./WizardKnowledgeRaw";
import { WizardSpellRaw } from "./WizardSpellRaw";
import { HouseRaw } from "./HouseRaw";

export interface WizardRaw {
  name: string;
  familyName: string;
  category: string;
  stats: WizardStatRaw[];
  knowledges: WizardKnowledgeRaw[];
  spells: WizardSpellRaw[];
  house: HouseRaw;
  xp: number;
  baguette: string;
  coupDePouce: string;
  crochePatte: string;
  text: string;
}
