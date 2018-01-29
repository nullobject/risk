.PHONY: clean lint production start test unit

start: node_modules
	@node_modules/.bin/parcel -p 4001 index.html

dist: node_modules
	@node_modules/.bin/parcel build index.html --public-url ./

test: unit lint

watch: node_modules
	@./node_modules/.bin/mocha -w

clean:
	@rm -rf node_modules

node_modules:
	@npm install

unit: node_modules
	@node_modules/.bin/mocha

lint: node_modules
	@node_modules/.bin/standard "*.js" "src/**/*.js" "test/**/*.js"
