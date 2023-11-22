import net from 'net';
import announce from '../../../core/client/requests/announce.js';
import { AnnounceStatus } from '../../../../common/protocol/response.js';

export default async function handleAnnounceCommand(connection: net.Socket): Promise<string> {
  const response = await announce(connection);
  
  switch (response.status) {
    case AnnounceStatus.BAD_REQUEST:
      return `ERROR (${AnnounceStatus.BAD_REQUEST}): Bad Request`;
    case AnnounceStatus.OK:
      return `OK (${AnnounceStatus.OK}): Announced successfully`;
  }
}
