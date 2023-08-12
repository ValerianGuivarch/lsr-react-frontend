import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { rollsSlice } from '../store/rolls-slice';
import config from '../../config/config';

export function useSSERolls() {
    const dispatch = useDispatch();

    useEffect(() => {
        const eventSource = new EventSource(`${config.BASE_URL}/sse/rolls`);

        eventSource.onmessage = (event) => {
            try {
                const rolls = JSON.parse(event.data.substring(6));
                dispatch(rollsSlice.actions.setRolls(rolls));
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        return () => {
            eventSource.close();
        };
    }, [dispatch]);
}