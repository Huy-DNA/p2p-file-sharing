import { MESSAGE_BOUNDARY } from "../../common/constants.js";
import {
  PublishRequest,
  serializeRequest,
} from "../../common/protocol/requests.js";
import {
  PublishStatus,
  deserializeResponse,
} from "../../common/protocol/response.js";
import { MessageType } from "../../common/protocol/types.js";
import { extractPublishResponse } from "../../common/protocol/validators/response.js";
import net from "net";
import dotenv from "dotenv";

dotenv.config();

const { SERVER_PORT, SERVER_HOSTNAME } = process.env;

export default async function handlePublishCommand(
  filename: string
): Promise<string> {
  const connection = net.createConnection({
    port: parseInt(SERVER_PORT!, 10),
    host: SERVER_HOSTNAME!,
  });

  const request: PublishRequest = {
    type: MessageType.PUBLISH,
    headers: {
      filename,
    },
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
          .and_then(extractPublishResponse)
          .unwrap();
        if (response.status === PublishStatus.OK) {
          resolve(`${filename} was published to server`);
        } else if (response.status === PublishStatus.DUPLICATE_NAME) {
          resolve(`${filename} has already been published`);
        } else {
          resolve("Something wrong has happened");
        }
      }
    });
    connection.on("error", () => {
      resolve("Cannot connect to server");
    });
  });
}
