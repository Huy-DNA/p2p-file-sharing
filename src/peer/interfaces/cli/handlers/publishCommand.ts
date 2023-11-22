import net from 'net';
import publish from '../../../core/client/requests/publish.js';
import { PublishStatus } from '../../../../common/protocol/response.js';
import Repository from '../../../../peer/core/client/repository.js';

export default async function handlePublishCommand(connection: net.Socket, repository: Repository, filename: string): Promise<string> {
  const response = await publish(connection, filename);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  switch (response.status) {
    case PublishStatus.BAD_REQUEST:
      return `ERROR (${PublishStatus.BAD_REQUEST}): Bad Request`;
    case PublishStatus.OK:
      return `OK (${PublishStatus.OK}): Published successfully`;
  }
}
