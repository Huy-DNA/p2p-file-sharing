import { LookupStatus, deserializeResponse } from '../../../../common/protocol/response.js';
import formatArray from '../utils/formatArray.js';
import { LookupRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import { MessageType } from '../../../../common/protocol/types.js';
import { extractLookupResponse } from '../../../../common/protocol/validators/response.js';
import requestInterface from '../utils/requestInterface.js';

export default async function handleLookupCommand(filename: string): Promise<string> {
  const request: LookupRequest = {
      type: MessageType.LOOKUP,
      headers: {
        filename,
      },
    };
  
  const rawResponse = await requestInterface(serializeRequest(request));
  const response = deserializeResponse(rawResponse).chain(extractLookupResponse).unwrap_or(undefined);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  switch (response?.status) {
    case LookupStatus.BAD_REQUEST:
      return `ERROR (${LookupStatus.BAD_REQUEST}): Bad Request`;
    case LookupStatus.OK:
      return `OK (${LookupStatus.OK}): Ok` + `\n${formatArray(response.body!)}`;
    case LookupStatus.NOT_FOUND:
      return `ERROR (${LookupStatus.NOT_FOUND}): File not found. Maybe it's your chance to take its name ;)`;
    default:
      return 'ERROR: Unknown internal error';
  }
}
