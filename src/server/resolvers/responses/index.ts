import net from 'net';
import { DiscoverResponse, FetchResponse, LookupResponse, PingResponse, PublishResponse, deserializeResponse } from '../../../common/protocol/response.js';
import { MessageType } from '../../../common/protocol/types.js';
import { extractDiscoverResponse, extractFetchResponse, extractLookupResponse, extractPingResponse, extractPublishResponse } from '../../../common/protocol/validators/response.js';
import { resolveDiscoverResponse } from './discover/index.js';
import { resolveFetchResponse } from './fetch/index.js';
import { resolveLookupResponse } from './lookup/index.js';
import { resolvePingResponse } from './ping/index.js';
import { resolvePublishResponse } from './publish/index.js';

export function resolveResponse(connection: net.Socket, message: string) {
  let response = deserializeResponse(message).unwrap_or(undefined);
  switch (response?.type) {
    case MessageType.DISCOVER:
      response = extractDiscoverResponse(response).unwrap_or(undefined);
      if (response) {
        resolveDiscoverResponse(connection, response as DiscoverResponse);
      }
      break;
    case MessageType.FETCH:
      response = extractFetchResponse(response).unwrap_or(undefined);
      if (response) {
        resolveFetchResponse(connection, response as FetchResponse);
      }
      break;
    case MessageType.LOOKUP:
      response = extractLookupResponse(response).unwrap_or(undefined);
      if (response) {
        resolveLookupResponse(connection, response as LookupResponse);
      }
      break;
    case MessageType.PING:
      response = extractPingResponse(response).unwrap_or(undefined);
      if (response) {
        resolvePingResponse(connection, response as PingResponse);
      }
      break;
    case MessageType.PUBLISH:
      response = extractPublishResponse(response).unwrap_or(undefined);
      if (response) {
        resolvePublishResponse(connection, response as PublishResponse);
      }
      break;
  }
}
