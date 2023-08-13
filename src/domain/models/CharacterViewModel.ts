import {Character} from "./Character";
import {CharacterState} from "./CharacterState";

export class CharacterViewModel {
    character: Character
    state: CharacterState

    constructor(character: Character, state?: CharacterState) {
        console.log("LUL")
        this.character = character
        this.state = state ? state : new CharacterState()
    }
}