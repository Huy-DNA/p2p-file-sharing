import { HEADER_BODY_SEPARATOR, MESSAGE_BOUNDARY } from "../../common/constants.js";
import { None, Option, Some } from "../option/option.js";
import { MessageType } from "./types.js";

export interface Response {
  type: MessageType;
  status: unknown;
  headers?: { [index: string]: unknown; };
  body?: unknown;
}

export enum FetchStatus {
  FILE_NOT_FOUND = 404,
  OK = 200,
  BAD_REQUEST = 400,
}

export interface FetchResponse extends Response {
  type: MessageType.FETCH;
  status: FetchStatus;
  body?: string;
}

export enum PublishStatus {
  OK = 200,
  DUPLICATE_NAME = 409,
  BAD_REQUEST = 400,
}

export interface PublishResponse extends Response {
  type: MessageType.PUBLISH;
  status: PublishStatus;
}

export enum DiscoverStatus {
  OK = 200,
  HOST_NOT_FOUND = 404,
  HOST_DISCONNECTED = 410,
  BAD_REQUEST = 400,
}

export interface DiscoverResponse extends Response {
  type: MessageType.DISCOVER;
  status: DiscoverStatus;
  body?: string[];
}

export enum LoginStatus {
  OK = 200,
  FAILED = 401,
  BAD_REQUEST = 400,
}

export enum LookupStatus {
  OK = 200,
  NOT_FOUND = 404,
}

export interface LookupResponse extends Response {
  type: MessageType.LOOKUP;
  status: LookupStatus;
  body?: string[];
}

export enum PingStatus {
  PONG = 200,
  BAD_REQUEST = 400,
  HOST_NOT_FOUND = 404,
}

export interface PingResponse extends Response {
  type: MessageType.PING;
  status: PingStatus;
}

export enum AnnounceStatus {
  OK = 200,
  BAD_REQUEST = 400,
}

export interface AnnounceResponse extends Response {
  type: MessageType.ANNOUNCE;
  status: AnnounceStatus;
}

export interface UnknownResponse extends Response {
  type: MessageType.UNKNOWN;
  status: 200;
}

export function validateResponse(res: Response): boolean {
  return res.headers === undefined || Object.values(res.headers).every((v) => typeof v === 'string' && v.indexOf(' ') === -1 || typeof v === 'number');
}

export function serializeResponse(res: Response): string {
  let result = '';

  result += `re:${res.type} ${res.status}`;
  
  if (res.headers) {
    result += Object.entries(res.headers).map(([name, value]) => `\r\n${name}: ${value}`).join('');
  }

  result += HEADER_BODY_SEPARATOR;

  if (res.body !== undefined) {
    result += typeof res.body === 'string' ? res.body : JSON.stringify(res.body);
  }

  result += MESSAGE_BOUNDARY;

  return result;
}

export function deserializeResponse(res: string): Option<Response> {
  if (!res.endsWith(MESSAGE_BOUNDARY)) {
    return new None();
  }

  res = res.slice(0, res.length - MESSAGE_BOUNDARY.length);
  
  const lines = res.split('\r\n');

  let statusLine = lines.shift()?.trim();
  if (!statusLine?.slice(0, 3).match(/re:/i)) {
    return new None();
  }
  statusLine = statusLine.slice(3);

  if (statusLine?.trim().split(/\s+/).length !== 2) {
    return new None();
  }

  const [type, status] = statusLine.trim().split(/\s+/);
  if (Number.isNaN(Number.parseInt(status, 10))) {
    return new None();
  }

  if (!Object.keys(MessageType).includes(type.trim().toUpperCase())) {
    return new None();
  }

  const result: Response = {
    type: type.trim().toUpperCase() as MessageType,
    status: Number.parseInt(status, 10),
    headers: {},
    body: undefined,
  };

  while (lines.length > 0 && lines[0].trim() !== '') {
    const headerLine = lines.shift()!.trim();
    const [name, ...values] = headerLine.split(':');
    result.headers![name.toLowerCase()] = values.join(':').trim();
  }

  lines.shift();
  const body = lines.join('\r\n') || undefined;

  if (body !== undefined) {
    try {
      result.body = JSON.parse(body);
    } catch (e) {
      result.body = body;
    }
  }

  return new Some(result);
}
