import dotenv from 'dotenv';
import http from 'http';
import { resolveRequest } from './resolvers/index.js';

dotenv.config();
const { PEER_INTERFACE_PORT } = process.env;

export const startInterfaceServer = async function () {
  const interfaceServer = http.createServer(async (req, res) => {
    console.log(` [+] Request sent from ${req.socket.remoteAddress}:${req.socket.remotePort}`);
    req.on('close', () => console.log(` [-] Request finished on ${req.socket.remoteAddress}:${req.socket.remotePort}`));
    req.on('error', (e) => console.log(`  [#] Error with ${req.socket.remoteAddress}:${req.socket.remotePort} - ${e.message}`));

    if (req.url !== '/') {
      return;
    }
    const bodyChunks: Uint8Array[] = [];
    const body: string = await new Promise(
      (resolve) => req
        .on('data', (chunk) => bodyChunks.push(chunk))
        .on('end', () => resolve(Buffer.concat(bodyChunks).toString()))
    );
    res.appendHeader('Access-Control-Allow-Origin', '*');
    resolveRequest(res, body);
  });
  console.log(`Peer interface server listening on ${PEER_INTERFACE_PORT}...`);
  interfaceServer.listen(Number.parseInt(PEER_INTERFACE_PORT!));

  return interfaceServer;
}

startInterfaceServer();
