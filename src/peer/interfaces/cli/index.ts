import dotenv from "dotenv";
import readline from "readline";
import os from "os";
import Joi from "joi";
import usages from "./usages.js";
import { connectServer } from "../../core/client/connection.js";
import handleAnnounceCommand from "./handlers/announceCommand.js";
import handleDiscoverCommand from "./handlers/discoverCommand.js";
import handlePublishCommand from "./handlers/publishCommand.js";
import handleLookupCommand from "./handlers/lookupCommand.js";
import handleFetchCommand from "./handlers/fetchCommand.js";
import startPeerServer from "../../core/server/index.js";

dotenv.config();

const HOSTNAME = os.hostname();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

startPeerServer();
const masterConnection = connectServer();

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
          console.log(await handleAnnounceCommand(masterConnection));
          break;
        }
        case "FETCH": {
          if (fragments.length !== 3 && fragments.length !== 2) {
            console.log(usages["FETCH"]);
            break;
          }

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, filename, hostname] = fragments;
          if (Joi.string().trim().regex(/[^\s/\\:?*|]+/).validate(filename).error) {
            console.log("Invalid filename");
            console.log(usages["FETCH"]);
            break;
          }

          if (hostname && Joi.string().trim().hostname().validate(hostname).error) {
            console.log("Invalid hostname");
            console.log(usages["FETCH"]);
            break;
          }

          console.log(await handleFetchCommand(masterConnection, filename, hostname));
          break;
        }
        case "PUBLISH": {
          if (fragments.length !== 2) {
            console.log(usages["PUBLISH"]);
            break;
          }
          const filepath = fragments[1];
          console.log(await handlePublishCommand(masterConnection, filepath));
          break;
        }
        case "DISCOVER": {
          if (fragments.length !== 2) {
            console.log(usages["DISCOVER"]);
            break;
          }
          const hostname = fragments[1];
          if (Joi.string().trim().hostname().validate(hostname).error) {
            console.log("Invalid hostname");
            console.log(usages["DISCOVER"]);
            break;
          }
          console.log(await handleDiscoverCommand(masterConnection, hostname));
          break;
        }
        case "LOOKUP": {
          if (fragments.length !== 2) {
            console.log(usages["LOOKUP"]);
            break;
          }
          const filename = fragments[1];
          if (Joi.string().trim().regex(/[^\s/\\:?*|]+/).validate(filename).error) {
            console.log("Invalid filetname");
            console.log(usages["LOOKUP"]);
            break;
          }
          console.log(await handleLookupCommand(masterConnection, filename)); 
          break;
        }
        default:
          console.log(
            "Unknown command. Known commands: ANNOUNCE, FETCH, PUBLISH, DISCOVER, LOOKUP"
          );
      }
      resolve(undefined);
    });
  });
}
