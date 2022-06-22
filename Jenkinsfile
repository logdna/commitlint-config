library 'magic-butler-catalogue'

def PROJECT_NAME = "commitlint-config-mezmo"
def CURRENT_BRANCH = [env.CHANGE_BRANCH, env.BRANCH_NAME]?.find{branch -> branch != null}
def DEFAULT_BRANCH = 'main'

pipeline {
  agent none

  options {
    timestamps()
    ansiColor 'xterm'
  }

  environment {
    GITHUB_TOKEN = credentials('github-api-token')
    NPM_CONFIG_CACHE = '.npm'
    NPM_CONFIG_USERCONFIG = '.npmrc'
    SPAWN_WRAP_SHIM_ROOT = '.npm'
  }

  stages {
    stage('Test Suite') {
      matrix {
        axes {
          axis {
            name 'NODE_VERSION'
            values '12', '14', '16'
          }
        }

        when {
          beforeAgent true
          not {
            changelog '\\[skip ci\\]'
          }
        }

        agent {
          docker {
            image "us.gcr.io/logdna-k8s/node:${NODE_VERSION}-ci"
            customWorkspace "${PROJECT_NAME}-${BUILD_NUMBER}"
          }
        }

        stages {
          stage('Test') {
            steps {
              script {
                sh "mkdir -p ${NPM_CONFIG_CACHE}"
                sh 'npm install'
                sh 'npm run commitlint'
                sh 'npm test'
              }
            }

            post {
              always {
                junit 'coverage/test.xml'
                publishHTML target: [
                  allowMissing: false,
                  alwaysLinkToLastBuild: false,
                  keepAll: true,
                  reportDir: 'coverage/lcov-report',
                  reportFiles: 'index.html',
                  reportName: "coverage-node-v${NODE_VERSION}"
                ]
              }
            }
          }
        }
      }
    }

    stage('Test Release') {
      when {
        beforeAgent true
        not {
          branch DEFAULT_BRANCH
        }
      }

      agent {
        node {
          label 'ec2-fleet'
          customWorkspace "${PROJECT_NAME}-${BUILD_NUMBER}"
        }
      }

      tools {
        nodejs 'NodeJS 14'
      }

      environment {
        GIT_BRANCH = "${CURRENT_BRANCH}"
        BRANCH_NAME = "${CURRENT_BRANCH}"
        CHANGE_ID = ""
        NPM_TOKEN = credentials('npm-publish-token')
      }

      steps {
        script {
          sh "mkdir -p ${NPM_CONFIG_CACHE}"
          sh 'npm install'
          sh "npm run release:dry"
        }
      }
    }

    stage('Release') {
      when {
        beforeAgent true
        branch DEFAULT_BRANCH
        not {
          changelog '\\[skip ci\\]'
        }
      }

      agent {
        node {
          label 'ec2-fleet'
          customWorkspace "${PROJECT_NAME}-${BUILD_NUMBER}"
        }
      }

      tools {
        nodejs 'NodeJS 14'
      }

      environment {
        GIT_BRANCH = "${CURRENT_BRANCH}"
        BRANCH_NAME = "${CURRENT_BRANCH}"
        CHANGE_ID = ""
        NPM_TOKEN = credentials('npm-publish-token')
      }

      steps {
        script {
          sh "mkdir -p ${NPM_CONFIG_CACHE}"
          sh 'npm install'
          sh 'npm run release'
        }
      }
    }
  }
}
