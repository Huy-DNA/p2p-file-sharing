import { PublishStatus, deserializeResponse } from '../../../../common/protocol/response.js';
import path from 'path';
import { PublishRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import { MessageType } from '../../../../common/protocol/types.js';
import { extractPublishResponse } from '../../../../common/protocol/validators/response.js';
import requestInterface from '../utils/requestInterface.js';

export default async function handlePublishCommand(pathname: string): Promise<string> {
  const abspath = path.resolve(pathname);

  const request: PublishRequest = {
    type: MessageType.PUBLISH,
    headers: {
      filename: path.basename(abspath),
      abspath,
    },
  };
 
  const rawResponse = await requestInterface(serializeRequest(request));
  const response = deserializeResponse(rawResponse).chain(extractPublishResponse).unwrap_or(undefined);
  
  switch (response?.status) {
    case PublishStatus.BAD_REQUEST:
      return `ERROR (${PublishStatus.BAD_REQUEST}): Bad Request`;
    case PublishStatus.OK:
      return `OK (${PublishStatus.OK}): Published successfully`;
    case PublishStatus.FILE_NOT_FOUND:
      return `ERROR (${PublishStatus.FILE_NOT_FOUND}): The file cannot be found locally`;
    default:
      return 'ERROR: Unknown internal error';
  }
}
