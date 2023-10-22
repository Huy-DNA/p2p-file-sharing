import fs from 'fs';

export function scanForTests(path: string, suffix?: string): string[] {
  return fs.readdirSync(path)
            .filter((v: string) => suffix === undefined || v.endsWith(suffix));
}

export function readTest(path: string): string {
  return fs.readFileSync(path, { encoding: 'utf-8' });
}
