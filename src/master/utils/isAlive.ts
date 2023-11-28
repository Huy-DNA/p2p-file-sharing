import { PingStatus } from "../../common/protocol/response.js";
import clientStore from "../stores/clients.js";
import ping from "./ping.js";

export default async function isAlive(hostname: string, port: number): Promise<boolean> {
  const clientRecord = clientStore.get(hostname);
  if (!clientRecord) {
    return false;
  }
  clientRecord.deathFlag = true;
  const response = await ping(hostname, port);
  if (response.status === PingStatus.PONG) {
    clientRecord.deathFlag = false;
  }
  return !clientRecord.deathFlag;
}