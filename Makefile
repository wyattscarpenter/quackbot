build: install
	npx tsc

run: install 
	node build

register: build
	npx ts-node src/deploy_commands.ts 

install: 
	npm i


install-prod:
	npm i --omit=dev 

deploy: 
	node build/deploy_commands.js
	node build/index.js
