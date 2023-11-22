import { FetchResponse, FetchStatus, serializeResponse } from '../../../common/protocol/response.js';
import { FetchRequest } from '../../../common/protocol/requests.js';
import net from 'net';
import { MessageType } from '../../../common/protocol/types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function resolveFetchRequest(connection: net.Socket, fetchRequest: FetchRequest) {
  const response: FetchResponse = {
    type: MessageType.FETCH,
    status: FetchStatus.BAD_REQUEST,
  };
  connection.write(serializeResponse(response));
}
