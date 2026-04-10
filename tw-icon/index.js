const path = require('path');
const fs = require('fs');
const OssEasy = require('oss-easy');

const WORKING_DIR = path.resolve('./tw-web-font');
const REMOTE_DIR = 'static/font';
const VERSION = require('./version.js');

// oss配置
let ACCESS_KEY_ID = '3GSvtzwKQ5lg8ohW';
let ACCESS_KEY_SECRET = 'R0W2VG3aXasaxvo67dRfefNKQv8nld';
let BUCKET_NAME = 'traderaccount';

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
const waitingUploadFiles = walk(WORKING_DIR);
// 普通文件
waitingUploadFiles.forEach(f => {
  let filename = f.split('/');
  filename = filename.pop();
  if (filename.charAt(0) === '.') return false;
  tasks[f] = f.replace(WORKING_DIR, `${REMOTE_DIR}/${VERSION}`);
});

oss.uploadFiles(tasks, err => {
  if (err) console.log(JSON.stringify(err));
  console.log(
    '===============================done==============================='
  );
  updateVersion(VERSION);
});

function updateVersion(v) {
  const content = `module.exports = ${(v * 10 + 1) / 10};`;
  fs.writeFile(`version.js`, content, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('version has updated!');
  });
} 


