export interface ClientRecord {
  hostname: string;
  files: Set<string>;
}

const clients = new Map<string, ClientRecord>();

export default clients;
