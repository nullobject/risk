start:
	@node_modules/.bin/beefy src/index.js -- -t reactify

lint:
	@node_modules/.bin/jshint src

test:
	@node_modules/.bin/mocha --reporter spec

.PHONY: start lint test
