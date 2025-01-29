import { useEffect } from "react";
import config from "../../config/config";
import { Character } from "../../domain/models/Character";

export function useSSECharacterByName(props: {
  name: string;
  callback: (character: Character) => void;
}) {
  useEffect(() => {
    const eventSource = new EventSource(
      `${config.BASE_URL}/sse/characters/${props.name}`,
    );

    eventSource.onmessage = (event) => {
      try {
        const character = new Character(JSON.parse(event.data.substring(6)));
        props.callback(character);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);
}
