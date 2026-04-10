/**
 * sync latest index.js from ta project
 * modify 'project_dir' to your path before run this script
 */
var path = require('path');
var argv = require('minimist')(process.argv.slice(1));
var shelljs = require('shelljs');
var project_dir = '/Users/zhangqingfeng/projects/ta';
var current_dir = shelljs.pwd();
var sdk_dir = `${current_dir}/custom-login-sdk`;
var sdk_dist_dir = `${current_dir}/custom-login-sdk/dist`;
var sdk_output_dir = `${current_dir}/dist/sdk`;

function clean() {
	shelljs.rm('-rf', `dist/*`);
	shelljs.mkdir('-p', sdk_output_dir);
}

function build() {
	shelljs.cd(project_dir);
	shelljs.exec('webpack --config webpack.customlogin.config.js');
}

function copy() {
	shelljs.cp('-rf', `${project_dir}/dev/dist/css/themes-default.css`, `${sdk_output_dir}`);
	shelljs.cp('-rf', `${project_dir}/dev/dist/css/libs`, `${sdk_output_dir}`);
	shelljs.cp('-rf', `${project_dir}/tools/custom-login-sdk/js/index.js`, `${sdk_output_dir}`);
	shelljs.cp('-rf', `${project_dir}/dev/dist/externals/gt.js`, `${sdk_output_dir}`);
	if (argv.debug) {
		shelljs.cp('-rf', `${project_dir}/dev/dist/css/themes-default.css`, `${sdk_output_dir}/themes-default_debug.css`);
		shelljs.cp('-rf', `${project_dir}/tools/custom-login-sdk/js/index.js`, `${sdk_output_dir}/index_debug.js`);
	}
}

function archive(){
	shelljs.cp('-rf', `${sdk_output_dir}/*`, `${current_dir}/archives`);
}

clean();
build();
copy();
archive();

shelljs.echo(`all process done. SDK is generated at ${sdk_output_dir}`);