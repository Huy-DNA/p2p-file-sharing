import net from "net";
import { PublishRequest } from "../../../../common/protocol/requests.js";
import {
  PublishResponse,
  PublishStatus,
  serializeResponse,
} from "../../../../common/protocol/response.js";
import { MessageType } from "../../../../common/protocol/types.js";

export async function resolvePublishRequest(
  connection: net.Socket,
  publishRequest: PublishRequest
) {
  const response: PublishResponse = {
    type: MessageType.PUBLISH,
    status: PublishStatus.BAD_REQUEST,
  };
  connection.write(serializeResponse(response));
}
