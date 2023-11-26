import dotenv from "dotenv";
import net from "net";
import { resolveRequest } from "./resolvers/index.js";
import { MESSAGE_BOUNDARY } from "../../../common/constants.js";
import Repository from "../../repository.js";
import { AnnounceRequest, serializeRequest } from "../../../common/protocol/requests.js";
import { MessageType } from "../../../common/protocol/types.js";
import { masterConnection } from "../../masterConnection.js";
import { getMessage } from "../../../common/connection.js";
import { AnnounceStatus, deserializeResponse } from "../../../common/protocol/response.js";
import { extractAnnounceResponse } from "../../../common/protocol/validators/response.js";

dotenv.config();
const { PEER_PORT } = process.env;

export const startPeerServer = async function () {
  const repository = new Repository();
  await repository.init();

  const announceRequest: AnnounceRequest = {
    type: MessageType.ANNOUNCE,
  };
  
  masterConnection.write(serializeRequest(announceRequest));

  const response = await getMessage(masterConnection, {
    transform: (message) => deserializeResponse(message).chain(extractAnnounceResponse),
  });

  masterConnection.end();

  if (response.status !== AnnounceStatus.OK) {
    throw new Error("Announce failed");
  }

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

  return peerServer;
};

startPeerServer();
