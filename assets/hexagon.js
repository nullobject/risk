var _ = require('lodash');
var core = require('./core')

function calculatePoints(position, radius) {
  var r = radius * Math.cos(core.degreesToRadians(30));
  var h = radius * Math.sin(core.degreesToRadians(30));

  return [
    [position.x,           position.y + h               ],
    [position.x + r,       position.y                   ],
    [position.x + (2 * r), position.y + h               ],
    [position.x + (2 * r), position.y + h + radius      ],
    [position.x + r,       position.y + (2 * h) + radius],
    [position.x,           position.y + h + radius      ]
  ];
}

var Hexagon = function(position, radius) {
  this.vertices = calculatePoints(position, radius);
};

Hexagon.prototype = {
  selected: false,

  // Returns true if the polygon contains a given vertex, false otherwise.
  containsVertex: function(v) {
    return _.some(this.vertices, function(w) {
      return _.isEqual(v, w);
    });
  }
};

module.exports = Hexagon;
