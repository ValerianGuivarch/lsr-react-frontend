import { useEffect } from "react";
import config from "../../config/config";
import { Flip } from "../../domain/models/hp/Flip";

export function useSSEFlips(props: { callback: (flips: Flip[]) => void }) {
  useEffect(() => {
    const eventSource = new EventSource(`${config.BASE_URL}/hp/sse/flips`);

    eventSource.onmessage = (event) => {
      try {
        const flips = JSON.parse(event.data.substring(6));
        props.callback(flips);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);
}
