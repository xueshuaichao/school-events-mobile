#!/bin/bash

ENV=$1
IMGTAG=$2
WEBNAME=school-events-mobile-fe-${ENV}

echo $ENV
echo $IMGTAG
echo $WEBNAME

if [[ $ENV = 'online' ]]; then
  echo "开始部署"
 # curl https://cs.console.aliyun.com/hook/trigger?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHVzdGVySWQiOiJjZDhiNDkxODZmNTc2NGFmOGEzODVjMTMzNmIwOTY4MWQiLCJpZCI6IjYwMjYwIn0.M4RCfEeYcaW-atd7PEGi4PKRSC90nI7rbqOR_a0Pm9-1r2_RyO3rZwZSUrfBL919Yu5qSzo0vB1gt7oBXofpqlcS53-Dd7xO1CMasttp59NZqmbeYF1SUyTFAajrzdKO_lM8qnrpNcEeq3o8NYbxgUin1vCz9xbX8NhLpfdAyWc
else
   CONTAINER=`docker ps | grep ${WEBNAME} | awk -F ' ' '{if( $NF == "'"${WEBNAME}"'"    ) print $NF}'`

   if [ -n "$CONTAINER" ]; then
      docker kill $WEBNAME
      echo "kill  successfully, 操作成功拉"

   fi

   CONTAINER=`docker ps -a | grep ${WEBNAME} | awk -F ' ' '{if( $NF == "'"${WEBNAME}"'"    ) print $NF}'`
   if [ -n "$CONTAINER" ]; then
      docker rm $WEBNAME
      echo "rm  successfully, 操作成功拉"

   fi
   docker run  -i -t -d -p 9002:80 --name $WEBNAME  dockerhub.wdcloud.cc/school-events-mobile-fe-${ENV}:$IMGTAG
fi

echo 'deploy successfully, 操作成功拉'