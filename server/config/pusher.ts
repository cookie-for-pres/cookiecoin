import config from './config';
import Pusher from 'pusher';

// @ts-ignore
const pusherClient = new Pusher(config.pusher)

export default pusherClient;