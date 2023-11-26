import dotenv from 'dotenv';
import http from 'http';
import { resolveRequest } from './resolvers/index.js';

dotenv.config();
const { PEER_INTERFACE_PORT } = process.env;

export const startInterfaceServer = async function () {
  const interfaceServer = http.createServer(async (req, res) => {
    if (req.url !== '/') {
      return;
    }
    const bodyChunks: Uint8Array[] = [];
    const body: string = await new Promise(
      (resolve) => req
        .on('data', (chunk) => bodyChunks.push(chunk))
        .on('end', () => resolve(Buffer.concat(bodyChunks).toString()))
    );
    resolveRequest(res, body);
  });
  interfaceServer.on('connection', (connection) => {
    console.log(` [+] Connection established with ${connection.remoteAddress}:${connection.remotePort}`);
    connection.on('end', () => console.log(` [-] Connection torndown with ${connection.remoteAddress}:${connection.remotePort}`));
    connection.on('error', (e) => console.log(`  [#] Error with ${connection.remoteAddress}:${connection.remotePort} - ${e.message}`));
  });
  console.log(`Peer interface server listening on ${PEER_INTERFACE_PORT}...`);
  interfaceServer.listen(Number.parseInt(PEER_INTERFACE_PORT!));

  return interfaceServer;
}

startInterfaceServer();
