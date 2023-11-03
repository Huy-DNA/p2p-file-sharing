import dotenv from 'dotenv';
import net from 'net';
import { resolveMessage } from './resolvers/index.js';

dotenv.config();
const { SERVER_PORT } = process.env;

const server = net.createServer((connection) => {
  console.log(` [+] Connection established with ${connection.remoteAddress}:${connection.remotePort}`);
  let message = '';
  connection.on('data', (data) => {
    const messages = (message + data.toString()).split('\r\n\r\n');
    message = messages.pop()!;
    messages.forEach((mes) => resolveMessage(connection, mes + '\r\n\r\n'));
  });
  connection.on('end', () => console.log(` [-] Connection torndown with ${connection.remoteAddress}:${connection.remotePort}`));
});

console.log(`Server listening on ${SERVER_PORT}...`);
server.listen(SERVER_PORT);

