import { MessageType } from "./types.js";

export interface Request {
  type: MessageType;
  headers?: { [index: string]: unknown; };
  body?: unknown;
}

export interface FetchRequest extends Request {
  type: MessageType.FETCH;
  headers: {
    filename: string;
  };
}

export interface PublishRequest extends Request {
  type: MessageType.PUBLISH;
  headers: {
    token: string;
  };
}

export interface DiscoverRequest extends Request {
  type: MessageType.DISCOVER;
  headers: {
    hostname: string;
  };
}

export interface LoginRequest extends Request {
  type: MessageType.LOGIN;
  headers: {
    name: string;
    password: string;
    ip: string;
    port: number;
  };
}

export interface RegisterRequest extends Request {
  type: MessageType.REGISTER;
  headers: {
    name: string;
    password: string;
  };
}

export interface LookupRequest extends Request {
  type: MessageType.LOOKUP;
  headers: {
    filename: string;
  };
}

export interface ConnectRequest extends Request {
  type: MessageType.CONNECT;
}

export interface SelectRequest extends Request {
  type: MessageType.SELECT;
  headers: {
    token: string;
  };
}

export interface PingRequest extends Request {
  type: MessageType.PING;
}

export interface PlsConnectRequest extends Request {
  type: MessageType.PLS_CONNECT;
  headers: {
    ip: string;
    port: string;
  };
}
