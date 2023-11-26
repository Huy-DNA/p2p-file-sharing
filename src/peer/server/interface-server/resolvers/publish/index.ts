import { PublishRequest, serializeRequest } from '../../../../../common/protocol/requests.js';
import { PublishResponse, PublishStatus, deserializeResponse, serializeResponse } from '../../../../../common/protocol/response.js';
import { extractPublishResponse } from '../../../../../common/protocol/validators/response.js';
import net from 'net';
import { masterConnection } from '../../../../masterConnection.js';
import Repository from '../../../../repository.js';
import { MessageType } from '../../../../../common/protocol/types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function resolvePublishRequest(interfaceConnection: net.Socket, request: PublishRequest) {
  const {
    filename,
    abspath
  } = request.headers;
  
  if (abspath === undefined) {
    const response: PublishResponse = {
      type: MessageType.PUBLISH,
      status: PublishStatus.BAD_REQUEST,
    };
    interfaceConnection.write(serializeResponse(response));
    
    return;
  }

  const repository = new Repository();
  
  if (await repository.has(filename)) {
    const response: PublishResponse = {
      type: MessageType.PUBLISH,
      status: PublishStatus.FILE_ALREADY_PUBLISHED,
    };
    interfaceConnection.write(serializeResponse(response));
    
    return;
  }

  try {
    await repository.add(filename, abspath);
  } catch (e) {
    const response: PublishResponse = {
      type: MessageType.PUBLISH,
      status: PublishStatus.FILE_NOT_FOUND,
    };
    interfaceConnection.write(serializeResponse(response));
    
    return;
  }

  masterConnection.write(serializeRequest(request));

  const listener = (message: string) => deserializeResponse(message)
    .chain(extractPublishResponse)
    .map((res) => {
      if (res.status !== PublishStatus.OK) {
        repository.remove(filename);
      }
      return res;
    })
    .map(serializeResponse)
    .map((mes) => interfaceConnection.write(mes))
    .map(() => masterConnection.removeListener('message', listener));
  masterConnection.on('message', listener);
}
