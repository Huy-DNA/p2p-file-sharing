import dotenv from "dotenv";
import readline from "readline";
import os from "os";
// import Joi from "joi";
import usages from "./usages.js";
import {
  DiscoverStatus,
  FetchStatus,
  LookupStatus,
  PingStatus,
  PublishStatus,
} from "../../common/protocol/response.js";
import { basename } from "path";

dotenv.config();

const HOSTNAME = os.hostname();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const handleAnnounceCommand = async () => {
  console.log("announcing to server...");
  return DiscoverStatus.OK;
};

const handleFetchCommand = async (fileName: string, clientIP: string) => {
  console.log(`fetching ${fileName} from ${clientIP}...`);
  return FetchStatus.OK;
};

const handlePublishCommand = async (filePath: string) => {
  console.log(`publishing ${basename(filePath)}...`);
  return PublishStatus.OK;
};

const handleDiscoverCommand = async (clientIP: string) => {
  const filesList = ["A", "B", "C", "D", "E"];
  console.log(`discover ${clientIP}...`);
  return DiscoverStatus.OK + "/n" + filesList.join("\n");
};

const handleLookupCommand = async (fileName: string) => {
  const hostList = [
    "192.168.1.17",
    "127.0.0.1",
    "172.18.0.1",
    "172.23.0.1",
    "172.16.0.2",
  ];
  console.log(`looking up ${fileName}...`);
  return LookupStatus.OK + "\n" + hostList.join("\n");
};

const handlePingCommand = async (clientIP: string) => {
  console.log(`ping ${clientIP}`);
  return PingStatus.PONG;
};

// eslint-disable-next-line no-constant-condition
while (true) {
  await new Promise((resolve) => {
    rl.question(`${HOSTNAME}$ `, async (command) => {
      if (command.trim() === "") {
        resolve(undefined);
        return;
      }
      const fragments = command.trim().split(/\s+/);

      switch (fragments[0].toUpperCase()) {
        case "ANNOUNCE": {
          if (fragments.length !== 1) {
            console.log(usages["ANNOUNCE"]);
            break;
          }
          console.log(await handleAnnounceCommand());
          break;
        }
        case "FETCH": {
          if (fragments.length !== 3) {
            console.log(usages["FETCH"]);
            break;
          }
          const fileName = fragments[1];
          const clientIP = fragments[2];
          console.log(await handleFetchCommand(fileName, clientIP));
          break;
        }
        case "PUBLISH": {
          if (fragments.length !== 2) {
            console.log(usages["PUBLISH"]);
            break;
          }
          const filePath = fragments[1];
          console.log(await handlePublishCommand(filePath));
          break;
        }
        case "DISCOVER": {
          if (fragments.length !== 2) {
            console.log(usages["DISCOVER"]);
            break;
          }
          const clientIP = fragments[1];
          console.log(await handleDiscoverCommand(clientIP));
          break;
        }
        case "LOOKUP": {
          if (fragments.length !== 2) {
            console.log(usages["LOOKUP"]);
            break;
          }
          const fileName = fragments[1];
          console.log(await handleLookupCommand(fileName));
          break;
        }
        case "PING": {
          if (fragments.length !== 2) {
            console.log(usages["PING"]);
            break;
          }
          const clientIP = fragments[1];
          console.log(await handlePingCommand(clientIP));
          break;
        }
        default:
          console.log(
            "Unknown command. Known commands: ANNOUNCE, FETCH, PUBLISH, DISCOVER, LOOKUP, PING"
          );
      }
      resolve(undefined);
    });
  });
}
