import { KnowledgeRaw } from "./KnowledgeRaw";
import { StatRaw } from "./StatRaw";

export interface SpellRaw {
  id: string;
  name: string;
  rank: number;
  stat: StatRaw;
  knowledge: KnowledgeRaw;
}
