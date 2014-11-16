.PHONY: clean lint production start test unit

start: node_modules
	@node_modules/.bin/webpack-dev-server --colors -d

production: node_modules
	@NODE_ENV=production node_modules/.bin/webpack --colors --progress -p

test: unit lint

clean:
	@rm -rf doc node_modules

node_modules:
	@npm install

unit:
	@node_modules/.bin/mocha

lint:
	@node_modules/.bin/jshint src
