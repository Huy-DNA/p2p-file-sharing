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
  body?: {
    hostnames: string[];
  };
}

export enum LoginStatus {
  OK = 200,
  FAILED = 401,
  BAD_REQUEST = 400,
}

export interface LoginResponse extends Response {
  type: MessageType.LOGIN;
  status: LoginStatus;
  headers: {
    token?: string;
  }
}

export enum RegisterStatus {
  OK = 200,
  DUPLICATE_USERNAME = 409,
  BAD_REQUEST = 400,
}

export interface RegisterResponse extends Response {
  type: MessageType.REGISTER;
  status: RegisterStatus;
}

export enum LookupStatus {
  OK = 200,
  NOT_FOUND = 404,
}

export interface LookupResponse extends Response {
  type: MessageType.LOOKUP;
  status: LookupStatus;
  body?: {
    hostname: string;
    ip: string;
    port: number;
  }[];
}

export enum ConnectStatus {
  OK = 200,
  BAD_REQUEST = 400,
}

export interface ConnectResponse extends Response {
  type: MessageType.CONNECT;
  status: ConnectStatus,
}

export enum SelectStatus {
  OK = 200,
  TIMEOUT = 408,
  BAD_REQUEST = 400,
}

export interface SelectResponse extends Response {
  type: MessageType.SELECT;
  status: SelectStatus;
}

export enum PingStatus {
  PONG = 200,
  BAD_REQUEST = 400,
}

export interface PingResponse extends Response {
  type: MessageType.PING;
  status: PingStatus;
}

export enum PlsConnectStatus {
  OK = 200,
  BAD_REQUEST = 400,
}

export interface PlsConnectResponse extends Response {
  type: MessageType.PLSCONNECT;
  status: PlsConnectStatus;
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

  result += '\r\n\r\n';

  result += JSON.stringify(res.body);

  return result;
}

export function deserializeResponse(res: string): Option<Response> {
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
  const body = lines.join('\r\n');
  try {
    result.body = JSON.parse(body);
  } catch (e) {
    result.body = body;
  }

  return new Some(result);
}
