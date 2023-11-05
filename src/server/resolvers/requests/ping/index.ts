import { PingResponse, PingStatus, serializeResponse } from '../../../../common/protocol/response.js';
import { PingRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import net from 'net';
import { MessageType } from '../../../../common/protocol/types.js';
import { MESSAGE_BOUNDARY } from '../../../../common/constants.js';

const { CLIENT_PORT } = process.env;

export function resolvePingRequest(connection: net.Socket, pingRequest: PingRequest) {
  let { headers: { hostname } } = pingRequest;
  if (hostname === undefined) {
    const response: PingResponse = {
      type: MessageType.PING,
      status: PingStatus.BAD_REQUEST,
    };
    connection.write(serializeResponse(response));
    return;
  }

  hostname = hostname.trim();
  
  const socket = net.createConnection({ host: hostname, port: Number.parseInt(CLIENT_PORT!, 10), });
  socket.write(serializeRequest(pingRequest));
  let message = '';
  socket.on('data', (data) => {
    const messages = data.toString().split(MESSAGE_BOUNDARY);
    message += messages[0];
    if (messages.length > 1) {
      connection.write(message + MESSAGE_BOUNDARY);
      socket.end();
    }
  });
  socket.on('error', () => {
    const response: PingResponse = {
      status: PingStatus.HOST_NOT_FOUND,
      type: MessageType.PING,
    }
    connection.write(serializeResponse(response));
  });
}