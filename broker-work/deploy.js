const path = require('path');
const argv = require('yargs').argv;
const fs = require('fs');
const OssEasy = require('oss-easy');
const config = require('./webpack_config/base.js');

// deploy files to prod folder
// example: node deploy --evn.folder prod
// this command will deploy file to prod folder on oss
let DIST_DIR = 'dist2';
let REMOTE_DIR = argv.folder || 'test';
if (argv.folder === 'grey') {
  REMOTE_DIR = 'qa';
  DIST_DIR = 'dist3';
}
const WORKING_DIR = path.resolve('./dist');

// oss配置
let ACCESS_KEY_ID = 'LTAISQQCPcR3XQtt';
let ACCESS_KEY_SECRET = 'SrH31J9JkKHLBI6Yd5zdyNrn6y4FqT';
let BUCKET_NAME = 'broker-static-dev';

/// 生产环境，需要单独传入阿里云在生成环境的bucket id 与 密钥
if (argv.env === 'production') {
  if (argv.accessKeyId && argv.accessKeySecret) {
    ACCESS_KEY_ID = argv.accessKeyId;
    ACCESS_KEY_SECRET = argv.accessKeySecret;
    BUCKET_NAME = 'broker-static';
  } else {
    console.log('编译错误, 请填写密钥！');
    return;
  }
}

const oss = new OssEasy(
  {
    accessKeyId: ACCESS_KEY_ID,
    accessKeySecret: ACCESS_KEY_SECRET
  },
  BUCKET_NAME
);

const tasks = {};
function walk(dir) {
  let results = [];
  let list = fs.readdirSync(dir);
  list.forEach(fileName => {
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
walk(WORKING_DIR).forEach(f => {
  let filename = f.split('/');
  filename = filename.pop();
  if (filename.charAt(0) === '.' || f.match(/\/dll\//g)) return false;
  tasks[f] = f.replace(WORKING_DIR, `${REMOTE_DIR}/${DIST_DIR}`);
});
// Dll 包
if (argv.dll) {
  const dllVersion = config.dllVersion;
  const dllPath = path.resolve(`./webpack_config/dll_lib/${dllVersion}/prod/`);
  walk(dllPath).forEach(f => {
    let filename = f.split('/');
    filename = filename.pop();
    // 去除隐藏\map\json文件
    if (filename.charAt(0) === '.' || /(\.map|\.json)/gi.test(filename))
      return false;
    if (/css$/gi.test(f)) {
      const style = Buffer.from(fs.readFileSync(f)).toString();
      let result = '';
      if (REMOTE_DIR === 'test') {
        result = style.replace(
          /static.lwork.com\/prod\/dist2\/fonts/gm,
          'broker-static-dev.oss-cn-hangzhou.aliyuncs.com/test/dist2/fonts'
        );
      } else {
        result = style.replace(
          /broker-static-dev.oss-cn-hangzhou.aliyuncs.com\/test\/dist2\/fonts/gm,
          'broker-static.oss-cn-hangzhou.aliyuncs.com/prod/dist2/fonts'
        );
      }
      fs.writeFileSync(f, result);
    }
    // 字体，图片文件, json，传到对应的文件夹中，不放到dll包里
    if (/(\/fonts\/|\/images\/)/gi.test(f)) {
      tasks[f] = f.replace(dllPath, `${REMOTE_DIR}/${DIST_DIR}`);
    } else {
      tasks[f] = f.replace(
        dllPath,
        `${REMOTE_DIR}/${DIST_DIR}/dll/${dllVersion}`
      );
    }
  });
}

oss.uploadFiles(tasks, err => {
  if (err) console.log(JSON.stringify(err));
  console.log(
    '===============================done==============================='
  );
});
