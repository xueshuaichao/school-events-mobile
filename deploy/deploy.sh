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
    echo "开始部署测试"
    curl "http://proxy.k8s.wdcloud.cc/api/deploy/aitiaozhan/atz-c"
fi

echo 'deploy successfully, 操作成功拉'
