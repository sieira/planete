var core = require('_'),
    logger = core.logger,
    config = core.config;

// Consider if this could be placed on the core code
function shutdown(event, logger) {
  return function() {
    logger('Gracefully exiting on \''+ event +'\' event');
    core.close(function () {
      process.exit(0);
    });
  }
}

process.on('SIGTERM', shutdown('SIGTERM', logger.info));
process.on('SIGINT', shutdown('SIGINT', logger.info));
process.on('uncaughtException', shutdown('uncaughtException', logger.error));

core.init(function(err) {
  if(err) {
    logger.error('Error loading core');
  }
  if (!err) {
    logger.info('Planète\'s core bootstraped, configured in %s mode', config.NODE_ENV);
  }
});
