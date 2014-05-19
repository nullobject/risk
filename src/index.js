var GameController = require('./game_controller');

new GameController({
  el:     document.getElementsByClassName('container')[0],
  width:  640,
  height: 480
});
