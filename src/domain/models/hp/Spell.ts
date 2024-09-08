import { Knowledge } from "./Knowledge";
import { Stat } from "./Stat";

export class Spell {
  name: string;
  rank: number;
  stat: Stat;
  knowledge: Knowledge;

  constructor(spell: {
    name: string;
    rank: number;
    stat: Stat;
    knowledge: Knowledge;
  }) {
    this.name = spell.name;
    this.rank = spell.rank;
    this.stat = spell.stat;
    this.knowledge = spell.knowledge;
  }
}
