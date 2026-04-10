const path = require('path');
const argv = require('yargs').argv;
const fs = require('fs'); 
const OssEasy = require('oss-easy');
const config = require('./webpack_config/base.js');

// deploy files to prod folder
// example: node deploy --evn.folder prod
// this command will deploy file to prod folder on oss
const REMOTE_DIR = argv.folder || 'test';
const WORKING_DIR = path.resolve('./dist');

// oss配置
let ACCESS_KEY_ID = 'LTAIIvL6pgQfnmen';
let ACCESS_KEY_SECRET = 'bnH7vIvqW5XSaqGCRveNARNuVytf35';
let BUCKET_NAME = 'support-center-dev';

if (argv.env === 'production') {
  if (argv.accessKeyId && argv.accessKeySecret) {
    ACCESS_KEY_ID = argv.accessKeyId;
    ACCESS_KEY_SECRET = argv.accessKeySecret;
    BUCKET_NAME = 'support-center';
  } else {
    console.log('编译错误, 请填写密钥！');
    return;
  }
}

const oss = new OssEasy({
  accessKeyId: ACCESS_KEY_ID,
  accessKeySecret: ACCESS_KEY_SECRET
}, BUCKET_NAME);

const tasks = {};
function walk(dir) {
  let results = [];
  let list = fs.readdirSync(dir);
  list.forEach((fileName) => {
    file = `${dir}/${fileName}`;
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

// 普通文件
walk(WORKING_DIR).forEach((f) => {
  let filename = f.split('/');
  filename = filename.pop();
  if (filename.charAt(0) === '.' || f.match(/\/dll\//g)) return false; 
  tasks[f] = f.replace(WORKING_DIR, `${REMOTE_DIR}/dist`);
});

// Dll 包
if (argv.dll) {
  const dllVersion = config.dllVersion;
  const dllPath = path.resolve(`./webpack_config/dll_lib/${dllVersion}/prod/`);
  walk(dllPath).forEach((f) => {
    let filename = f.split('/');
    filename = filename.pop();
    // 去除隐藏\map\json文件
    if (filename.charAt(0) === '.' || /(\.map|\.json)/ig.test(filename)) return false;
    // 字体，图片文件, json，传到对应的文件夹中，不放到dll包里
    if (/(\/fonts\/|\/images\/)/ig.test(f)) {
      tasks[f] = f.replace(dllPath, `${REMOTE_DIR}/dist`);
    } else {
      tasks[f] = f.replace(dllPath, `${REMOTE_DIR}/dist/dll/${dllVersion}`);
    }
  });
}


oss.uploadFiles(tasks, (err) => {
  if (err) console.log(err);
  console.log('===============================done===============================');
});
