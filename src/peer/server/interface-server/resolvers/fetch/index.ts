import { FetchRequest, LookupRequest, serializeRequest } from '../../../../../common/protocol/requests.js';
import { FetchResponse, FetchStatus, deserializeResponse, serializeResponse } from '../../../../../common/protocol/response.js';
import { extractFetchResponse, extractLookupResponse } from '../../../../../common/protocol/validators/response.js';
import http from 'http';
import { connect, getMessage } from '../../../../../common/connection.js';
import Repository from '../../../../repository.js';
import dotenv from 'dotenv';
import { Base64 } from 'js-base64';
import { MessageType } from '../../../../../common/protocol/types.js';
import { masterConnection } from '../../../../masterConnection.js';
dotenv.config();

const { PEER_PORT } = process.env;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function resolveFetchRequest(interfaceConnection: http.ServerResponse, request: FetchRequest) {
  const {
    filename,
    hostname,
  } = request.headers;

  const repository = new Repository();
  if (await repository.has(filename)) {
    const response: FetchResponse = {
      type: MessageType.FETCH,
      status: FetchStatus.FILE_ALREADY_EXIST,
      body: (await repository.access(filename)).map(Base64.encode).unwrap_or(''),
    }
    interfaceConnection.write(serializeResponse(response));
    interfaceConnection.end();
    return;
  }

  if (hostname) {
    const peerConnection = connect(hostname, Number.parseInt(PEER_PORT!));
    peerConnection.write(serializeRequest(request));

    const listener = (message: string) => deserializeResponse(message)
      .chain(extractFetchResponse)
      .map((res) => {
        if (res.status === FetchStatus.OK) {
          repository.addWithContent(filename, Base64.decode(res.body || ''));
        }
        return res;
      })
      .map(serializeResponse)
      .map((mes) => interfaceConnection.write(mes))
      .map(() => interfaceConnection.end())
      .map(() => peerConnection.removeListener('message', listener));
    peerConnection.on('message', listener);
  } else {
    const lookupRequest: LookupRequest = {
      type: MessageType.LOOKUP,
      headers: {
        filename,
      }
    }

    masterConnection.write(serializeRequest(lookupRequest));
    const { body: hostnames } = await getMessage(masterConnection, {
      transform: (message) => deserializeResponse(message).chain(extractLookupResponse),
    });
    
    const fileContent = hostnames?.length ? await Promise.race(hostnames.map(async (hostname) => {
      const fetchRequest: FetchRequest = {
        type: MessageType.FETCH,
        headers: {
          filename,
          hostname,
        },
      };

      const peerConnection = connect(hostname, Number.parseInt(PEER_PORT!));

      peerConnection.write(serializeRequest(fetchRequest));

      const fetchResponse = await getMessage(masterConnection, {
        transform: (message) => deserializeResponse(message).chain(extractFetchResponse),
      });

      switch (fetchResponse.status) {
        case FetchStatus.BAD_REQUEST:
          return undefined;
        case FetchStatus.FILE_NOT_FOUND:
          return undefined;
        case FetchStatus.OK:
          return fetchResponse.body!;
      }
    })) : undefined;
    
    if (fileContent) {
      await repository.addWithContent(filename, Base64.decode(fileContent || ''))
      const response: FetchResponse = {
        type: MessageType.FETCH,
        status: FetchStatus.OK,
      };
      interfaceConnection.write(serializeResponse(response));
      interfaceConnection.end();
    } else {
      const response: FetchResponse = {
        type: MessageType.FETCH,
        status: FetchStatus.FILE_NOT_FOUND,
      };
      interfaceConnection.write(serializeResponse(response));
      interfaceConnection.end();
    }
  }
}
