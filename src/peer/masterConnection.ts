import { connect } from '../common/connection.js';
import dotenv from 'dotenv';
dotenv.config();

const { MASTER_HOSTNAME, MASTER_PORT } = process.env;

export const masterConnection = connect(MASTER_HOSTNAME!, Number.parseInt(MASTER_PORT!));
