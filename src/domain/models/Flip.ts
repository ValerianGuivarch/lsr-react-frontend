export class Flip {
  id: string;
  wizardName: string;
  text: string;
  result: number;
  base: number;
  modif: number;

  constructor(p: Flip) {
    this.id = p.id;
    this.wizardName = p.wizardName;
    this.text = p.text;
    this.result = p.result;
    this.base = p.base;
    this.modif = p.modif;
  }
}
