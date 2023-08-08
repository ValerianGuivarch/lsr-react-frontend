import axios from 'axios';
import config from '../../config/config';
import {CharacterRaw} from "../CharacterRaw";
import {CharacterPreviewRaw} from "../CharacterPreviewRaw";
import {Character} from "../../domain/models/Character";
import {CharacterUpdateRequest} from "../CharacterUpdateRequest";
import {RollRaw} from "../RollRaw";

export class L7RApi {
    static async getPJs(): Promise<CharacterPreviewRaw[]> {
        const response = await axios.get(`${config.BASE_URL}/characters?category=PJ`);
        return response.data;
    }
    static async getCharacterByName (characterName: string): Promise<CharacterRaw> {
        const response = await axios.get(`${config.BASE_URL}/characters/`+characterName);
        return response.data;
    }

    static async updateCharacter(characterName: string, characterUpdateRequest: CharacterUpdateRequest) {
        const response = await axios.put(`${config.BASE_URL}/characters/`+characterName, characterUpdateRequest);
        return new Character(response.data);
    }

    static async getRolls(): Promise<RollRaw[]> {
        const response = await axios.get(`${config.BASE_URL}/rolls`);
        return response.data as RollRaw[];
    }

    static async sendRoll(p:
        {
            skillName: string,
            characterName: string,
            focus: boolean,
            power: boolean,
            proficiency: boolean,
            secret: boolean,
            bonus: number,
            malus: number,
            empiriqueRoll?: string
        }
        ): Promise<void> {
            await axios.post(`${config.BASE_URL}/rolls`, {
                skillName: p.skillName,
                rollerName:p.characterName,
                focus: p.focus,
                power: p.power,
                proficiency: p.proficiency,
                secret: p.secret,
                bonus: p.bonus,
                malus: p.malus,
                empiriqueRoll: p.empiriqueRoll
            });
    }
}