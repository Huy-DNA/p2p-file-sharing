import net from 'net';
import announce from '../../../core/client/requests/announce.js';
import { AnnounceStatus } from '../../../../common/protocol/response.js';
import Repository from '../../../../peer/core/client/repository.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handleAnnounceCommand(connection: net.Socket, repo: Repository): Promise<string> {
  const response = await announce(connection);
  
  switch (response.status) {
    case AnnounceStatus.BAD_REQUEST:
      return `ERROR (${AnnounceStatus.BAD_REQUEST}): Bad Request`;
    case AnnounceStatus.OK:
      return `OK (${AnnounceStatus.OK}): Announced successfully`;
  }
}
