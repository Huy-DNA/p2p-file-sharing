import { MessageType } from '../../../../common/protocol/types.js';
import { PublishRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import net from 'net';
import { PublishResponse, deserializeResponse } from '../../../../common/protocol/response.js';
import { extractPublishResponse } from '../../../../common/protocol/validators/response.js';

export default function publish(
  connection: net.Socket,
  filename: string,
): Promise<PublishResponse> {
  return new Promise((resolve) => {
    if (!filename) {
      throw new Error("Filename can not be empty");
    }

    const request: PublishRequest = {
      headers: {
        filename,
      },
      type: MessageType.PUBLISH,
    };

    connection.write(serializeRequest(request));

    const publishListener = (message: string) => deserializeResponse(message)
      .chain(extractPublishResponse)
      .map(resolve)
      .map(() => connection.removeListener('message', publishListener));
    connection.on('message', publishListener);
  });
}
