#!/bin/bash

ENV=$1
IMGTAG=$2


if [[ $ENV = 'online' ]]; then
      docker login -u=wdcloudtoc -p=wdcloudInf@2019 registry.cn-beijing.aliyuncs.com
      docker build -t registry.cn-beijing.aliyuncs.com/wdcloudinf/aitiaozhan-c-mobile:${IMGTAG} -f deploy/Dockerfile .
      docker tag registry.cn-beijing.aliyuncs.com/wdcloudinf/aitiaozhan-c-mobile:${IMGTAG} registry.cn-beijing.aliyuncs.com/wdcloudinf/aitiaozhan-c-mobile:latest
      docker push registry.cn-beijing.aliyuncs.com/wdcloudinf/aitiaozhan-c-mobile:${IMGTAG}
      docker push registry.cn-beijing.aliyuncs.com/wdcloudinf/aitiaozhan-c-mobile:latest
      docker logout registry.cn-beijing.aliyuncs.com
else
      docker build -t dockerhub.wdcloud.cc/school-events-mobile-fe-${ENV}:${IMGTAG} -f deploy/Dockerfile .
      docker push  dockerhub.wdcloud.cc/school-events-mobile-fe-${ENV}:${IMGTAG}
fi


