'use strict';

module.exports = {
  log: function(message) {
    if (process.env.NODE_ENV === 'development') {
      console.log(message);
    }
  },

  degreesToRadians: function(degrees) {
    return degrees * Math.PI / 180;
  },
};
