import dotenv from "dotenv";
import net from "net";
import { resolveRequest } from "./resolvers/index.js";
import { MESSAGE_BOUNDARY } from "../../../common/constants.js";
import Repository from "../client/repository.js";

dotenv.config();
const { PEER_PORT } = process.env;

export default function startPeerServer(repository: Repository) {
  const peerServer = net.createServer((connection) => {
    let message = '';
    connection.on('data', (data) => {
      const messages = (message + data.toString()).split(MESSAGE_BOUNDARY);
      message = messages.pop()!;
      messages.forEach((mes) => resolveRequest(connection, repository, mes + MESSAGE_BOUNDARY));
    });
  });
  console.log(`Peer server listening on ${PEER_PORT}...`);
  peerServer.listen(Number.parseInt(PEER_PORT!));
}