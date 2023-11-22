import { MessageType } from '../../../../common/protocol/types.js';
import { DiscoverRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import net from 'net';
import { DiscoverResponse, deserializeResponse } from '../../../../common/protocol/response.js';
import { extractDiscoverResponse } from '../../../../common/protocol/validators/response.js';

export default async function discover(
  connection: net.Socket,
  hostname: string,
): Promise<DiscoverResponse> {
  return new Promise((resolve) => {
    if (!hostname) {
      throw new Error('Hostname must not be empty');
    }

    const request: DiscoverRequest = {
      headers: {
        hostname,
      },
      type: MessageType.DISCOVER,
    };

    connection.write(serializeRequest(request));

    const discoverListener = (message: string) => deserializeResponse(message)
      .chain(extractDiscoverResponse)
      .map(resolve)
      .map(() => connection.removeListener('message', discoverListener));
    connection.on('message', discoverListener);
  });
}
