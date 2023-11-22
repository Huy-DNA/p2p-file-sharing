import { MessageType } from '../../../../common/protocol/types.js';
import { LookupRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import net from 'net';
import { LookupResponse, deserializeResponse } from '../../../../common/protocol/response.js';
import { extractLookupResponse } from '../../../../common/protocol/validators/response.js';

export default function lookup(
  connection: net.Socket,
  filename: string,
): Promise<LookupResponse> {
  return new Promise((resolve) => {
    if (!filename) {
      throw new Error("Filename can not be empty");
    }

    const request: LookupRequest = {
      headers: {
        filename
      },
      type: MessageType.LOOKUP,
    };

    connection.write(serializeRequest(request));

    const lookupListener = (message: string) => deserializeResponse(message)
      .chain(extractLookupResponse)
      .map(resolve)
      .map(() => connection.removeListener('message', lookupListener));
    connection.on('message', lookupListener);
  });
}
