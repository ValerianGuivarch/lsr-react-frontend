import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import config from '../../config/config';
import {Character} from "../../domain/models/Character";
import {CharacterRaw} from "./CharacterRaw";
import {setCharacters} from "../store/character-slice";

export function useSSECharactersControlled(props: { name: string }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const eventSource = new EventSource(`${config.BASE_URL}/sse/characters/${props.name}/characters-controller`);

        eventSource.onmessage = (event) => {
            try {
                console.log("SSE controlled characters");
                console.log(event.data);
                const characters = JSON.parse(event.data.substring(6)).map((c: CharacterRaw) =>  new Character(c));
                dispatch(setCharacters(characters));
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        return () => {
            eventSource.close();
        };
    }, [dispatch]);
}