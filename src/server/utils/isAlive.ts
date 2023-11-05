import { PingStatus } from "../../common/protocol/response.js";
import ping from "./ping.js";

export default async function isAlive(hostname: string, port: number): Promise<boolean> {
  const response = await ping(hostname, port);

  return response.status === PingStatus.PONG;
}