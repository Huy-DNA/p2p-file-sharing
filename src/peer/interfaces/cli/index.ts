import dotenv from "dotenv";
import readline from "readline";
import os from "os";
import Joi from "joi";
import usages from "./usages.js";
import handleDiscoverCommand from "./handlers/discoverCommand.js";
import handlePublishCommand from "./handlers/publishCommand.js";
import handleLookupCommand from "./handlers/lookupCommand.js";
import handleFetchCommand from "./handlers/fetchCommand.js";
import { connect } from "../../../common/connection.js";

dotenv.config();
const { PEER_INTERFACE_PORT, PEER_INTERFACE_HOSTNAME } = process.env;

const interfaceConnection = connect(PEER_INTERFACE_HOSTNAME!, Number.parseInt(PEER_INTERFACE_PORT!, 10));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const HOSTNAME = os.hostname();

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

          console.log(await handleFetchCommand(interfaceConnection, filename, hostname));
          break;
        }
        case "PUBLISH": {
          if (fragments.length !== 2) {
            console.log(usages["PUBLISH"]);
            break;
          }
          const filepath = fragments[1];
          console.log(await handlePublishCommand(interfaceConnection, filepath));
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
          console.log(await handleDiscoverCommand(interfaceConnection, hostname));
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
          console.log(await handleLookupCommand(interfaceConnection, filename)); 
          break;
        }
        default:
          console.log(
            "Unknown command. Known commands: FETCH, PUBLISH, DISCOVER, LOOKUP"
          );
      }
      resolve(undefined);
    });
  });
}
