import { scanForTests, readTest } from '../helpers';
import path from 'path';
import { Request, deserializeRequest, serializeRequest } from '../../src/common/protocol/requests';
import { test, expect } from 'vitest';
import { MessageType } from '../../src/common/protocol/types';
import { extractDiscoverRequest, extractFetchRequest, extractLookupRequest, extractPingRequest, extractPublishRequest, } from '../../src/common/protocol/validators/requests';

test('request deserializer', () => {
  const inputDir = path.resolve(__dirname, 'input');
  const outputDir = path.resolve(__dirname, 'output');
  const testnames = scanForTests(inputDir, '.deserialize');

  for (const testname of testnames) {
    const input = readTest(path.resolve(inputDir, testname));
    let output: Request | undefined = deserializeRequest(input).unwrap();
    switch (output.type) {
      case MessageType.DISCOVER:
        output = extractDiscoverRequest(output).unwrap_or(undefined);
        break;
      case MessageType.FETCH:
        output = extractFetchRequest(output).unwrap_or(undefined);
        break;
      case MessageType.LOOKUP:
        output = extractLookupRequest(output).unwrap_or(undefined);
        break;
      case MessageType.PING:
        output = extractPingRequest(output).unwrap_or(undefined);
        break;
      case MessageType.PUBLISH:
        output = extractPublishRequest(output).unwrap_or(undefined);
        break;
    }
    expect(JSON.stringify(output, null, 2)).toMatchFileSnapshot(path.resolve(outputDir, testname));
  }
});

test('request serializer', () => {
  const inputDir = path.resolve(__dirname, 'input');
  const outputDir = path.resolve(__dirname, 'output');
  const testnames = scanForTests(inputDir, '.serialize');

  for (const testname of testnames) {
    const input = readTest(path.resolve(inputDir, testname));
    let output: Request | undefined = deserializeRequest(input).unwrap();
    switch (output.type) {
      case MessageType.DISCOVER:
        output = extractDiscoverRequest(output).unwrap_or(undefined);
        break;
      case MessageType.FETCH:
        output = extractFetchRequest(output).unwrap_or(undefined);
        break;
      case MessageType.LOOKUP:
        output = extractLookupRequest(output).unwrap_or(undefined);
        break;
      case MessageType.PING:
        output = extractPingRequest(output).unwrap_or(undefined);
        break;
      case MessageType.PUBLISH:
        output = extractPublishRequest(output).unwrap_or(undefined);
        break;
    }
    expect(output && serializeRequest(output)).toMatchFileSnapshot(path.resolve(outputDir, testname));
  }
});
