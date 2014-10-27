.PHONY: list production start test unit

start:
	@node_modules/.bin/webpack-dev-server --colors -d

production:
	@NODE_ENV=production node_modules/.bin/webpack --colors --progress -p

test: unit lint

lint:
	@node_modules/.bin/jshint src

unit:
	@node_modules/.bin/mocha
