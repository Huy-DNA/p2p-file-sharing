import dotenv from 'dotenv';
import readline from 'readline';
import os from 'os';
import Joi from 'joi';
import usages from './usages.js';
import handleDiscoverCommand from './handlers/discoverCommand.js';
import handlePingCommand from './handlers/pingCommand.js';

dotenv.config();

const HOSTNAME = os.hostname();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// eslint-disable-next-line no-constant-condition
while (true) {
  await new Promise((resolve) => {
    rl.question(`${HOSTNAME}$ `, async (command) => {
      if (command.trim() === '') {
        resolve(undefined);
        return;
      }
      const fragments = command.trim().split(/\s+/);

      switch (fragments[0].toUpperCase()) {
        case 'DISCOVER': {
          if (fragments.length !== 2) {
            console.log(usages['DISCOVER']);
            break;
          }
          const hostname = fragments[1];
          if (Joi.string().trim().hostname().validate(hostname).error) {
            console.log(usages['DISCOVER']);
            break;
          }
          console.log(await handleDiscoverCommand(hostname));
          break;
        }
        case 'PING': {
          if (fragments.length !== 2) {
            console.log(usages['PING']);
            break;
          }
          const hostname = fragments[1];
          if (Joi.string().trim().hostname().validate(hostname).error) {
            console.log(usages['PING']);
            break;
          }
          console.log(await handlePingCommand(hostname));
          break;
        }
        default:
          console.log('Unknown command. Known commands: DISCOVER, PING');
      }
      resolve(undefined);
    });
  });
}
