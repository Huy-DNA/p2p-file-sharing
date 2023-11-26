import net from 'net';
import { DiscoverStatus, deserializeResponse } from '../../../../common/protocol/response.js';
import formatArray from '../utils/formatArray.js';
import { MessageType } from '../../../../common/protocol/types.js';
import { DiscoverRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import { getMessage } from '../../../../common/connection.js';
import { extractDiscoverResponse } from '../../../../common/protocol/validators/response.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handleDiscoverCommand(interfaceConnection: net.Socket, hostname: string): Promise<string> {
  const request: DiscoverRequest = {
    type: MessageType.DISCOVER,
    headers: {
      hostname,
    }
  }

  interfaceConnection.write(serializeRequest(request));

  const response = await getMessage(interfaceConnection, {
    transform: (message) => deserializeResponse(message).chain(extractDiscoverResponse),
  });
  
  switch (response.status) {
    case DiscoverStatus.BAD_REQUEST:
      return `ERROR (${DiscoverStatus.BAD_REQUEST}): Bad Request`;
    case DiscoverStatus.HOST_NOT_FOUND:
      return `ERROR (${DiscoverStatus.HOST_NOT_FOUND}): Host not found. Maybe it has disconnected?`;
    case DiscoverStatus.OK:
      return `OK (${DiscoverStatus.OK}): Ok` + `\n${formatArray(response.body!)}`;
  }
}
