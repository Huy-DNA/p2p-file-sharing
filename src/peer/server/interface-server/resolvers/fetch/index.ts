import { FetchRequest, serializeRequest } from '../../../../../common/protocol/requests.js';
import { deserializeResponse, serializeResponse } from '../../../../../common/protocol/response.js';
import { extractFetchResponse } from '../../../../../common/protocol/validators/response.js';
import net from 'net';
import { connect } from '../../../../../common/connection.js';
import dotenv from 'dotenv';
dotenv.config();

const { PEER_PORT } = process.env;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function resolveFetchRequest(interfaceConnection: net.Socket, request: FetchRequest) {
  const peerConnection = connect(request.headers.hostname, Number.parseInt(PEER_PORT!));
  peerConnection.write(serializeRequest(request));

  const listener = (message: string) => deserializeResponse(message)
    .chain(extractFetchResponse)
    .map(serializeResponse)
    .map((mes) => interfaceConnection.write(mes))
    .map(() => peerConnection.removeListener('message', listener));
  peerConnection.on('message', listener);
}
