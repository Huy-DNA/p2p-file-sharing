import dotenv from 'dotenv';
import { httpPost } from '../../../../common/connection.js';

dotenv.config();
const { PEER_INTERFACE_PORT, PEER_INTERFACE_HOSTNAME } = process.env;

export default async function requestInterface(message: string): Promise<string> {
  return httpPost(PEER_INTERFACE_HOSTNAME!, Number.parseInt(PEER_INTERFACE_PORT!), message);
}
