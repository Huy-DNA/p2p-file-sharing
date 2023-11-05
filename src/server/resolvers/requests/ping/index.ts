import { PingResponse, PingStatus, serializeResponse } from '../../../../common/protocol/response.js';
import { PingRequest } from '../../../../common/protocol/requests.js';
import net from 'net';
import { MessageType } from '../../../../common/protocol/types.js';
import ping from '../../../utils/ping.js';

const { CLIENT_PORT } = process.env;

export async function resolvePingRequest(connection: net.Socket, pingRequest: PingRequest) {
  let { headers: { hostname } } = pingRequest;
  if (hostname === undefined) {
    const response: PingResponse = {
      type: MessageType.PING,
      status: PingStatus.BAD_REQUEST,
    };
    connection.write(serializeResponse(response));
    return;
  }

  hostname = hostname.trim();
  
  const response = await ping(hostname, parseInt(CLIENT_PORT!, 10));
  connection.write(serializeResponse(response));
}
