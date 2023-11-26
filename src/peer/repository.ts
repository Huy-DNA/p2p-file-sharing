import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import os from 'os';
import dotenv from 'dotenv';
import { None, Option, Some } from '../common/option/option.js';

dotenv.config();

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const cpFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);
const rm = promisify(fs.rm);
const dirExist = promisify(fs.exists);

export default class Repository {
  private static dir = process.env.PEER_REPO || path.resolve(os.homedir(), './p2p-file-sharing');

  async init() {
    await rm(Repository.dir, { recursive: true, force: true });
    await mkdir(Repository.dir);
  }

  async remove(filename: string) {
    await rm(path.resolve(Repository.dir, filename), { recursive: true, force: true });
  }

  async has(filename: string): Promise<boolean> {
    return dirExist(path.resolve(Repository.dir, filename));
  }

  async add(filename: string, pathname: string) {
    if (!await this.has(filename)) {
      await cpFile(pathname, path.resolve(Repository.dir, filename));
    }
  }

  async addWithContent(filename: string, content: string) {
    if (!await this.has(filename)) {
      await writeFile(path.resolve(Repository.dir, filename), content);
    }
  }

  async access(filename: string): Promise<Option<string>> {
    if (!await this.has(filename)) {
      return new None();
    }

    try {
      return new Some(await readFile(path.resolve(Repository.dir, filename), 'utf-8'));
    } catch {
      return new None();
    }
  }
}
