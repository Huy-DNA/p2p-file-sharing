import Repository from '../../repository.js';
import startPeerServer from './peerServer.js';

const repository = new Repository();
await repository.init();
startPeerServer(repository);
