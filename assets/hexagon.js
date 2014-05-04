var core = require('./core')
var d3 = require('d3');

function calculateVertices(position, radius) {
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
  var vertices = calculateVertices(position, radius);
  vertices.__proto__ = Hexagon.prototype;
  vertices.centroid = d3.geom.polygon(vertices).centroid();
  return vertices;
};

Hexagon.prototype = [];

module.exports = Hexagon;
