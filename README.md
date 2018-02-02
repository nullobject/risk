# Risk

[![Build Status](https://travis-ci.org/nullobject/risk.svg?branch=master)](https://travis-ci.org/nullobject/risk)

This is an implementation of the popular board game Risk.

The game of Risk is played with two or more players on a map. The object of the
game is to defeat the other players on the map. Players take turns advancing
their armies and attacking other countries.

During a player's turn, they may choose one of their occupied countries and a
neighbouring country. If the neighbouring country is occupied then the player
will attack, otherwise the player will move armies into the unoccupied country.
A player may only move or attack from an occupied country with two or more
armies. During a turn a player can move or attack as many times as they wish.

At the end of their turn, a player is rewarded a number of additional armies.
They can place these armies in any of their occupied countries.

## Development

To start a development server:

    > make start

To run the tests:

    > make test

To deploy the app:

    > make deploy

## Licence

The implementation of Risk is licensed under the MIT licence. See the
[LICENCE](https://github.com/nullobject/risk/blob/master/LICENCE.md) file for
more details.
