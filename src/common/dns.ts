import { promisify } from 'util';
import dns from 'dns';

export const lookup = promisify(dns.lookup);
