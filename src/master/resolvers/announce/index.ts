import clientStore from '../../stores/clients.js';
import { AnnounceRequest } from '../../../common/protocol/requests.js';
import net from 'net';
import { AnnounceResponse, AnnounceStatus, serializeResponse } from '../../../common/protocol/response.js';
import { MessageType } from '../../../common/protocol/types.js';
import { cleanupIp } from '../../../common/ip.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function resolveAnnounceRequest(connection: net.Socket, announceRequest: AnnounceRequest) {
  const ip = connection.remoteAddress && cleanupIp(connection.remoteAddress);
  let response: AnnounceResponse | undefined;

  if (!ip) {
    response = {
      type: MessageType.ANNOUNCE,
      status: AnnounceStatus.BAD_REQUEST,
    };
  } else {
    clientStore.set(ip, {
      hostname: ip,
      files: new Set(),
    });
    response = {
      type: MessageType.ANNOUNCE,
      status: AnnounceStatus.OK,
    };
  }

  connection.write(serializeResponse(response));
}
