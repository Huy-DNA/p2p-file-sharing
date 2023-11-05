import { MESSAGE_BOUNDARY } from '../../common/constants.js';
import { DiscoverRequest, serializeRequest } from '../../common/protocol/requests.js';
import { DiscoverStatus, deserializeResponse } from '../../common/protocol/response.js';
import { MessageType } from '../../common/protocol/types.js';
import { extractDiscoverResponse } from '../../common/protocol/validators/response.js';
import net from 'net';
import dotenv from 'dotenv';

dotenv.config();

const { SERVER_PORT, SERVER_HOSTNAME } = process.env;

export default async function handleDiscoverCommand(hostname: string): Promise<string> {
  const connection = net.createConnection({
    port: parseInt(SERVER_PORT!, 10),
    host: SERVER_HOSTNAME!,
  },);

  const request: DiscoverRequest = {
    type: MessageType.DISCOVER,
    headers: {
      hostname
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
        const response = deserializeResponse(message + MESSAGE_BOUNDARY).and_then(extractDiscoverResponse).unwrap();
        if (response.status === DiscoverStatus.OK) {
          const hosts = response.body!;
          resolve(hosts.length === 0 ? '<Empty>' : hosts.join('\n'));
        } else if (response.status === DiscoverStatus.HOST_NOT_FOUND) {
          resolve('Host not found');
        } else {
          resolve('Something wrong has happened');
        }
      }
    });
    connection.on('error', () => {
      resolve('Cannot connect to server');
    });
  });
}
