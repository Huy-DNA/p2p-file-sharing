import dotenv from 'dotenv';
import net from 'net';
import { resolveMessage } from './resolvers/index.js';
import { MESSAGE_BOUNDARY } from '../common/constants.js';
import clientStore from './stores/clients.js';
import unalive from './utils/unalive.js';

dotenv.config();
const { SERVER_PORT, CLIENT_PORT } = process.env;

const server = net.createServer((connection) => {
  console.log(` [+] Connection established with ${connection.remoteAddress}:${connection.remotePort}`);
  let message = '';
  connection.on('data', (data) => {
    const messages = (message + data.toString()).split(MESSAGE_BOUNDARY);
    message = messages.pop()!;
    messages.forEach((mes) => resolveMessage(connection, mes + MESSAGE_BOUNDARY));
  });
  connection.on('end', () => console.log(` [-] Connection torndown with ${connection.remoteAddress}:${connection.remotePort}`));
  connection.on('error', (e) => console.log(`  [#] Error with ${connection.remoteAddress}:${connection.remotePort} - ${e.message}`));
});

console.log(`Server listening on ${SERVER_PORT}...`);
server.listen(SERVER_PORT);

setInterval(async () => {
  console.log(`[:] Server is scanning for unalive clients`);
  await Promise.all(
    Array.from(clientStore)
         .map(([hostname]) => unalive(hostname, Number.parseInt(CLIENT_PORT!, 10))),
  );
}, 60000);

