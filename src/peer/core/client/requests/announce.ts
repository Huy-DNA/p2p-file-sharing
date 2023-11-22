import { MessageType } from '../../../../common/protocol/types.js';
import { AnnounceRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import net from 'net';
import { AnnounceResponse, deserializeResponse } from '../../../../common/protocol/response.js';
import { extractAnnounceResponse } from '../../../../common/protocol/validators/response.js';

export default async function announce(
  connection: net.Socket,
): Promise<AnnounceResponse> {
  return new Promise((resolve) => {
    const request: AnnounceRequest = {
      type: MessageType.ANNOUNCE,
    };

    connection.write(serializeRequest(request));

    const announceListener = (message: string) => deserializeResponse(message)
      .chain(extractAnnounceResponse)
      .map(resolve)
      .map(() => connection.removeListener('message', announceListener));
    connection.on('message', announceListener);
  });
}
