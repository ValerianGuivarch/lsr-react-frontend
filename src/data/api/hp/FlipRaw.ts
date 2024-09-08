import { Difficulty } from "../../../domain/models/hp/Difficulty";

export interface FlipRaw {
  id: string;
  wizardName: string;
  text: string;
  result: number;
  base: number;
  modif: number;
  difficulty: Difficulty;
  resultBis?: number;
}
