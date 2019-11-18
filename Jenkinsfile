pipeline {
  agent any
  parameters {
      choice(
        description: '选择要上线的环境',
        name: 'environment',
        choices: [ 'test', 'online']
      )
    string(
        description: 'Tag/分支',
        name: 'tag',
        defaultValue: 'v1.0.0',
    )
  }

  stages {
    stage('Prepare') {
        steps {
              echo "build_tag: ${params.environment}"
              echo "build_tag: ${tag}"
              sh "git fetch --tags && git fetch && git checkout ${tag}"
              sh "git branch"
        }
    }
    stage('build') {
        steps {
          script {
            sh 'echo "---------项目构建结束----------------"'
              sh 'chmod u+x ./deploy/fe.sh'
              sh "./deploy/fe.sh  ${params.environment}"
              sh 'echo "---------项目构建结束----------------"'
            }
        }
    }

    stage('build-image') {
      steps {
        script {
            echo "===========创建镜像========"
             sh 'chmod u+x ./deploy/build.sh'
             sh "./deploy/build.sh ${params.environment} ${tag}"
            echo "===========镜像创建完成========"
        }
      }
    }

    stage('deploy') {
      steps {
        echo "===========部署中========"
        sh 'chmod u+x ./deploy/deploy.sh'
        sh "./deploy/deploy.sh ${params.environment} ${tag}"
        echo "===========部署完成========"
      }
    }

  }
}