#!/bin/bash
# Build config for build.sh
APP_NAME=askwhichbrowserwindow
CHROME_PROVIDERS="content locale skin"
CLEAN_UP=1
ROOT_FILES=
ROOT_DIRS=
BEFORE_BUILD=
AFTER_BUILD="mv $APP_NAME.xpi ../release/"
