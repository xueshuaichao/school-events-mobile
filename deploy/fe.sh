#!/usr/bin/env bash
export NODE_HOME=/home/bae/node-v10.16.0
export NODE_PATH=$NODE_HOME/lib/node_modules
export PATH=$PATH:$NODE_HOME/bin


echo '-------------------------'
node -v
npm -v
echo '-------------------------'
if [ -d "./node_modules/wdc-vue-components" ];then
    rm -rf ./node_modules/wdc-vue-components/
fi
npm i
npm run build
if [[ $1 = "online" ]];then
    echo "npm run host:pro";
    npm run build:api_online
fi

if [[ $1 = "test" ]];then
     echo "npm run host:test";
     npm run build:api_test
fi

