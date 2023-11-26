import net from 'net';
import { MESSAGE_BOUNDARY } from './constants.js';
import { Option } from './option/option.js';

export type Connection = net.Socket;

export function connect(host: string, port: number): Connection {
  const connection = net.createConnection({
    host,
    port,
  }, () => {
    let message = '';
    connection.on('data', (data) => {
      const messages = (message + data.toString()).split(MESSAGE_BOUNDARY);
      message = messages.pop()!;
      messages.forEach((m) => connection.emit('message', m + MESSAGE_BOUNDARY));
    });
  });

  return connection;
}

export async function getMessage(connection: Connection): Promise<string>;
export async function getMessage(connection: Connection, { filter } : {
  filter?: (message: string) => boolean;
}): Promise<string>;
export async function getMessage<T>(connection: Connection, { filter } : {
  transform: (message: string) => Option<T>;
  filter?: (message: string) => boolean;
}): Promise<T>;
export async function getMessage<T>(connection: Connection, { transform, filter } : {
  transform?: (message: string) => Option<T>,
  filter?: (message: string) => boolean,
} = {}): Promise<T | string> {
  return new Promise((resolve) => {
    const messageCallback = (message: string) => {
      if (filter && !filter(message)) {
        return;
      }
      if (transform) {
        const transformed = transform(message);
        if (!transformed.isOk()) {
          return;
        }
        resolve(transformed.unwrap());
      }
      resolve(message);
      connection.removeListener('message', messageCallback);
    };
    connection.on('message', messageCallback);
  })
}
