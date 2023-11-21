import { MESSAGE_BOUNDARY } from "../../common/constants.js";
import {
  AnnounceRequest,
  serializeRequest,
} from "../../common/protocol/requests.js";
import {
  AnnounceStatus,
  deserializeResponse,
} from "../../common/protocol/response.js";
import { MessageType } from "../../common/protocol/types.js";
import { extractAnnounceResponse } from "../../common/protocol/validators/response.js";
import net from "net";
import dotenv from "dotenv";

dotenv.config();

const { SERVER_PORT, SERVER_HOSTNAME } = process.env;

export default async function handleAnnounceCommand(): Promise<string> {
  const connection = net.createConnection({
    port: parseInt(SERVER_PORT!, 10),
    host: SERVER_HOSTNAME!,
  });

  const request: AnnounceRequest = {
    type: MessageType.ANNOUNCE,
  };

  return new Promise((resolve) => {
    connection.write(serializeRequest(request));

    let message = "";
    connection.on("data", (data) => {
      const messages = data.toString().split(MESSAGE_BOUNDARY);
      message += messages[0];
      if (messages.length > 1) {
        connection.end();
        const response = deserializeResponse(message + MESSAGE_BOUNDARY)
          .and_then(extractAnnounceResponse)
          .unwrap();
        resolve(response.status === AnnounceStatus.OK ? "OK" : "BAD_REQUEST");
      }
    });
    connection.on("error", () => {
      resolve("Cannot connect to server");
    });
  });
}
