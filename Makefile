.DEFAULT_GOAL := default

wechat:
	rm -rf dist
	npm run build:mp-weixin

commit:
	git add .
	git commit -m "fix: fix bug"
	git push origin

default: commit wechat

release: commit
	rm -rf dist
	npm run build:mp-weixin:api_online
