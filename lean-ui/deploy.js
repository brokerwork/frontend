const path = require("path");
const fs = require("fs");
const OssEasy = require("oss-easy");

// oss配置
let oss = new OssEasy(
  {
    accessKeyId: "3GSvtzwKQ5lg8ohW",
    accessKeySecret: "R0W2VG3aXasaxvo67dRfefNKQv8nld"
  },
  "broker-assets"
);

const tasks = {};

function walk(dir) {
  let results = [];
  let list = fs.readdirSync(dir);
  list.forEach(fileName => {
    if (fileName.charAt(0) === ".") return;
    let file = `${dir}/${fileName}`;
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}
// http://broker-assets.oss-cn-hangzhou.aliyuncs.com/leanui/favicon.ico
// 普通文件
const APP_DIR = path.resolve("static-web");
walk(APP_DIR).forEach(f => {
  tasks[f] = f.replace(APP_DIR + "/", "leanui/");
});
// console.log(tasks);
// return;

oss.uploadFiles(tasks, err => {
  if (err) console.log("fail:", JSON.stringify(err));
  console.log(
    "===============================done==============================="
  );
});
