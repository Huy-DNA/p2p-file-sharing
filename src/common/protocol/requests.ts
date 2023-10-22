import { None, Option, Some } from "../option/option.js";
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
  type: MessageType.PLSCONNECT;
  headers: {
    ip: string;
    port: number;
  };
}

export function validateRequest(req: Request): boolean {
  return req.headers === undefined || Object.values(req.headers).every((v) => typeof v === 'number' || typeof v === 'string' && v.indexOf(' ') === -1);
}

export function serializeRequest(req: Request): string {
  let result = '';

  result += req.type + '\r\n';
  
  if (req.headers) {
    result += Object.entries(req.headers).map((name, value) => `${name}: ${value}`).join('\r\n');
  }

  result += '\r\n\r\n';

  result += JSON.stringify(req.body);

  return result;
}

export function deserializeRequest(req: string): Option<Request> {
  const lines = req.split('\r\n');

  const requestLine = lines.shift()?.trim().toUpperCase();
  
  if (requestLine?.split(/\s+/).length !== 1 || !Object.keys(MessageType).includes(requestLine)) {
    return new None();
  }

  const result: Request = {
    type: requestLine.trim().toUpperCase() as MessageType,
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
