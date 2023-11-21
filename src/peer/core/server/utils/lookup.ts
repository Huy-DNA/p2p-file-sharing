import { MESSAGE_BOUNDARY } from "../../../../common/constants.js";
import {
  LookupRequest,
  serializeRequest,
} from "../../../../common/protocol/requests.js";
import {
  LookupResponse,
  LookupStatus,
  deserializeResponse,
} from "../../../../common/protocol/response.js";
import { MessageType } from "../../../../common/protocol/types.js";
import { extractLookupResponse } from "../../../../common/protocol/validators/response.js";
import net from "net";
import dotenv from "dotenv";

dotenv.config();

const { SERVER_PORT, SERVER_HOSTNAME } = process.env;

export default async function lookUp(
  filename: string
): Promise<LookupResponse> {
  const socket = net.createConnection({
    port: parseInt(SERVER_PORT!, 10),
    host: SERVER_HOSTNAME!,
  });
  const lookUpRequest: LookupRequest = {
    type: MessageType.LOOKUP,
    headers: {
      filename,
    },
  };

  return new Promise((resolve) => {
    socket.write(serializeRequest(lookUpRequest));

    let message = "";
    socket.on("data", (data) => {
      const messages = data.toString().split(MESSAGE_BOUNDARY);
      message += messages[0];
      if (messages.length > 1) {
        socket.end();
        const response = deserializeResponse(message + MESSAGE_BOUNDARY)
          .and_then(extractLookupResponse)
          .unwrap();
        resolve(response);
      }
    });
    socket.on("error", () => {
      const response: LookupResponse = {
        status: LookupStatus.BAD_REQUEST,
        type: MessageType.LOOKUP,
      };
      resolve(response);
    });
  });
}
