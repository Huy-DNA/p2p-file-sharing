import http from 'http';
import { AnnounceRequest, DiscoverRequest, FetchRequest, LookupRequest, PublishRequest, deserializeRequest } from '../../../../common/protocol/requests.js';
import { MessageType } from '../../../../common/protocol/types.js';
import { extractAnnounceRequest, extractDiscoverRequest, extractFetchRequest, extractLookupRequest, extractPublishRequest } from '../../../../common/protocol/validators/requests.js';
import { resolveDiscoverRequest } from './discover/index.js';
import { resolveFetchRequest } from './fetch/index.js';
import { resolveLookupRequest } from './lookup/index.js';
import { resolvePublishRequest } from './publish/index.js';
import { UnknownResponse, serializeResponse } from '../../../../common/protocol/response.js';
import { resolveAnnounceRequest } from './announce/index.js';

export async function resolveRequest(interfaceConnection: http.ServerResponse, message: string) {
  let request = deserializeRequest(message).unwrap_or(undefined);
  switch (request?.type) {
    case MessageType.DISCOVER:
      request = extractDiscoverRequest(request).unwrap_or(undefined);
      if (request) {
        resolveDiscoverRequest(interfaceConnection, request as DiscoverRequest);
      }
      break;
    case MessageType.FETCH:
      request = extractFetchRequest(request).unwrap_or(undefined);
      if (request) {
        resolveFetchRequest(interfaceConnection, request as FetchRequest);
      }
      break;
    case MessageType.LOOKUP:
      request = extractLookupRequest(request).unwrap_or(undefined);
      if (request) {
        resolveLookupRequest(interfaceConnection, request as LookupRequest);
      }
      break;
    case MessageType.PUBLISH:
      request = extractPublishRequest(request).unwrap_or(undefined);
      if (request) {
        resolvePublishRequest(interfaceConnection, request as PublishRequest);
      }
      break;
    case MessageType.ANNOUNCE:
      request = extractAnnounceRequest(request).unwrap_or(undefined);
      if (request) {
        resolveAnnounceRequest(interfaceConnection, request as AnnounceRequest);
      }
      break;
  }

  if (!request) { 
    const unknownResponse: UnknownResponse = {
      type: MessageType.UNKNOWN,
      status: 200,
    };
    interfaceConnection.write(serializeResponse(unknownResponse));
    interfaceConnection.end();
  }
}
