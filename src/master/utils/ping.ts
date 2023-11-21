import { MESSAGE_BOUNDARY } from '../../common/constants.js';
import { PingRequest, serializeRequest } from '../../common/protocol/requests.js';
import { PingResponse, PingStatus, deserializeResponse } from '../../common/protocol/response.js';
import { MessageType } from '../../common/protocol/types.js';
import { extractPingResponse } from '../../common/protocol/validators/response.js';
import net from 'net';

export default async function ping(hostname: string, port: number): Promise<PingResponse> {
  const pingRequest: PingRequest = {
    type: MessageType.PING,
    headers: {},
  };

  return new Promise((resolve) => {
    const socket = net.createConnection({ host: hostname, port, });
    socket.write(serializeRequest(pingRequest));

    let message = '';
    socket.on('data', (data) => {
      const messages = data.toString().split(MESSAGE_BOUNDARY);
      message += messages[0];
      if (messages.length > 1) {
        socket.end();
        const response = deserializeResponse(message + MESSAGE_BOUNDARY).and_then(extractPingResponse).unwrap();
        resolve(response);
      }
    });
    socket.on('error', () => {
      const response: PingResponse = {
        status: PingStatus.HOST_NOT_FOUND,
        type: MessageType.PING,
      }
      resolve(response);
    });
  });
}