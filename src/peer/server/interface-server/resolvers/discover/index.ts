import { DiscoverRequest, serializeRequest } from '../../../../../common/protocol/requests.js';
import { DiscoverResponse, DiscoverStatus, deserializeResponse, serializeResponse } from '../../../../../common/protocol/response.js';
import { extractDiscoverResponse } from '../../../../../common/protocol/validators/response.js';
import http from 'http';
import { masterConnection } from '../../../../masterConnection.js';
import { cleanupIp } from '../../../../../common/ip.js';
import Repository from '../../../../repository.js';
import { MessageType } from '../../../../../common/protocol/types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function resolveDiscoverRequest(interfaceConnection: http.ServerResponse, request: DiscoverRequest) {
  if (cleanupIp(request.headers.hostname) === '0.0.0.0') {
    const repository = new Repository();
    const files = await repository.getAll();
    const response: DiscoverResponse = {
      type: MessageType.DISCOVER,
      status: DiscoverStatus.OK,
      body: files,
    }
    interfaceConnection.write(serializeResponse(response));
    interfaceConnection.end();
    return;
  }

  masterConnection.write(serializeRequest(request));

  const listener = (message: string) => deserializeResponse(message)
    .chain(extractDiscoverResponse)
    .map(serializeResponse)
    .map((mes) => interfaceConnection.write(mes))
    .map(() => interfaceConnection.end())
    .map(() => masterConnection.removeListener('message', listener));
  masterConnection.on('message', listener);
}