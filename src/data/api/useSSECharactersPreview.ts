import { useEffect, useRef } from "react";
import config from "../../config/config";
import { CharacterPreview } from "../../domain/models/CharacterPreview";
import { CharacterPreviewRaw } from "./CharacterPreviewRaw";

export function useSSECharactersPreviewSession(props: {
  callback: (charactersPreview: CharacterPreview[]) => void;
}) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const connect = () => {
      const url = `${config.BASE_URL}/sse/characters/characters-session`;
      console.log("Connecting to SSE:", url);

      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const charactersPreview = JSON.parse(event.data.substring(6)).map(
            (c: CharacterPreviewRaw) => new CharacterPreview(c),
          );
          props.callback(charactersPreview);
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
  }, [props.callback]);
}
