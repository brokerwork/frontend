var argv = require('minimist')(process.argv.slice(1));
var shelljs = require('shelljs');
var project_dir = '/Users/zhangqingfeng/projects/ta';
var current_dir = shelljs.pwd();
var sdk_dir = `${current_dir}/custom-login-sdk`;
var sdk_dist_dir = `${current_dir}/custom-login-sdk/dist`;
var sdk_output_dir = `${current_dir}/dist`;

function clean() {
	shelljs.rm('-rf', `${sdk_output_dir}/*`);
}

function build(){
	shelljs.exec('zip -r dist/custom-login-sdk.zip custom-login-sdk -x custom-login-sdk/node_modules\\*');
}

clean();
build();

shelljs.echo(`zip created at ${sdk_output_dir}`)
