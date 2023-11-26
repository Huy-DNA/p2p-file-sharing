import { DiscoverStatus, deserializeResponse } from '../../../../common/protocol/response.js';
import formatArray from '../utils/formatArray.js';
import { MessageType } from '../../../../common/protocol/types.js';
import { DiscoverRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import requestInterface from '../utils/requestInterface.js';
import { extractDiscoverResponse } from '../../../../common/protocol/validators/response.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handleDiscoverCommand(hostname: string): Promise<string> {
  const request: DiscoverRequest = {
    type: MessageType.DISCOVER,
    headers: {
      hostname,
    }
  }

  const rawResponse = await requestInterface(serializeRequest(request));
  const response = deserializeResponse(rawResponse).chain(extractDiscoverResponse).unwrap_or(undefined);
  
  switch (response?.status) {
    case DiscoverStatus.BAD_REQUEST:
      return `ERROR (${DiscoverStatus.BAD_REQUEST}): Bad Request`;
    case DiscoverStatus.HOST_NOT_FOUND:
      return `ERROR (${DiscoverStatus.HOST_NOT_FOUND}): Host not found. Maybe it has disconnected?`;
    case DiscoverStatus.OK:
      return `OK (${DiscoverStatus.OK}): Ok` + `\n${formatArray(response.body!)}`;
    default:
      return 'ERROR: Unknown internal error!?';
  }
}
