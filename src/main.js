/* jshint browser:true */

'use strict';

require('./style.less');

var GameController = require('./game_controller');

new GameController({
  el:     document.getElementsByClassName('container')[0],
  width:  800,
  height: 600
});
