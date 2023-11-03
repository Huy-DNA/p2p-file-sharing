export interface ClientRecord {
  hostname: string;
  files: {
    name: string;
    checksum: number;
  }[];
}

const clients = new Map<string, ClientRecord>();

export default clients;
