
ts: install
	npx tsc

register: install
	npx ts-node src/deploy_commands.ts 

install: 
	npm i

