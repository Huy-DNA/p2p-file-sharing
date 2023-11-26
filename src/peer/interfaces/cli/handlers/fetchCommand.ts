import net from 'net';
import { LookupStatus, FetchStatus, deserializeResponse } from '../../../../common/protocol/response.js';
import Repository from '../../../repository.js';
import { Base64 } from 'js-base64';
import { FetchRequest, LookupRequest, serializeRequest } from '../../../../common/protocol/requests.js';
import { MessageType } from '../../../../common/protocol/types.js';
import { getMessage } from '../../../../common/connection.js';
import { extractFetchResponse, extractLookupResponse } from '../../../../common/protocol/validators/response.js';

export default async function handleFetchCommand(interfaceConnection: net.Socket, filename: string, hostname: string | undefined): Promise<string> { 
  const repository = new Repository();
  if (await repository.has(filename)) {
    return `OK (${FetchStatus.OK}): The file already exists`;
  }

  if (hostname) {
    const request: FetchRequest = {
      type: MessageType.FETCH,
      headers: {
        filename,
        hostname,
      },
    };

    interfaceConnection.write(serializeRequest(request));

    const response = await getMessage(interfaceConnection, {
      transform: (message) => deserializeResponse(message).chain(extractFetchResponse),
    });

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
    const lookupRequest: LookupRequest = {
      type: MessageType.LOOKUP,
      headers: {
        filename,
      },
    };

    interfaceConnection.write(serializeRequest(lookupRequest));

    const lookupResponse = await getMessage(interfaceConnection, {
      transform: (message) => deserializeResponse(message).chain(extractLookupResponse),
    });

    switch (lookupResponse.status) {
      case LookupStatus.BAD_REQUEST:
        return `ERROR (${LookupStatus.BAD_REQUEST}): Lookup failed. Bad request`;
      case LookupStatus.NOT_FOUND:
        return `ERROR (${LookupStatus.NOT_FOUND}): File not found. Maybe it's your chance to take its name ;)`;
    }

    const hostnames = lookupResponse.body!; 

    const fileContent = hostnames.length === 0 ? null : await Promise.race(hostnames.map(async (hostname) => {
      const fetchRequest: FetchRequest = {
        type: MessageType.FETCH,
        headers: {
          filename,
          hostname,
        },
      };

      interfaceConnection.write(serializeRequest(fetchRequest));

      const fetchResponse = await getMessage(interfaceConnection, {
        transform: (message) => deserializeResponse(message).chain(extractFetchResponse),
      });

      switch (fetchResponse.status) {
        case FetchStatus.BAD_REQUEST:
          return null;
        case FetchStatus.FILE_NOT_FOUND:
          return null;
        case FetchStatus.OK:
          return fetchResponse.body!;
      }
    }));
    
    await repository.addWithContent(filename, Base64.decode(fileContent || ''))
    return fileContent === null ? `ERROR: Failed to fetch the file from any peers` : `OK (${FetchStatus.OK}): Fetched successfully`;
  }
}
