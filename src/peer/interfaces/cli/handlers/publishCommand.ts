import net from 'net';
import publish from '../../../core/client/requests/publish.js';
import { PublishStatus } from '../../../../common/protocol/response.js';
import Repository from '../../../../peer/core/client/repository.js';
import path from 'path';

export default async function handlePublishCommand(connection: net.Socket, repository: Repository, pathname: string): Promise<string> {
  const abspath = path.resolve(pathname);
  if (await repository.has(path.basename(abspath))) {
    return `OK (${PublishStatus.OK}): The file is already published`;
  }

  const response = await publish(connection, path.basename(pathname));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  switch (response.status) {
    case PublishStatus.BAD_REQUEST:
      return `ERROR (${PublishStatus.BAD_REQUEST}): Bad Request`;
    case PublishStatus.OK:
      try {
        await repository.add(path.basename(abspath), abspath);
        return `OK (${PublishStatus.OK}): Published successfully`;
      } catch {
        return `ERROR: Failed while adding file to local repo`;
      }
  }
}
