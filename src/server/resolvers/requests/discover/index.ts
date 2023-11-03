import net from 'net';
import dotenv from 'dotenv';
import { DiscoverRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import { DiscoverResponse, DiscoverStatus, serializeResponse } from '../../../../common/protocol/response.js';
import { MessageType } from '../../../../common/protocol/types.js';

dotenv.config();

const { CLIENT_PORT } = process.env;

export function resolveDiscoverRequest(connection: net.Socket, discoverRequest: DiscoverRequest) {
  let { headers: { hostname } } = discoverRequest;
  hostname = hostname.trim();

  const socket = net.createConnection({ host: hostname, port: Number.parseInt(CLIENT_PORT!, 10), });
  socket.write(serializeRequest(discoverRequest));
  let message = '';
  socket.on('data', (data) => {
    const messages = data.toString().split('\r\n\r\n');
    message += messages[0];
    if (messages.length > 1) {
      connection.write(message);
      socket.end();
    }
  });
  socket.on('error', () => {
    const response: DiscoverResponse = {
      status: DiscoverStatus.HOST_NOT_FOUND,
      type: MessageType.DISCOVER,
    }
    connection.write(serializeResponse(response));
  });
}