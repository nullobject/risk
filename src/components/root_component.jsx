import * as core from '../core';
import Bacon from 'baconjs';
import React from 'react';

import ControlsComponent from './controls_component';
import GameComponent from './game_component';
import HexgridComponent from './hexgrid_component';
import PlayersComponent from './players_component';

export default class RootComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.game !== this.props.game;
  }

  render() {
    let stream = this.props.stream,
        game   = this.props.game;

    core.log('RootComponent#render');

    return (
      /* jshint ignore:start */
      <div className="game">
        <PlayersComponent currentPlayer={game.currentPlayer} game={game} />
        <svg width={game.world.width} height={game.world.height}>
          <HexgridComponent width={game.world.width} height={game.world.height} hexgrid={game.world.hexgrid} />
          <GameComponent stream={stream} game={game} />
          {this.renderGameOver(game)}
        </svg>
        <ControlsComponent currentPlayer={game.currentPlayer} stream={stream} />
      </div>
      /* jshint ignore:end */
    );
  }

  renderGameOver(game) {
    return game.over ? (
      /* jshint ignore:start */
      <g className="game-over">
        <rect width="100%" height="100%" />
      </g>
      /* jshint ignore:end */
    ) : null;
  }
}

RootComponent.propTypes = {
  game:   React.PropTypes.object.isRequired,
  stream: React.PropTypes.instanceOf(Bacon.Observable).isRequired
};
