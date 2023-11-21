import net from "net";
import { DiscoverRequest } from "../../../../../../common/protocol/requests.js";
import {
  DiscoverResponse,
  DiscoverStatus,
  serializeResponse,
} from "../../../../../../common/protocol/response.js";
import { MessageType } from "../../../../../../common/protocol/types.js";

export async function resolveDiscoverRequest(
  connection: net.Socket,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  discoverRequest: DiscoverRequest
) {
  const response: DiscoverResponse = {
    type: MessageType.DISCOVER,
    status: DiscoverStatus.BAD_REQUEST,
  };
  connection.write(serializeResponse(response));
}
