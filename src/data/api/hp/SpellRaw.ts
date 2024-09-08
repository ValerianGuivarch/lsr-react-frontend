import { KnowledgeRaw } from "../KnowledgeRaw";
import { StatRaw } from "./StatRaw";

export interface SpellRaw {
  name: string;
  rank: number;
  stat: StatRaw;
  knowledge: KnowledgeRaw;
}
