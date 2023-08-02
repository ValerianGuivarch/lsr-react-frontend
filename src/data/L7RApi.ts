import axios from 'axios';
import config from '../config/config';
import {CharacterRaw} from "./CharacterRaw";
import {CharacterPreviewRaw} from "./CharacterPreviewRaw";
import {Character} from "../domain/models/Character";

export class L7RApi {
    static async getPJs(): Promise<CharacterPreviewRaw[]> {
        const response = await axios.get(`${config.BASE_URL}/characters?category=PJ`);
        return response.data;
    }
    static async getCharacterByName (characterName: string): Promise<CharacterRaw | undefined> {
        const response = await axios.get(`${config.BASE_URL}/characters/`+characterName);
        return new Character(response.data);
    }

    static async updateCharacter(character: Character) {
        console.log("updateCharacter");
        console.log(character);
        // character as JSON
        console.log(JSON.stringify(character));
        const response = await axios.put(`${config.BASE_URL}/characters/`+character.name, character);
        return new Character(response.data);
    }
}