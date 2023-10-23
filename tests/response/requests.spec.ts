import { scanForTests, readTest } from '../helpers';
import path from 'path';
import { Response, deserializeResponse, serializeResponse } from '../../src/common/protocol/response';
import { test, expect } from 'vitest';
import { MessageType } from '../../src/common/protocol/types';
import { extractConnectResponse, extractDiscoverResponse, extractFetchResponse, extractLoginResponse, extractLookupResponse, extractPingResponse, extractPlsConnectResponse, extractPublishResponse, extractRegisterResponse, extractSelectResponse } from '../../src/common/protocol/validators/response';

test('response deserializer', () => {
  const inputDir = path.resolve(__dirname, 'input');
  const outputDir = path.resolve(__dirname, 'output');
  const testnames = scanForTests(inputDir, '.deserialize');

  for (const testname of testnames) {
    const input = readTest(path.resolve(inputDir, testname));
    let output: Response | undefined = deserializeResponse(input).unwrap();
    switch (output.type) {
      case MessageType.CONNECT:
        output = extractConnectResponse(output).unwrap_or(undefined);
        break;
      case MessageType.DISCOVER:
        output = extractDiscoverResponse(output).unwrap_or(undefined);
        break;
      case MessageType.FETCH:
        output = extractFetchResponse(output).unwrap_or(undefined);
        break;
      case MessageType.LOGIN:
        output = extractLoginResponse(output).unwrap_or(undefined);
        break;
      case MessageType.LOOKUP:
        output = extractLookupResponse(output).unwrap_or(undefined);
        break;
      case MessageType.PING:
        output = extractPingResponse(output).unwrap_or(undefined);
        break;
      case MessageType.PLSCONNECT:
        output = extractPlsConnectResponse(output).unwrap_or(undefined);
        break;
      case MessageType.PUBLISH:
        output = extractPublishResponse(output).unwrap_or(undefined);
        break;
      case MessageType.REGISTER:
        output = extractRegisterResponse(output).unwrap_or(undefined);
        break;
      case MessageType.SELECT:
        output = extractSelectResponse(output).unwrap_or(undefined);
        break;
    }
    expect(JSON.stringify(output, null, 2)).toMatchFileSnapshot(path.resolve(outputDir, testname));
  }
});

test('response serializer', () => {
  const inputDir = path.resolve(__dirname, 'input');
  const outputDir = path.resolve(__dirname, 'output');
  const testnames = scanForTests(inputDir, '.serialize');

  for (const testname of testnames) {
    const input = readTest(path.resolve(inputDir, testname));
    let output: Response | undefined = deserializeResponse(input).unwrap();
    switch (output.type) {
      case MessageType.CONNECT:
        output = extractConnectResponse(output).unwrap_or(undefined);
        break;
      case MessageType.DISCOVER:
        output = extractDiscoverResponse(output).unwrap_or(undefined);
        break;
      case MessageType.FETCH:
        output = extractFetchResponse(output).unwrap_or(undefined);
        break;
      case MessageType.LOGIN:
        output = extractLoginResponse(output).unwrap_or(undefined);
        break;
      case MessageType.LOOKUP:
        output = extractLookupResponse(output).unwrap_or(undefined);
        break;
      case MessageType.PING:
        output = extractPingResponse(output).unwrap_or(undefined);
        break;
      case MessageType.PLSCONNECT:
        output = extractPlsConnectResponse(output).unwrap_or(undefined);
        break;
      case MessageType.PUBLISH:
        output = extractPublishResponse(output).unwrap_or(undefined);
        break;
      case MessageType.REGISTER:
        output = extractRegisterResponse(output).unwrap_or(undefined);
        break;
      case MessageType.SELECT:
        output = extractSelectResponse(output).unwrap_or(undefined);
        break;
    }
    expect(output && serializeResponse(output)).toMatchFileSnapshot(path.resolve(outputDir, testname));
  }
});
