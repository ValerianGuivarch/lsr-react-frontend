import axios from 'axios';
import config from '../../config/config';
import {CharacterRaw} from "./CharacterRaw";
import {CharacterPreviewRaw} from "./CharacterPreviewRaw";
import {Character} from "../../domain/models/Character";
import {CharacterUpdateRequest} from "./CharacterUpdateRequest";
import {RollRaw} from "./RollRaw";

export class L7RApi {

    static async sendNewTurn(): Promise<void> {
        await axios.put(`${config.BASE_URL}/mj/newTurn`);
    }
    static async resetRolls(): Promise<void> {
        await axios.put(`${config.BASE_URL}/mj/resetRolls`);
    }
    static async getCharactersPreview(): Promise<CharacterPreviewRaw[]> {
        const response = await axios.get(`${config.BASE_URL}/characters`);
        return response.data;
    }
    static async getCharacterByName (characterName: string): Promise<CharacterRaw> {
        console.log("kik1")
        console.log(characterName)
        try {
            const response = await axios.get(`${config.BASE_URL}/characters/`+characterName);
            console.log("kik2")
            return response.data;
        } catch (e: any) {
            console.log("kik3")
            console.log(e)
            throw e;
        }
    }

    static async updateCharacter(characterName: string, characterUpdateRequest: CharacterUpdateRequest) {
        const response = await axios.put(`${config.BASE_URL}/characters/`+characterName, characterUpdateRequest);
        return new Character(response.data);
    }

    static async rest(characterName: string) {
        await axios.put(`${config.BASE_URL}/characters/`+characterName+'/rest');
    }

    static async getSessionCharacter (): Promise<CharacterRaw[]> {
        const response = await axios.get(`${config.BASE_URL}/mj/characters`);
        return response.data;
    }

    static async getControlledCharacters (characterName: string): Promise<CharacterRaw[]> {
        const response = await axios.get(`${config.BASE_URL}/characters/`+characterName+`/characters-controller`);
        return response.data;
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
            resistRoll?: string,
            empiriqueRoll?: string
        }
        ): Promise<void> {
            await axios.post(`${config.BASE_URL}/rolls`, {
                skillName: p.skillName,
                rollerName: p.characterName,
                focus: p.focus,
                power: p.power,
                proficiency: p.proficiency,
                secret: p.secret,
                bonus: p.bonus,
                malus: p.malus,
                empiriqueRoll: p.empiriqueRoll,
                resistRoll: p.resistRoll ? ""+p.resistRoll : undefined
            });
    }
}