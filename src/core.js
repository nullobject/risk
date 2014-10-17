'use strict';

module.exports = {
  log: function(message) {
    if (process.env.NODE_ENV === 'development') {
      console.log(message);
    }
  },
};
