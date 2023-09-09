import { useEffect } from 'react';
import config from '../../config/config';
import {Character} from "../../domain/models/Character";
import {CharacterRaw} from "./CharacterRaw";
import {CharacterPreviewRaw} from "./CharacterPreviewRaw";
import {CharacterPreview} from "../../domain/models/CharacterPreview";

export function useSSECharactersPreviewSession(props: { callback: (charactersPreview: CharacterPreview[]) => void }) {

    useEffect(() => {
        const eventSource = new EventSource(`${config.BASE_URL}/sse/characters/characters-session`);

        eventSource.onmessage = (event) => {
            try {
                console.log("SSE session characters preview");
                console.log(event.data);
                const charactersPreview = JSON.parse(event.data.substring(6)).map((c: CharacterPreviewRaw) =>  new CharacterPreview(c));
                props.callback(charactersPreview);
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        return () => {
            eventSource.close();
        };
    }, []);
}