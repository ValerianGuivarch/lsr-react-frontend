import { useEffect } from "react";
import config from "../../config/config";
import { Roll } from "../../domain/models/Roll";

export function useSSERolls(props: {
  name: string;
  callback: (rolls: Roll[]) => void;
}) {
  useEffect(() => {
    const eventSource = new EventSource(
      `${config.BASE_URL}/sse/rolls/${props.name}`,
    );

    eventSource.onmessage = (event) => {
      try {
        const rolls = JSON.parse(event.data.substring(6));
        props.callback(rolls);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);
}
