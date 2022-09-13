import http from 'http';
import { Server as SocketServer } from 'socket.io';
import * as Bluebird from 'bluebird';
import util from 'util';

import Debug from 'debug';

/**
 * Load Config before any other file
 * this ensures that all necessary env vars are provided and valid to run server
 */
import Configuration from './config';

/**
 * Require express app
 */
import app from './app';
import CustomSocket from './socket';
import * as Mailer from './libraries/mailer.lib';
import './libraries/database';

/**
 * Setup SendGrid
 */
Mailer.init({
  fromEmail: Configuration.MAILER.FROM_EMAIL,
  replyToEmail: Configuration.MAILER.REPLY_EMAIL,
  privateKey: Configuration.MAILER.SENDGRID_PRIVATE_KEY,
});

/**
 * Make blue bird default Promise
 */
// global.Promise = <any>Bluebird;

/**
 * connecting a database
 */

const debug = Debug('node-server:index');

// if (Configuration.MONGOOSE_DEBUG) {
//   mongoose.set('debug', (collectionName: string, method: string, query: string, doc: string) => {
//     debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
//   });
// }

/**
 * Start server on PORT defined in config
 */
const server = http.createServer(app);

// init all socket
const io = new SocketServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
CustomSocket(io);

server.listen(Configuration.PORT, () => {
  console.log(`Server Started on PORT:${Configuration.PORT} (${Configuration.ENV})`);
});

/**
 * Graceful termination
 */

// process.on('SIGINT', () => {});
process.on('uncaughtException', (error) => {
  console.error('[UNCAUGHT EXCEPTION] ', error);
});
process.on('unhandledRejection', (error) => {
  console.error('[UNCAUGHT REJECTION] ', error);
});
