import {CharacterPreviewRaw} from "../../data/CharacterPreviewRaw";

export class CharacterPreview {
    name: string
    playerName?: string
    picture?: string

    constructor(p: CharacterPreviewRaw) {
        this.name = p.name
        this.playerName = p.playerName
        this.picture = p.picture
    }
}