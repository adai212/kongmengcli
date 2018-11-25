#!/usr/bin/env node
const shell = require("shelljs");
const log4js = require('log4js');

log4js.configure({
    appenders: {
        stdout: { type: 'stdout' },
        cheese: { type: 'dateFile', filename: 'cheese.log' }
    },
    categories: {
        all: { appenders: ['stdout'], level: 'all' },
        default: { appenders: ['stdout'], level: 'info' },
        cheese: { appenders: ['stdout', 'cheese'], level: 'info' }
    }
});
const all = log4js.getLogger('all');
const logger = log4js.getLogger('default');
const cheese = log4js.getLogger('cheese');
let pwd = shell.pwd();
// logger.info('Entering cheese testing');
// logger.info(`${pwd}`);
// cheese.info("Some debug messages");
// cheese.info('hello world');
// all.info('info');
// all.error('error');

const mylogger = log4js.getLogger();
mylogger.level = 'all';
mylogger.debug('debug');
mylogger.error('error');