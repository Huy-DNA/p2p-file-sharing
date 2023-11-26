import net from 'net';
import { LookupStatus, deserializeResponse } from '../../../../common/protocol/response.js';
import formatArray from '../utils/formatArray.js';
import { LookupRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import { MessageType } from '../../../../common/protocol/types.js';
import { getMessage } from '../../../../common/connection.js';
import { extractLookupResponse } from '../../../../common/protocol/validators/response.js';

export default async function handleLookupCommand(interfaceConnection: net.Socket, filename: string): Promise<string> {
  const request: LookupRequest = {
      type: MessageType.LOOKUP,
      headers: {
        filename,
      },
    };

  interfaceConnection.write(serializeRequest(request));

  const response = await getMessage(interfaceConnection, {
    transform: (message) => deserializeResponse(message).chain(extractLookupResponse),
  });
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  switch (response.status) {
    case LookupStatus.BAD_REQUEST:
      return `ERROR (${LookupStatus.BAD_REQUEST}): Bad Request`;
    case LookupStatus.OK:
      return `OK (${LookupStatus.OK}): Ok` + `\n${formatArray(response.body!)}`;
    case LookupStatus.NOT_FOUND:
      return `ERROR (${LookupStatus.NOT_FOUND}): File not found. Maybe it's your chance to take its name ;)`;
  }
}
