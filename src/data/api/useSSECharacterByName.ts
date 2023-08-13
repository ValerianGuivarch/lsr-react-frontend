import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import config from '../../config/config';
import {Character} from "../../domain/models/Character";
import {setCharacter} from "../store/character-slice";

export function useSSECharacterByName(props: { name: string }) {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("useSSECharacterByName");
        console.log(config.BASE_URL);
        const eventSource = new EventSource(`${config.BASE_URL}/sse/characters/${props.name}`);

        eventSource.onmessage = (event) => {
            try {
                console.log("SSE character");
                console.log(event.data);
                const character = new Character(JSON.parse(event.data.substring(6)));
                dispatch(setCharacter(character));
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        return () => {
            eventSource.close();
        };
    }, [dispatch]);
}