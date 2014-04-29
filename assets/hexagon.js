var Core = require('./core')

function calculateVertices(position, radius) {
  var r = radius * Math.cos(Core.degreesToRadians(30));
  var h = radius * Math.sin(Core.degreesToRadians(30));

  return [
    [position.x + r,       position.y                   ],
    [position.x + (2 * r), position.y + h               ],
    [position.x + (2 * r), position.y + h + radius      ],
    [position.x + r,       position.y + (2 * h) + radius],
    [position.x,           position.y + h + radius      ],
    [position.x,           position.y + h               ]
  ];
}

var Hexagon = function(position, radius) {
  this.vertices = calculateVertices(position, radius);
};

Hexagon.prototype = {
  selected: false
};

module.exports = Hexagon;
