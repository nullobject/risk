var _ = require('lodash');
var Bacon = require('bacon.js');
var d3 = require('d3');
var Core = require('./core')

var RADIUS = 32,
    ROWS = 10,
    COLS = 10,
    PADDING = 0;

var r = RADIUS * Math.cos(Core.degreesToRadians(30));
var h = RADIUS * Math.sin(Core.degreesToRadians(30));
var d = PADDING / 2 / Math.tan(Core.degreesToRadians(30));

function calculatePosition(origin, col, row) {
  var width = (2 * r) + PADDING,
      height = RADIUS + h + d;
  return {
    x: origin.x + (col * width) + ((row % 2) * (width / 2)),
    y: origin.y + (row * height)
  };
}

function calculateHexagon(points) {
  var p = calculatePosition({x: 0, y: 0}, points[0], points[1]);
  return [
    [p.x,     p.y                 ],
    [p.x + r, p.y + h             ],
    [p.x + r, p.y + RADIUS + h    ],
    [p.x,     p.y + RADIUS + h + h],
    [p.x - r, p.y + RADIUS + h    ],
    [p.x - r, p.y + h             ]
  ];
}

var points = Core.cartesianProduct(_.range(COLS), _.range(ROWS)),
    verticies = points.map(calculateHexagon);

var svg = d3
  .select('.container')
  .append('svg')
  .attr('width', 640)
  .attr('height', 480)
  .append('g');

var polygon = svg.selectAll('polygon').data(verticies);
polygon.enter().append('svg:polygon');
polygon.attr('points', function(d, i) { return d.join(" "); });
