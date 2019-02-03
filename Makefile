.PHONY: build clean deploy lint start test unit watch

start:
	@npx parcel -p 4001 index.html

build:
	@npx parcel build index.html --public-url .

sounds:
	@npx audiosprite -e mp3 -f howler -o assets/sounds assets/audio/*.wav

deploy: build
	@aws s3 sync ./dist/ s3://risk.joshbassett.info/ --acl public-read --delete --cache-control 'max-age=300'

test: unit lint

unit:
	@npx jest

watch:
	@npx jest --watch

lint:
	@npx standard "src/**/*.js" "test/**/*.js"

clean:
	@rm -rf dist node_modules sounds.*
