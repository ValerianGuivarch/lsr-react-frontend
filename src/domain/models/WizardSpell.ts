import { Difficulty } from "./Difficulty";
import { Spell } from "./Spell";

export class WizardSpell {
  spell: Spell;
  difficulty: Difficulty;

  constructor(wizardSpell: { spell: Spell; difficulty: Difficulty }) {
    this.spell = wizardSpell.spell;
    this.difficulty = wizardSpell.difficulty;
  }
}
