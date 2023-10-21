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
  body: string;
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
  body: {
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
  body: {
    ip: string;
    port: number;
  }[];
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
  type: MessageType.PLS_CONNECT;
  status: PlsConnectStatus;
}
