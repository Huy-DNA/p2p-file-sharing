import dotenv from "dotenv";
import net from "net";
import { MESSAGE_BOUNDARY } from "../../../common/constants.js";

dotenv.config();
const { MASTER_PORT, MASTER_HOSTNAME, PEER_PORT } = process.env;

export function connectServer(): net.Socket {
  const connection = net.createConnection({
    host: MASTER_HOSTNAME,
    port: Number.parseInt(MASTER_PORT!),  
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

export function connectPeer(peer: string): net.Socket {
  const port = Number.parseInt(PEER_PORT!); 
  const connection = net.createConnection({
    host: peer,
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
