const path = require("path");
const fs = require("fs");
const OssEasy = require("oss-easy");
const {
  version,
  _version,
  ossFolder,
  vendorPath
} = require("./webpack/config.js");
// deploy files to prod folder
// example: node deploy --evn.folder prod
// this command will deploy file to prod folder on oss
const appVersion = process.argv.slice(-1)[0] || version;

// oss配置
let oss;
if (process.env.NODE_ENV === "production" || ossFolder === "" || true) {
  //生产环境oss
  oss = new OssEasy(
    {
      accessKeyId: "LTAI4Fovs3KRXL7Un5ybCo5D",
      accessKeySecret: "RsXLqBv4GEW1IkrUYNvDvdmk4fCYJN"
    },
    "traderaccount-dev"
  );
} else {
  oss = new OssEasy(
    {
      accessKeyId: "LTAIxBZ3bWy3fqPz",
      accessKeySecret: "y4SS2jUInR8Or5ZL1KvUQdvD6BsWUf"
    },
    "traderaccount-dev"
  );
}

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
const APP_DIR = path.resolve("dist", appVersion);
walk(APP_DIR).forEach(f => {
  // let filename = f.split('/')
  // filename = filename.pop()
  // if (filename.charAt(0) === '.' || f.match(/\/dll\//g)) return false
  tasks[f] = f.replace(APP_DIR, `trader-work${ossFolder}/${appVersion}`);
});
const STATIC_DIR = path.resolve("dist", "static");
walk(STATIC_DIR).forEach(f => {
  // let filename = f.split('/')
  // filename = filename.pop()
  // if (filename.charAt(0) === '.' || f.match(/\/dll\//g)) return false
  tasks[f] = f.replace(STATIC_DIR, `trader-work${ossFolder}/static`);
});
const vendorFile = `vendor.min-${_version}.js`;
const vendor = path.resolve(vendorPath, vendorFile);
tasks[vendor] = `trader-work${ossFolder}/${vendorFile}`;

oss.uploadFiles(tasks, err => {
  if (err) console.log("fail:", JSON.stringify(err));
  console.log(
    "===============================done==============================="
  );
});
