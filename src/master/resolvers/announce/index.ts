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
    const clientRecord = clientStore.get(ip);
    if (!clientRecord) {
      clientStore.set(ip, {
        hostname: ip,
        files: new Set(),
        deathFlag: false,
      });
    } else {
      clientRecord.files = new Set();
      clientRecord.deathFlag = false;
    }
    response = {
      type: MessageType.ANNOUNCE,
      status: AnnounceStatus.OK,
    };
  }

  connection.write(serializeResponse(response));
}
