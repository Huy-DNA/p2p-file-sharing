import { scanForTests, readTest } from '../helpers';
import path from 'path';
import { deserializeRequest } from '../../src/common/protocol/requests';
import { test, expect } from 'vitest';

test('request deserializer', () => {
  const inputDir = path.resolve(__dirname, 'input');
  const outputDir = path.resolve(__dirname, 'output');
  const testnames = scanForTests(inputDir, 'serialize');

  for (const testname of testnames) {
    const input = readTest(path.resolve(inputDir, testname));
    const output = deserializeRequest(input);
    expect(JSON.stringify(output, null, 2)).toMatchFileSnapshot(path.resolve(outputDir, testname));
  }
});
