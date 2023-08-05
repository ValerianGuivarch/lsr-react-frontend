import axios from 'axios';
import config from '../config/config';
import {CharacterRaw} from "./CharacterRaw";
import {CharacterPreviewRaw} from "./CharacterPreviewRaw";
import {Character} from "../domain/models/Character";
import {CharacterUpdateRequest} from "./CharacterUpdateRequest";
import {Roll} from "../domain/models/Roll";
import {RollRaw} from "./RollRaw";

export class L7RApi {
    static async getPJs(): Promise<CharacterPreviewRaw[]> {
        const response = await axios.get(`${config.BASE_URL}/characters?category=PJ`);
        return response.data;
    }
    static async getCharacterByName (characterName: string): Promise<CharacterRaw | undefined> {
        const response = await axios.get(`${config.BASE_URL}/characters/`+characterName);
        return new Character(response.data);
    }

    static async updateCharacter(characterUpdateRequest: CharacterUpdateRequest) {
        const response = await axios.put(`${config.BASE_URL}/characters/`+characterUpdateRequest.name, characterUpdateRequest);
        return new Character(response.data);
    }

    static async getRolls() {
        const response = await axios.get(`${config.BASE_URL}/rolls`);
        return response.data.map((roll: RollRaw) => {
            return new Roll(roll);
        });
    }

    static async sendRoll(skillName: string, characterName: string) {
        const response = await axios.post(`${config.BASE_URL}/rolls`, {
            skillName: skillName,
            rollerName:characterName,
            focus: false,
            power: false,
            proficiency: false,
            secret: false,
            bonus: 0,
            malus: 0
        });
        return new Roll(response.data);
    }
}