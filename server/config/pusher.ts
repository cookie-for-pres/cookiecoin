import config from './config';
import Pusher from 'pusher';

const pusherClient = new Pusher(config.pusher)

export default pusherClient;