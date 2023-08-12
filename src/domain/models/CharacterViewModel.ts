import {Character} from "./Character";
import {CharacterState} from "./CharacterState";

export class CharacterViewModel {
    character: Character
    state: CharacterState

    constructor(p: Character) {
        this.character = p
        this.state = new CharacterState()
    }
}