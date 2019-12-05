#!/bin/bash

ENV=$1
IMGTAG=$2
WEBNAME=school-events-mobile-fe-${ENV}

echo $ENV
echo $IMGTAG
echo $WEBNAME

if [[ $ENV = 'online' ]]; then
  echo "开始部署"
  curl "https://cs.console.aliyun.com/hook/trigger?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHVzdGVySWQiOiJjZDhiNDkxODZmNTc2NGFmOGEzODVjMTMzNmIwOTY4MWQiLCJpZCI6IjUwNjcyIn0.HjxpHblHTrWT2D0fRBz7RYaP8fS66avRiPdNP8jDuZOwSo_65cKFuJJB79CIUA2nmEhcwEa2IlV_qP-_hgSDhtxxBWjX2VXjHkeQeIi4H4hw8J3W3d_YkRBU7x8Qz7ftXtQgHhbCTYr-nNvZlmDK4d46DiERJxJ7ZinGNY_VnOY"
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
      docker run  -i -t -d -v /var/www/html/school-events-mobile/dist -p 9003:80 --name $WEBNAME  dockerhub.wdcloud.cc/school-events-mobile-fe-${ENV}:$IMGTAG
      docker stop school-c-web
      docker rm school-c-web
      docker run  -i -t -d --volumes-from school-events-pc-fe-test --volumes-from school-events-mobile-fe-test --volumes-from school-events-www-fe-test -p 9600:80 --name school-c-web  dockerhub.wdcloud.cc/school-events-rd:dev
fi

echo 'deploy successfully, 操作成功拉'