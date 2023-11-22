import { MessageType } from '../../../../common/protocol/types.js';
import { FetchRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import net from 'net';
import { FetchResponse, deserializeResponse } from '../../../../common/protocol/response.js';
import { extractFetchResponse } from '../../../../common/protocol/validators/response.js';

export default function fetch(
  connection: net.Socket,
  filename: string,
): Promise<FetchResponse> {
  return new Promise((resolve) => {
    if (!filename) {
      throw new Error("Filename can not be empty");
    }

    const request: FetchRequest = {
      headers: {
        filename,
      },
      type: MessageType.FETCH,
    };

    connection.write(serializeRequest(request));

    const fetchListener = (message: string) => deserializeResponse(message)
      .chain(extractFetchResponse)
      .map(resolve)
      .map(() => connection.removeListener('message', fetchListener));
    connection.on('message', fetchListener);
  });
}
