import { MessageType } from '../../common/protocol/types.js';
import { PingRequest, serializeRequest } from '../../common/protocol/requests.js';
import net from 'net';
import dotenv from 'dotenv';
import { MESSAGE_BOUNDARY } from '../../common/constants.js';
import { extractPingResponse } from '../../common/protocol/validators/response.js';
import { PingStatus, deserializeResponse } from '../../common/protocol/response.js';

dotenv.config();

const { MASTER_PORT, MASTER_HOSTNAME } = process.env;

export default async function handlePingCommand(hostname: string): Promise<string> {
  const connection = net.createConnection({
    port: parseInt(MASTER_PORT!, 10),
    host: MASTER_HOSTNAME!,
  },);

  const request: PingRequest = {
    type: MessageType.PING,
    headers: {
      hostname,
    },
  };

  return new Promise((resolve) => {
    connection.write(serializeRequest(request));
    
    let message = '';
    connection.on('data', (data) => {
      const messages = data.toString().split(MESSAGE_BOUNDARY);
      message += messages[0];
      if (messages.length > 1) {
        connection.end();
        const response = deserializeResponse(message + MESSAGE_BOUNDARY).and_then(extractPingResponse).unwrap();
        resolve(response.status === PingStatus.PONG ? 'Pong' : 'No response');
      }
    });
    connection.on('error', () => {
      resolve('Cannot connect to server');
    });
  });
}
