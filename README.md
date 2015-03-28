# Hexgrid

[![Build Status](https://travis-ci.org/nullobject/hexgrid.svg?branch=master)](https://travis-ci.org/nullobject/hexgrid)

## The game

The game is played with two or more players on a map. The object of the game is
for a player to occupy every country on the map. Players take turns advancing
their armies or attacking other countries.

During their turn, a player chooses one of their occupied countries and a
neighbouring country. If a neighbouring country is occupied then the player
will attack, otherwise the player will move armies into the unoccupied country.
A player may only move or attack from an occupied country with two or more
armies. During a turn a player can move or attack as many times as they wish.

At the end of their turn, a player is rewarded a number of additional armies.
They can place these armies in any of their occupied countries.

## Contribute

### Develop

Run the development server:

```sh
> make up
```

Open `http://localhost:8080/webpack-dev-server/` in your browser. Any changes
to the app will be live reloaded.

### Build

Build the app:

```sh
> make production
```

### Test

Run the tests:

```sh
> make test
```

## License

Hexgrid is licensed under the MIT license. See the
[LICENSE](https://github.com/nullobject/hexgrid/blob/master/LICENSE.md) file
for more details.
