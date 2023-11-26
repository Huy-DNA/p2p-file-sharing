import axios from 'axios';

const { VITE_PEER_INTERFACE_PORT, VITE_PEER_INTERFACE_HOSTNAME } = import.meta.env;

export async function requestInterface(message: string): Promise<string> {
  return axios.post(`http://${VITE_PEER_INTERFACE_HOSTNAME}:${VITE_PEER_INTERFACE_PORT}/`, message)
    .then(({ data }) => data);
}
