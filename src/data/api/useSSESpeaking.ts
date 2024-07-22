import { useEffect } from "react";
import config from "../../config/config";
import { Character } from "../../domain/models/Character";

export function useSSESpeaking(props: {
  callback: (speaking: string) => void;
}) {
  useEffect(() => {
    const eventSource = new EventSource(`${config.BASE_URL}/sse/speaking`);

    eventSource.onmessage = (event) => {
      try {
        const speaking = event.data.substring(7);
        speaking.substring(0, speaking.length - 1);
        props.callback(speaking);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);
}
