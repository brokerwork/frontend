var OssEasy = require("oss-easy");
var gutil = require('gulp-util');
var path = require('path');
var process = require('process');
var argv = require('minimist')(process.argv.slice(1));
var fs = require('fs-extra');
var exec = require('child_process').exec;
var temp_dir = path.resolve(__dirname, 'temp');
var walk = require('./walk');
var OssFactory = require('./oss');
var config = require('../config');

/**
 * 
 * @param {*} localFile 
 * @param {string|func} remoteFile 
 */
function uploadFile(localFile, remoteFile) {
	if (typeof remoteFile === 'function') {
		remoteFile = remoteFile(localFile);
	}
	var localRemotePathMap = {};
	localRemotePathMap[localFile] = remoteFile;
	$upload(localRemotePathMap, config.ossOptions, config.bucketName);
}
/**
 * 
 * @param {*} localDir 
 * @param {string|func} remoteDir 
 */
function uploadDir(localDir, remoteDir) {
	console.log(`localDir: ${localDir}`);
	console.log(`remoteDir: ${remoteDir}`)
	var localRemotePathMap = getAllResources(localDir);
	var remotePath = remoteDir;
	if (typeof remoteDir === 'function'){
		remotePath = remoteDir();
	}
	for (let key in localRemotePathMap){
			let value = localRemotePathMap[key];
			localRemotePathMap[key] = value.replace(localDir, remotePath);
		}
	$upload(localRemotePathMap, config.ossOptions, config.bucketName);
}

function getAllResources(dir) {
	var map = {};
	var files = [];
	files = walk(path.resolve('.', dir));
	files.forEach((f) => {
		map[f] = f;
	})
	return map;
}

function $upload(localRemotePathMap, ossOptions, bucketName) {
	config.debug && console.log(`bucketName: ${bucketName}`);
	console.log(localRemotePathMap);
	var oss = OssFactory.create(ossOptions, bucketName);
	oss.uploadFiles(localRemotePathMap, function (err) {
		if (err) {
			console.log(err);
		};
		console.log('upload done')
	});
}

module.exports = {
	uploadFile: uploadFile,
	uploadDir: uploadDir,
	$upload: $upload
}