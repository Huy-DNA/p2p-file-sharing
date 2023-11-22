import net from 'net';
import { LookupStatus } from '../../../../common/protocol/response.js';
import formatArray from '../utils/formatArray.js';
import lookup from '../../../core/client/requests/lookup.js';
import Repository from '../../../../peer/core/client/repository.js';

export default async function handleLookupCommand(connection: net.Socket, repository: Repository, filename: string): Promise<string> {
  const response = await lookup(connection, filename);
  
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
