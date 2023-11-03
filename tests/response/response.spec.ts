import { scanForTests, readTest } from '../helpers';
import path from 'path';
import { Response, deserializeResponse, serializeResponse } from '../../src/common/protocol/response';
import { test, expect } from 'vitest';
import { MessageType } from '../../src/common/protocol/types';
import {extractAnnounceResponse, extractDiscoverResponse, extractFetchResponse, extractLookupResponse, extractPingResponse, extractPublishResponse,} from '../../src/common/protocol/validators/response';

test('response deserializer', () => {
  const inputDir = path.resolve(__dirname, 'input');
  const outputDir = path.resolve(__dirname, 'output');
  const testnames = scanForTests(inputDir, '.deserialize');

  for (const testname of testnames) {
    const input = readTest(path.resolve(inputDir, testname));
    let output: Response | undefined = deserializeResponse(input).unwrap();
    switch (output.type) {
      case MessageType.DISCOVER:
        output = extractDiscoverResponse(output).unwrap_or(undefined);
        break;
      case MessageType.FETCH:
        output = extractFetchResponse(output).unwrap_or(undefined);
        break;
      case MessageType.LOOKUP:
        output = extractLookupResponse(output).unwrap_or(undefined);
        break;
      case MessageType.PING:
        output = extractPingResponse(output).unwrap_or(undefined);
        break;
      case MessageType.PUBLISH:
        output = extractPublishResponse(output).unwrap_or(undefined);
        break;
      case MessageType.ANNOUNCE:
        output = extractAnnounceResponse(output).unwrap_or(undefined);
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
      case MessageType.DISCOVER:
        output = extractDiscoverResponse(output).unwrap_or(undefined);
        break;
      case MessageType.FETCH:
        output = extractFetchResponse(output).unwrap_or(undefined);
        break;
      case MessageType.LOOKUP:
        output = extractLookupResponse(output).unwrap_or(undefined);
        break;
      case MessageType.PING:
        output = extractPingResponse(output).unwrap_or(undefined);
        break;
      case MessageType.PUBLISH:
        output = extractPublishResponse(output).unwrap_or(undefined);
        break;
      case MessageType.ANNOUNCE:
        output = extractAnnounceResponse(output).unwrap_or(undefined);
        break;
    }
    expect(output && serializeResponse(output)).toMatchFileSnapshot(path.resolve(outputDir, testname));
  }
});
