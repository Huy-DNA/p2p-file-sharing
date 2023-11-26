import {
  FetchResponse,
  FetchStatus,
  serializeResponse,
} from "../../../../../common/protocol/response.js";
import { FetchRequest } from "../../../../../common/protocol/requests.js";
import net from "net";
import { MessageType } from "../../../../../common/protocol/types.js";
import Repository from "../../../../repository.js";
import { Base64 } from "js-base64";

export async function resolveFetchRequest(
  connection: net.Socket,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  repository: Repository,
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

  const fileContent = (await repository.access(filename)).map(Base64.encode);

  const response: FetchResponse = {
    type: MessageType.FETCH,
    status: fileContent.isOk() ? FetchStatus.OK : FetchStatus.FILE_NOT_FOUND,
    body: fileContent.unwrap_or(undefined),
  };

  connection.write(serializeResponse(response));
}
