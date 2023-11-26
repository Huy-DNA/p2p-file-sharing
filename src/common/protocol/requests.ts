import { HEADER_BODY_SEPARATOR, MESSAGE_BOUNDARY } from "../../common/constants.js";
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
    hostname?: string;
  };
}

export interface PublishRequest extends Request {
  type: MessageType.PUBLISH;
  headers: {
    filename: string;
    abspath?: string; // Only meant to be used locally
  }
}

export interface DiscoverRequest extends Request {
  type: MessageType.DISCOVER;
  headers: {
    hostname: string;
  };
}

export interface LookupRequest extends Request {
  type: MessageType.LOOKUP;
  headers: {
    filename: string;
  };
}

export interface PingRequest extends Request {
  type: MessageType.PING;
  headers: {
    hostname?: string;
  };
}

export interface AnnounceRequest extends Request {
  type: MessageType.ANNOUNCE;
}

export function validateRequest(req: Request): boolean {
  return req.headers === undefined || Object.values(req.headers).every((v) => typeof v === 'number' || typeof v === 'string' && v.indexOf(' ') === -1);
}

export function serializeRequest(req: Request): string {
  let result = '';

  result += req.type;
  
  if (req.headers) {
    result += Object.entries(req.headers).map(([name, value]) => `\r\n${name}: ${value}`).join('');
  }

  if (req.body !== undefined) {
    result += HEADER_BODY_SEPARATOR;
    result += typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  result += MESSAGE_BOUNDARY;

  return result;
}

export function deserializeRequest(req: string): Option<Request> {
  if (!req.endsWith(MESSAGE_BOUNDARY)) {
    return new None();
  }

  req = req.slice(0, req.length - MESSAGE_BOUNDARY.length);

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
