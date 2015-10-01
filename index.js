var core = require('_');

core.init(function(err) {
  //TODO log with the logger module if possible
  if(err) {
    console.log('Error loading core');
  }
  if (!err) {
    console.log('Planète\'s  bootstraped, configured in %s mode', process.env.NODE_ENV);
  }
});
