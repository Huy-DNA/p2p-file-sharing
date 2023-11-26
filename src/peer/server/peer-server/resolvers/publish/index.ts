import net from "net";
import { PublishRequest } from "../../../../../common/protocol/requests.js";
import {
  PublishResponse,
  PublishStatus,
  serializeResponse,
} from "../../../../../common/protocol/response.js";
import { MessageType } from "../../../../../common/protocol/types.js";
import Repository from "../../../../repository.js";

export async function resolvePublishRequest(
  connection: net.Socket,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  repository: Repository,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  publishRequest: PublishRequest
) {
  const response: PublishResponse = {
    type: MessageType.PUBLISH,
    status: PublishStatus.BAD_REQUEST,
  };
  connection.write(serializeResponse(response));
}
