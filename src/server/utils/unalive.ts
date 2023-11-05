import clientStore from "../stores/clients.js";
import isAlive from "./isAlive.js";

export default async function unalive(hostname: string, port: number): Promise<boolean> {
  if (await isAlive(hostname, port)) {
    return false;
  }

  clientStore.delete(hostname);
  return true;
}
