import net from 'net';
import Joi from 'joi';
import { DiscoverRequest } from '../../../../common/protocol/requests.js';
import * as dns from '../../../../common/dns.js';
import clientStore from '../../../stores/clients.js';
import { DiscoverResponse, DiscoverStatus, serializeResponse } from '../../../../common/protocol/response.js';
import { MessageType } from '../../../../common/protocol/types.js';

export async function resolveDiscoverRequest(connection: net.Socket, discoverRequest: DiscoverRequest) {
  const { headers: { hostname } } = discoverRequest;
  let response: DiscoverResponse | undefined;

  try {
    const ip = Joi.string().trim().ip().validate(hostname).error ? (await dns.lookup(hostname)).address : hostname;
    const clientInfo = clientStore.get(ip);
    if (!clientInfo) {
      response = {
        type: MessageType.DISCOVER,
        status: DiscoverStatus.HOST_NOT_FOUND,
      };
    } else {
      response = {
        type: MessageType.DISCOVER,
        status: DiscoverStatus.OK,
        body: Array.from(clientInfo.files),
      };
    }
  } catch (e) {
    response = {
      type: MessageType.DISCOVER,
      status: DiscoverStatus.HOST_NOT_FOUND,
    };
  }

  connection.write(serializeResponse(response));
}
