import net from 'net';
import discover from '../../../core/client/requests/discover.js';
import { DiscoverStatus } from '../../../../common/protocol/response.js';
import formatArray from '../utils/formatArray.js';
import Repository from '../../../../peer/core/client/repository.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handleDiscoverCommand(connection: net.Socket, repository: Repository, hostname: string): Promise<string> {
  const response = await discover(connection, hostname);
  
  switch (response.status) {
    case DiscoverStatus.BAD_REQUEST:
      return `ERROR (${DiscoverStatus.BAD_REQUEST}): Bad Request`;
    case DiscoverStatus.HOST_NOT_FOUND:
      return `ERROR (${DiscoverStatus.HOST_NOT_FOUND}): Host not found. Maybe it has disconnected?`;
    case DiscoverStatus.OK:
      return `OK (${DiscoverStatus.OK}): Ok` + `\n${formatArray(response.body!)}`;
  }
}
