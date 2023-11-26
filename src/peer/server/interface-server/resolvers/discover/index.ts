import { DiscoverRequest, serializeRequest } from '../../../../../common/protocol/requests.js';
import { deserializeResponse, serializeResponse } from '../../../../../common/protocol/response.js';
import { extractDiscoverResponse } from '../../../../../common/protocol/validators/response.js';
import net from 'net';
import { masterConnection } from '../../../../masterConnection.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function resolveDiscoverRequest(interfaceConnection: net.Socket, request: DiscoverRequest) {
  masterConnection.write(serializeRequest(request));

  const listener = (message: string) => deserializeResponse(message)
    .chain(extractDiscoverResponse)
    .map(serializeResponse)
    .map((mes) => interfaceConnection.write(mes))
    .map(() => masterConnection.removeListener('message', listener));
  masterConnection.on('message', listener);
}