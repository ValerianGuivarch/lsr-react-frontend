export class Knowledge {
  id: string;
  name: string;
  color: string;

  constructor(knowledge: { id: string; name: string; color: string }) {
    this.id = knowledge.id;
    this.name = knowledge.name;
    this.color = knowledge.color;
  }
}
