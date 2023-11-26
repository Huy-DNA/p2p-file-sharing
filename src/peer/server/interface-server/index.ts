import dotenv from 'dotenv';
import net from 'net';
import { MESSAGE_BOUNDARY } from '../../../common/constants.js';
import { resolveRequest } from './resolvers/index.js';

dotenv.config();
const { PEER_INTERFACE_PORT } = process.env;

export const interfaceServer = net.createServer((interfaceConnection) => {
  console.log(` [+] Connection established with ${interfaceConnection.remoteAddress}:${interfaceConnection.remotePort}`);
  let message = '';
  interfaceConnection.on('data', (data) => {
    const messages = (message + data.toString()).split(MESSAGE_BOUNDARY);
    message = messages.pop()!;
    messages.forEach((mes) => resolveRequest(interfaceConnection, mes + MESSAGE_BOUNDARY));
  });
  interfaceConnection.on('end', () => console.log(` [-] Connection torndown with ${interfaceConnection.remoteAddress}:${interfaceConnection.remotePort}`));
  interfaceConnection.on('error', (e) => console.log(`  [#] Error with ${interfaceConnection.remoteAddress}:${interfaceConnection.remotePort} - ${e.message}`));
});

console.log(`Interface server listening on ${PEER_INTERFACE_PORT}...`);
interfaceServer.listen(PEER_INTERFACE_PORT);
