#!/bin/bash
: '
======== ui deploy tool for operation team ========
example:
bash /var/lib/jenkins/workspace/jenkins-deploy/oss-trader-ui.sh dev-deploy $INTERNAL_VERSION $EXTERNAL_VERSION
'

PROJECT_NAME=$PROJECT_NAME
GIT_REPO=$GIT_REPO
#BUCKET_NAME=$BUCKET_NAME
PROJECT_CONSUL_KEY=$PROJECT_CONSUL_KEY

TASK=$1
INTERNAL_VERSION_OR_TAG=$2
EXTERNAL_VERSION=$3


TIME=`date "+%Y-%m-%d %H:%M"`
TARGET_ENV="dev"
INNER_VERSION_PREFIX=5.0
BOOT_RELEASE_DIR=/mnt/boot-release/$PROJECT_NAME
PROJECT_DIR=$WORKSPACE
GIT_BRANCH=

function parse_deploy_env ()
{
        case $TASK in 
                "dev-deploy")
                        TARGET_ENV="dev"
                        PROMOTE_FROM_DIR="dev"
                        TASK="dev-deploy"
                        PROJECT_DIR=/var/lib/jenkins/workspace/${PROJECT_NAME}-dev
                        GIT_BRANCH=dev
                        ;;
                "qa-deploy")
                        TARGET_ENV="qa"
                        PROMOTE_FROM_DIR="qa"
                        TASK="qa-deploy"
                        PROJECT_DIR=/var/lib/jenkins/workspace/${PROJECT_NAME}-qa
                        GIT_BRANCH=qa
                        ;;
                "prod-deploy")
                        TARGET_ENV="prod"
                        PROMOTE_FROM_DIR="prod"
                        TASK="prod-deploy"
                        PROJECT_DIR=/var/lib/jenkins/workspace/${PROJECT_NAME}-prod
                        GIT_BRANCH=master
                        ;;
                *)
                        TARGET_ENV="dev"
                        PROMOTE_FROM_DIR="dev"
                        TASK="dev-deploy"
                        PROJECT_DIR=/var/lib/jenkins/workspace/${PROJECT_NAME}-dev
                        GIT_BRANCH=dev
                        ;;
        esac
}

function prepare ()
{
        echo "Shell Variables: PROJECT_DIR:$PROJECT_DIR"
        cd $PROJECT_DIR
        rm -rf *
        rm -rf .??*
        local COMMIT_SHA=
        if [ $INTERNAL_VERSION_OR_TAG = "latest" ] ; then
                COMMIT_SHA=$GIT_BRANCH
		else 
			COMMIT_SHA=$INTERNAL_VERSION_OR_TAG
        fi
        git clone $GIT_REPO .
				echo "try to checkout: $COMMIT_SHA"
        git checkout $COMMIT_SHA
        npm install --registry=https://registry.npm.taobao.org
}

function deploy ()
{
        cd $PROJECT_DIR
                npm run vendor:prod
		npm run build:${TARGET_ENV} -- --env.version=${EXTERNAL_VERSION}
                npm run deploy:${TARGET_ENV} -- ${EXTERNAL_VERSION}
}

function updateConsulVersion()
{
        local UI_VERSION=$1
        local CONSUL_KEY=$PROJECT_CONSUL_KEY
        local CONSUL_VALUE=$UI_VERSION
        local DEV_CONSUL_HOST=http://dev.consul.tools.lwork.com/v1/kv/$CONSUL_KEY
        local QA_CONSUL_HOST=http://qa.consul.tools.lwork.com/v1/kv/$CONSUL_KEY
        local PROD_CONSUL_HOST=http://consul.tools.lwork.com/v1/kv/$CONSUL_KEY
        local CONSUL_URL=
        if [ $TARGET_ENV == "dev" ] ; then
                CONSUL_URL=$DEV_CONSUL_HOST
        elif [ $TARGET_ENV == "qa" ] ; then
                CONSUL_URL=$QA_CONSUL_HOST
        elif [ $TARGET_ENV == "prod" ] ; then
                CONSUL_URL=$PROD_CONSUL_HOST
        fi
        echo ">>> adding $CONSUL_VALUE to $CONSUL_URL"
        curl -X PUT -H "Cache-Control: no-cache" -d "$CONSUL_VALUE" $CONSUL_URL
}

function save_build_history()
{
        local REV=`git log -n 1 --pretty=format:"%H"`
        local ARCHIVE_VERSION=$INTERNAL_VERSION_OR_TAG
        if [ $INTERNAL_VERSION_OR_TAG = "latest" ] ; then
             ARCHIVE_VERSION=$INNER_VERSION_PREFIX.$BUILD_NUMBER   
        fi
        echo  $REV > $BOOT_RELEASE_DIR/$TARGET_ENV/$ARCHIVE_VERSION
        echo ">>> save_build_history done. $ARCHIVE_VERSION=>$REV"
}

# main goes here
parse_deploy_env
prepare
deploy
updateConsulVersion $EXTERNAL_VERSION
save_build_history

