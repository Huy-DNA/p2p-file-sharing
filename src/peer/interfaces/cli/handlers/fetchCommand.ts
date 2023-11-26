import { FetchStatus, deserializeResponse } from '../../../../common/protocol/response.js';
import { FetchRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import { MessageType } from '../../../../common/protocol/types.js';
import { extractFetchResponse } from '../../../../common/protocol/validators/response.js';
import requestInterface from '../utils/requestInterface.js';

export default async function handleFetchCommand(filename: string, hostname: string | undefined): Promise<string> { 
  const request: FetchRequest = {
    type: MessageType.FETCH,
    headers: {
      filename,
      hostname,
    },
  };

  const rawResponse = await requestInterface(serializeRequest(request));
  const response = deserializeResponse(rawResponse).chain(extractFetchResponse).unwrap_or(undefined); 

  switch (response?.status) {
    case FetchStatus.BAD_REQUEST:
      return `ERROR (${FetchStatus.BAD_REQUEST}): Bad Request`;
    case FetchStatus.FILE_NOT_FOUND:
      return `ERROR (${FetchStatus.FILE_NOT_FOUND}): Host ${hostname} does not have any file named ${filename}`;
    case FetchStatus.OK:
      return `OK (${FetchStatus.OK}): Ok`;
    case FetchStatus.FILE_ALREADY_EXIST:
      return `OK (${FetchStatus.FILE_ALREADY_EXIST}): File already exists`;
    default:
      return 'ERROR: Unknown internal error';
  }
}
