import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import config from '../config/config';
import {characterSlice} from "./store/character-slice";
import {Character} from "../domain/models/Character";

export function useSSECharacterByName(props: { name: string }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const eventSource = new EventSource(`${config.BASE_URL}/sse/characters/${props.name}`);

        eventSource.onmessage = (event) => {
            try {
                console.log("SSE character");
                console.log(event.data);
                const character = new Character(JSON.parse(event.data.substring(6)));
                dispatch(characterSlice.actions.setCharacter(character));
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        return () => {
            eventSource.close();
        };
    }, [dispatch]);
}