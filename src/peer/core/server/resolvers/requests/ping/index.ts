import {
  PingResponse,
  PingStatus,
  serializeResponse,
} from "../../../../../../common/protocol/response.js";
import { PingRequest } from "../../../../../../common/protocol/requests.js";
import net from "net";
import { MessageType } from "../../../../../../common/protocol/types.js";
import os from "os";

export async function resolvePingRequest(
  connection: net.Socket,
  pingRequest: PingRequest
) {
  let {
    headers: { hostname },
  } = pingRequest;
  if (hostname === undefined) {
    const response: PingResponse = {
      type: MessageType.PING,
      status: PingStatus.BAD_REQUEST,
    };
    connection.write(serializeResponse(response));
    return;
  }

  hostname = hostname.trim();
  const clientHostname = os.hostname();

  if (hostname === clientHostname) {
    const response: PingResponse = {
      type: MessageType.PING,
      status: PingStatus.PONG,
    };
    connection.write(serializeResponse(response));
    return;
  } else {
    const response: PingResponse = {
      type: MessageType.PING,
      status: PingStatus.HOST_NOT_FOUND,
    };
    connection.write(serializeResponse(response));
    return;
  }
}
