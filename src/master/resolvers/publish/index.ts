import net from 'net';
import { PublishResponse, PublishStatus, serializeResponse } from '../../../common/protocol/response.js';
import { PublishRequest } from '../../../common/protocol/requests.js';
import { MessageType } from '../../../common/protocol/types.js';
import clientStore from '../../stores/clients.js';
import { cleanupIp } from '../../../common/ip.js';

export function resolvePublishRequest(connection: net.Socket, publishRequest: PublishRequest) {
  const { headers: { filename } } = publishRequest;
  const ip = connection.remoteAddress && cleanupIp(connection.remoteAddress);

  let response: PublishResponse | undefined;
  if (!ip || !clientStore.get(ip)) {
    response = {
      type: MessageType.PUBLISH,
      status: PublishStatus.BAD_REQUEST,
    };
  } else {
    const clientInfo = clientStore.get(ip)!;
    clientInfo.files.add(filename);
    response = {
      type: MessageType.PUBLISH,
      status: PublishStatus.OK,
    };
  }

  connection.write(serializeResponse(response));
}
