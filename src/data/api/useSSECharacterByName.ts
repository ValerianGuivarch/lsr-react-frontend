import { useEffect, useRef } from "react";
import config from "../../config/config";
import { Character } from "../../domain/models/Character";

export function useSSECharacterByName(props: {
  name: string;
  callback: (character: Character) => void;
}) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const connect = () => {
      if (!props.name) return;

      const url = `${config.BASE_URL}/sse/characters/${props.name}`;
      console.log("Connecting to SSE:", url);

      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const character = new Character(JSON.parse(event.data.substring(6)));
          props.callback(character);
        } catch (error) {
          console.error("Error parsing SSE data:", error);
        }
      };

      eventSource.onerror = () => {
        console.warn("SSE connection lost. Attempting to reconnect...");
        cleanup();
        retryConnection();
      };

      console.log("Connected to SSE:", url);
    };

    const cleanup = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };

    const retryConnection = () => {
      retryTimeoutRef.current = setTimeout(() => {
        console.log("Retrying SSE connection...");
        connect();
      }, 5000); // Attendre 5 secondes avant de réessayer
    };

    connect();

    return () => {
      cleanup();
    };
  }, [props.name, props.callback]);
}
