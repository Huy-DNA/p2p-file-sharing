export interface ClientRecord {
  hostname: string;
  files: Set<string>;
  deathFlag: boolean;
}

const clients = new Map<string, ClientRecord>();

export default clients;
