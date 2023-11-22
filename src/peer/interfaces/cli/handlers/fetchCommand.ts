import net from 'net';
import { LookupStatus, FetchStatus } from '../../../../common/protocol/response.js';
import lookup from '../../../../peer/core/client/requests/lookup.js';
import fetch from '../../../../peer/core/client/requests/fetch.js';
import { connectPeer } from '../../../../peer/core/client/connection.js';
import Repository from '../../../../peer/core/client/repository.js';
import Base64 from 'js-base64';

export default async function handleFetchCommand(connection: net.Socket, repository: Repository, filename: string, hostname: string | undefined): Promise<string> {
  if (await repository.has(filename)) {
    return `OK (${FetchStatus.OK}): The file already exists`;
  }
  
  if (hostname) {
    const peerConnection = connectPeer(hostname);
    const response = await fetch(peerConnection, filename);

    switch (response.status) {
      case FetchStatus.BAD_REQUEST:
        return `ERROR (${FetchStatus.BAD_REQUEST}): Bad Request`;
      case FetchStatus.FILE_NOT_FOUND:
        return `ERROR (${FetchStatus.FILE_NOT_FOUND}): Host ${hostname} does not have any file named ${filename}`;
      case FetchStatus.OK:
        await repository.addWithContent(filename, Base64.decode(response.body || ''))
        return `OK (${FetchStatus.OK}): Ok`;
    }
  } else {
    const response = await lookup(connection, filename);

    switch (response.status) {
      case LookupStatus.BAD_REQUEST:
        return `ERROR (${LookupStatus.BAD_REQUEST}): Lookup failed. Bad request`;
      case LookupStatus.NOT_FOUND:
        return `ERROR (${LookupStatus.NOT_FOUND}): File not found. Maybe it's your chance to take its name ;)`;
    }

    const hostnames = response.body!;
    
    const fileContent = hostnames.length === 0 ? null : await Promise.race(hostnames.map(async (hostname) => {
      const peerConnection = connectPeer(hostname);
      const response = await fetch(peerConnection, filename);

      switch (response.status) {
        case FetchStatus.BAD_REQUEST:
          return null;
        case FetchStatus.FILE_NOT_FOUND:
          return null;
        case FetchStatus.OK:
          return response.body!;
      }
    }));
    
    await repository.addWithContent(filename, Base64.decode(fileContent || ''))
    return fileContent === null ? `ERROR: Failed to fetch the file from any peers` : `OK (${FetchStatus.OK}): Ok`;
  }
}
