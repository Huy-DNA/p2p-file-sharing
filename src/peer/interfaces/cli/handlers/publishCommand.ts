import net from 'net';
import { PublishStatus, deserializeResponse } from '../../../../common/protocol/response.js';
import Repository from '../../../repository.js';
import path from 'path';
import { PublishRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import { MessageType } from '../../../../common/protocol/types.js';
import { getMessage } from '../../../../common/connection.js';
import { extractPublishResponse } from '../../../../common/protocol/validators/response.js';

export default async function handlePublishCommand(interfaceConnection: net.Socket, pathname: string): Promise<string> {
  const abspath = path.resolve(pathname);
  const repository = new Repository();

  if (await repository.has(path.basename(abspath))) {
    return `OK (${PublishStatus.OK}): The file is already published`;
  }

  try {
    await repository.add(path.basename(abspath), abspath);
  } catch (e) {
    return `ERROR: Failed while adding file to local repo`;
  }

  const request: PublishRequest = {
    type: MessageType.PUBLISH,
    headers: {
      filename: path.basename(abspath),
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
  }
}
