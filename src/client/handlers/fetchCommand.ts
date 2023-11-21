import { MESSAGE_BOUNDARY } from "../../common/constants.js";
import {
  FetchRequest,
  serializeRequest,
} from "../../common/protocol/requests.js";
import {
  FetchStatus,
  deserializeResponse,
  LookupStatus,
} from "../../common/protocol/response.js";
import { MessageType } from "../../common/protocol/types.js";
import { extractFetchResponse } from "../../common/protocol/validators/response.js";
import net from "net";
import dotenv from "dotenv";
import fs from "fs";
import util from "util";
import lookUp from "client/utils/lookup.js";

dotenv.config();

const { PEER_PORT } = process.env;
const writeFile = util.promisify(fs.writeFile);

export default async function handleFetchCommand(
  filename: string
): Promise<string> {
  // Lookup for file
  const lookupResponse = await lookUp(filename);
  if (lookupResponse.status !== LookupStatus.OK || !lookupResponse.body) {
    return "File not found";
  }

  // Choose a random peer
  const peerHostnames = lookupResponse.body;
  const peerHostname =
    peerHostnames[Math.floor(Math.random() * peerHostnames.length)];

  const connection = net.createConnection({
    port: parseInt(PEER_PORT!, 10),
    host: peerHostname,
  });

  const request: FetchRequest = {
    type: MessageType.FETCH,
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
          .and_then(extractFetchResponse)
          .unwrap();
        if (response.status === FetchStatus.OK) {
          const fileContent = response.body!;
          // Write file content to filename
          writeFile(filename, fileContent, "base64")
            .then(() => {
              resolve(fileContent === "" ? "<Empty>" : `Fetched ${filename}`);
            })
            .catch((error) => {
              console.error(`Error writing file ${filename}: `, error);
              resolve("Something wrong has happened");
            });
        } else if (response.status === FetchStatus.FILE_NOT_FOUND) {
          resolve("File not found");
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
