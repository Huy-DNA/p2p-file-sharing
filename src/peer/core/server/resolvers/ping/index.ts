import {
  PingResponse,
  PingStatus,
  serializeResponse,
} from "../../../../../common/protocol/response.js";
import { PingRequest } from "../../../../../common/protocol/requests.js";
import net from "net";
import { MessageType } from "../../../../../common/protocol/types.js";
import Repository from "../../../../core/client/repository.js";

export async function resolvePingRequest(
  connection: net.Socket,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  repository: Repository,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pingRequest: PingRequest
) {
  const response: PingResponse = {
    type: MessageType.PING,
    status: PingStatus.PONG,
  };
  connection.write(serializeResponse(response)); 
}
