import net from 'net';
import { resolveRequest } from './requests/index.js';

export function resolveMessage(connection: net.Socket, message: string) {
  resolveRequest(connection, message);
}

