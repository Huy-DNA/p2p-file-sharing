import { AnnounceRequest } from "../../../../../common/protocol/requests.js";
import net from "net";
import {
  AnnounceResponse,
  AnnounceStatus,
  serializeResponse,
} from "../../../../../common/protocol/response.js";
import { MessageType } from "../../../../../common/protocol/types.js";
import Repository from "../../../../repository.js";

export function resolveAnnounceRequest(
  connection: net.Socket,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  repository: Repository,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  announceRequest: AnnounceRequest,
) {
  const response: AnnounceResponse = {
    type: MessageType.ANNOUNCE,
    status: AnnounceStatus.BAD_REQUEST,
  };
  connection.write(serializeResponse(response));
}
