.PHONY: build clean deploy lint start test unit watch

node_modules:
	@npm install

start: node_modules
	@node_modules/.bin/parcel -p 4001 index.html

build: node_modules
	@node_modules/.bin/parcel build index.html --public-url ./

sounds:
	@node_modules/.bin/audiosprite -e mp3 -f howler -o assets/sounds assets/audio/*.wav

deploy: build
	@aws s3 sync ./dist/ s3://risk.joshbassett.info/ --acl public-read --delete --cache-control 'max-age=300'

test: unit lint

unit: node_modules
	@node_modules/.bin/mocha

watch: node_modules
	@node_modules/.bin/mocha -w

lint: node_modules
	@node_modules/.bin/standard "src/**/*.js" "test/**/*.js"

clean:
	@rm -rf dist node_modules sounds.*
