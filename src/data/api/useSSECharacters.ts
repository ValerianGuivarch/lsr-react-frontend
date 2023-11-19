import { useEffect } from "react";
import config from "../../config/config";
import { Character } from "../../domain/models/Character";
import { CharacterRaw } from "./CharacterRaw";

export function useSSECharactersSession(props: {
  callback: (characters: Character[]) => void;
}) {
  useEffect(() => {
    const eventSource = new EventSource(`${config.BASE_URL}/sse/mj/characters`);

    eventSource.onmessage = (event) => {
      try {
        const characters = JSON.parse(event.data.substring(6)).map(
          (c: CharacterRaw) => new Character(c),
        );
        props.callback(characters);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);
}
