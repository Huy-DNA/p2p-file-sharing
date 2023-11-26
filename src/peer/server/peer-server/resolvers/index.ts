import net from "net";
import {
  AnnounceRequest,
  DiscoverRequest,
  FetchRequest,
  LookupRequest,
  PingRequest,
  PublishRequest,
  deserializeRequest,
} from "../../../../common/protocol/requests.js";
import { MessageType } from "../../../../common/protocol/types.js";
import {
  extractAnnounceRequest,
  extractDiscoverRequest,
  extractFetchRequest,
  extractLookupRequest,
  extractPingRequest,
  extractPublishRequest,
} from "../../../../common/protocol/validators/requests.js";
import { resolveDiscoverRequest } from "./discover/index.js";
import { resolveFetchRequest } from "./fetch/index.js";
import { resolveLookupRequest } from "./lookup/index.js";
import { resolvePingRequest } from "./ping/index.js";
import { resolvePublishRequest } from "./publish/index.js";
import {
  UnknownResponse,
  serializeResponse,
} from "../../../../common/protocol/response.js";
import { resolveAnnounceRequest } from "./announce/index.js";
import Repository from "../../../repository.js";

export function resolveRequest(connection: net.Socket, repository: Repository,message: string) {
  let request = deserializeRequest(message).unwrap_or(undefined);
  switch (request?.type) {
    case MessageType.DISCOVER:
      request = extractDiscoverRequest(request).unwrap_or(undefined);
      if (request) {
        resolveDiscoverRequest(connection, repository, request as DiscoverRequest);
      }
      break;
    case MessageType.FETCH:
      request = extractFetchRequest(request).unwrap_or(undefined);
      if (request) {
        resolveFetchRequest(connection, repository, request as FetchRequest);
      }
      break;
    case MessageType.LOOKUP:
      request = extractLookupRequest(request).unwrap_or(undefined);
      if (request) {
        resolveLookupRequest(connection, repository, request as LookupRequest);
      }
      break;
    case MessageType.PING:
      request = extractPingRequest(request).unwrap_or(undefined);
      if (request) {
        resolvePingRequest(connection, repository, request as PingRequest);
      }
      break;
    case MessageType.PUBLISH:
      request = extractPublishRequest(request).unwrap_or(undefined);
      if (request) {
        resolvePublishRequest(connection, repository, request as PublishRequest);
      }
      break;
    case MessageType.ANNOUNCE:
      request = extractAnnounceRequest(request).unwrap_or(undefined);
      if (request) {
        resolveAnnounceRequest(connection, repository, request as AnnounceRequest);
      }
      break;
  }

  if (!request) {
    const unknownResponse: UnknownResponse = {
      type: MessageType.UNKNOWN,
      status: 200,
    };
    connection.write(serializeResponse(unknownResponse));
  }
}
