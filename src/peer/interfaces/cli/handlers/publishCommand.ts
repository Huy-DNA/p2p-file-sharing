import net from 'net';
import { PublishStatus, deserializeResponse } from '../../../../common/protocol/response.js';
import path from 'path';
import { PublishRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import { MessageType } from '../../../../common/protocol/types.js';
import { getMessage } from '../../../../common/connection.js';
import { extractPublishResponse } from '../../../../common/protocol/validators/response.js';

export default async function handlePublishCommand(interfaceConnection: net.Socket, pathname: string): Promise<string> {
  const abspath = path.resolve(pathname);

  const request: PublishRequest = {
    type: MessageType.PUBLISH,
    headers: {
      filename: path.basename(abspath),
      abspath,
    },
  };

  interfaceConnection.write(serializeRequest(request));

  const response = await getMessage(interfaceConnection, {
    transform: (message) => deserializeResponse(message).chain(extractPublishResponse),
  });

  switch (response.status) {
    case PublishStatus.BAD_REQUEST:
      return `ERROR (${PublishStatus.BAD_REQUEST}): Bad Request`;
    case PublishStatus.OK:
      return `OK (${PublishStatus.OK}): Published successfully`;
    case PublishStatus.FILE_ALREADY_PUBLISHED:
      return `OK (${PublishStatus.FILE_ALREADY_PUBLISHED}): The file with this name is already published`;
    case PublishStatus.FILE_NOT_FOUND:
      return `ERROR (${PublishStatus.FILE_NOT_FOUND}): The file cannot be found locally`;
  }
}
