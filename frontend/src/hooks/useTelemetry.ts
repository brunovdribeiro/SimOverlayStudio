import { useEffect, useRef, useState } from 'react';
import { TelemetryData } from '../types/TelemetryData';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/telemetry';

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
          console.log('WebSocket connected');
          setConnected(true);
          setError(null);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as TelemetryData;
            setTelemetry(data);
          } catch (e) {
            console.error('Error parsing telemetry data:', e);
          }
        };

        ws.onerror = (event) => {
          console.error('WebSocket error:', event);
          setError('WebSocket connection error');
          setConnected(false);
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setConnected(false);
          
          // Attempt to reconnect after 2 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connectWebSocket();
          }, 2000);
        };

        wsRef.current = ws;
      } catch (e) {
        console.error('Error creating WebSocket:', e);
        setError(String(e));
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { telemetry, connected, error };
}
