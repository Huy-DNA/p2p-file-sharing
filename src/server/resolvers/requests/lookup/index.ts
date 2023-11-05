import net from 'net';
import clientStore from '../../../stores/clients.js';
import { LookupRequest } from '../../../../common/protocol/requests.js';
import { MAX_LOOKUP_ENTRIES } from '../../../../common/constants.js';
import { LookupResponse, LookupStatus, serializeResponse } from '../../../../common/protocol/response.js';
import { MessageType } from '../../../../common/protocol/types.js';

export function resolveLookupRequest(connection: net.Socket, lookupRequest: LookupRequest) {
  const { headers: { filename } } = lookupRequest;
  const hosts: string[] = [];
  
  for (const [hostname, clientInfo] of clientStore) {
    if (clientInfo.files.has(filename)) {
      hosts.push(hostname);
    }
    if (hosts.length >= MAX_LOOKUP_ENTRIES) {
      break;
    }
  }

  const response: LookupResponse = {
    type: MessageType.LOOKUP,
    status: hosts.length === 0 ? LookupStatus.NOT_FOUND : LookupStatus.OK,
    body: hosts.length === 0 ? undefined : hosts,
  };

  connection.write(serializeResponse(response));
}
