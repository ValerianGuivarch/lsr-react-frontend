import { useEffect, useRef } from "react";
import config from "../../config/config";
import { Roll } from "../../domain/models/Roll";

export function useSSERolls(props: {
  name: string;
  callback: (rolls: Roll[]) => void;
}) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const connect = () => {
      const url = `${config.BASE_URL}/sse/rolls/${props.name}`;
      console.log("Connecting to SSE rolls:", url);

      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const rolls = JSON.parse(event.data.substring(6));
          props.callback(rolls);
        } catch (error) {
          console.error("Error parsing SSE data:", error);
        }
      };

      eventSource.onerror = () => {
        console.warn("SSE rolls connection lost. Attempting to reconnect...");
        cleanup();
        retryConnection();
      };

      console.log("Connected to SSE rolls:", url);
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
        console.log("Retrying SSE rolls connection...");
        connect();
      }, 5000); // Attendre 5 secondes avant de réessayer
    };

    connect();

    return () => {
      cleanup();
    };
  }, [props.name, props.callback]);
}
