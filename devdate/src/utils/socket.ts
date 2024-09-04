import { io } from 'socket.io-client';

export const socket = io('https://date-dev.vercel.app', {
  transports: ['websocket', 'polling'],
});
