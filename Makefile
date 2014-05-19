start:
	@node_modules/.bin/beefy src/index.js:bundle.min.js --open -- -t reactify

production:
	@node_modules/.bin/browserify src/index.js -t reactify -g uglifyify -o bundle.min.js

lint:
	@node_modules/.bin/jshint src

test:
	@node_modules/.bin/mocha --reporter spec

.PHONY: start lint test
