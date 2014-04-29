var _ = require('lodash');

module.exports = {
  cartesianProduct: function() {
    return _.reduce(arguments, function(a, b) {
      return _.flatten(_.map(a, function(x) {
        return _.map(b, function(y) {
          return x.concat([y]);
        });
      }), true);
    }, [[]]);
  },

  degreesToRadians: function(degrees) {
    return degrees * Math.PI / 180;
  }
};
