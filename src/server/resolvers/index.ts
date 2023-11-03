import net from 'net';
import { resolveResponse } from './responses/index.js';
import { resolveRequest } from './requests/index.js';

export function resolveMessage(connection: net.Socket, message: string) {
  if (message.slice(0, 3).toLowerCase() === 're:') {
    resolveResponse(connection, message);
  } else {
    resolveRequest(connection, message);
  }
}

