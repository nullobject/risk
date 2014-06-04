start:
	@node_modules/.bin/beefy src/index.js:bundle.min.js --open -- -r react -t [ envify --NODE_ENV development ] -t reactify

production:
	@node_modules/.bin/browserify src/index.js -r react -t reactify -g uglifyify -o bundle.min.js

lint:
	@node_modules/.bin/jshint src

unit:
	@node_modules/.bin/mocha

test: unit lint

.PHONY: start lint test
