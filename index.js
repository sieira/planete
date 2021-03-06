/**
Copyright © 2015 Luis Sieira Garcia

This file is part of Planète.

    Planète is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Planète is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with along with planète.  If not, see <http://www.gnu.org/licenses/>.  If not, see <http://www.gnu.org/licenses/>
**/
var Reflect = require('harmony-reflect');

global.core = require('_');

var logger = core.logger;
    config = core.config;

// Consider if this could be placed on the core code
function shutdown(event, logger) {
  return function(err) {
    logger('Gracefully exiting on \''+ event +'\' event');
    if(err && err.stack) { logger(err.stack); }
    core.close(function () {
      process.exit(0);
    });
  }
}

process.on('SIGTERM', shutdown('SIGTERM', logger.info));
process.on('SIGINT', shutdown('SIGINT', logger.info));
process.on('uncaughtException', shutdown('uncaughtException', logger.stack));

core.init(function(err) {
  if(err) {
    logger.error('Error loading core: ' + err);
    process.emit('uncaughtException', err);
  }
  else {
    logger.info('Planète\'s core bootstraped, configured in %s mode', config.NODE_ENV);
  }
});
