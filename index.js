var core = require('_'),
    logger = core.logger,
    config = core.config;

core.init(function(err) {
  //TODO log with the logger module if possible
  if(err) {
    logger.error('Error loading core');
  }
  if (!err) {
    logger.info('Planète\'s core bootstraped, configured in %s mode', config.NODE_ENV);
  }
});
