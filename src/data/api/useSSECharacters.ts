import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import config from '../../config/config';
import {Character} from "../../domain/models/Character";
import {CharacterRaw} from "./CharacterRaw";
import {mjSlice} from "../store/mj-slice";

export function useSSECharacters() {
    const dispatch = useDispatch();

    useEffect(() => {
        const eventSource = new EventSource(`${config.BASE_URL}/sse/mj/characters/`);

        eventSource.onmessage = (event) => {
            try {
                console.log("SSE session characters");
                console.log(event.data);
                const characters = JSON.parse(event.data.substring(6)).map((c: CharacterRaw) =>  new Character(c));
                dispatch(mjSlice.actions.setCharacters(characters));
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        return () => {
            eventSource.close();
        };
    }, [dispatch]);
}