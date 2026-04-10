var OssEasy = require("oss-easy");
var gutil = require('gulp-util');
var path = require('path');
var process = require('process');
var argv = require('minimist')(process.argv.slice(1));
var fs = require('fs-extra');
var exec = require('child_process').exec;
var temp_dir = path.resolve(__dirname, 'temp');
var walk = require('./libs/walk');
var OssFactory = require('./libs/oss');
var config = require('./config');
var uploader = require('./libs/upload');

var env = argv.env; // test, qa, prod
var bucketName = argv.bucket;
var version = argv.version;
if (env == null || bucketName == null || version == null) {
	console.log('parameter env,bucket,version must be specified!')
	process.exit(-1);
}
var localDir = path.resolve(__dirname, `../../dist/${version}`)
var remoteDir = `mobile/${env}/${version}`;

uploader.uploadDir(localDir, remoteDir)
