export interface ClientRecord {
  hostname: string;
  files: {
    name: string;
  }[];
}

const clients = new Map<string, ClientRecord>();

export default clients;
