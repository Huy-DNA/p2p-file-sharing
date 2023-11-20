import {
  FetchResponse,
  FetchStatus,
  serializeResponse,
} from "../../../../common/protocol/response.js";
import { FetchRequest } from "../../../../common/protocol/requests.js";
import net from "net";
import { MessageType } from "../../../../common/protocol/types.js";
import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile);

export async function resolveFetchRequest(
  connection: net.Socket,
  fetchRequest: FetchRequest
) {
  let {
    headers: { filename },
  } = fetchRequest;
  if (filename === undefined) {
    const response: FetchResponse = {
      type: MessageType.FETCH,
      status: FetchStatus.BAD_REQUEST,
    };
    connection.write(serializeResponse(response));
    return;
  }

  filename = filename.trim();

  try {
    // Read the file
    const fileContent = await readFile(filename, "base64");

    const response: FetchResponse = {
      type: MessageType.FETCH,
      status: FetchStatus.OK,
      body: fileContent,
    };
    connection.write(serializeResponse(response));
  } catch (error) {
    console.error(`Error reading file ${filename}: `, error);
    const response: FetchResponse = {
      type: MessageType.FETCH,
      status: FetchStatus.FILE_NOT_FOUND,
    };
    connection.write(serializeResponse(response));
  }
}
