import { Knowledge } from "./Knowledge";
import { Stat } from "./Stat";

export class Spell {
  id: string;
  name: string;
  rank: number;
  stat: Stat;
  knowledge: Knowledge;

  constructor(spell: {
    id: string;
    name: string;
    rank: number;
    stat: Stat;
    knowledge: Knowledge;
  }) {
    this.id = spell.id;
    this.name = spell.name;
    this.rank = spell.rank;
    this.stat = spell.stat;
    this.knowledge = spell.knowledge;
  }
}
