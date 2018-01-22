/* jshint browser:true */

import './style.less';
import GameController from './game_controller';

new GameController({
  el:     document.getElementsByClassName('container')[0],
  width:  800,
  height: 600
});
