var path = require('path');
var process = require('process');
var fs = require('fs');

var REMOTE_DIR = 'test';
const WORKING_DIR = path.resolve('./dev');
const ACCESS_KEY_ID = "3GSvtzwKQ5lg8ohW";
const ACCESS_KEY_SECRET = "R0W2VG3aXasaxvo67dRfefNKQv8nld";
const BUCKET_NAME = 'broker-static';

var OssEasy = require("oss-easy");
var ossOptions = {
    accessKeyId : ACCESS_KEY_ID,
    accessKeySecret : ACCESS_KEY_SECRET
};
var oss = new OssEasy(ossOptions, BUCKET_NAME);

var tasks = {
    // '/Users/zhangqingfeng/jsfolder/oss2/src/app.js': "dev/src/app.js",
    // '/Users/zhangqingfeng/jsfolder/oss2/src/app2.js': "dev/src/app2.js",
};

var walk = function(dir) {

    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file))
        }else {
            results.push(file)
        }
    });
    return results
};

var files = [];

var resourceType = 'static'; // cdn or static
var rt = process.argv.indexOf('--rt');
if (rt !== -1) {
    resourceType = process.argv[rt + 1];
}
var cwd = process.cwd();

// deploy files to prod folder
// example: node deploy --folder prod
// this command will deploy file to prod folder on oss
var folder = process.argv.indexOf('--folder');
if (folder !== -1) {
  REMOTE_DIR = process.argv[folder + 1] || 'test';
}

switch(resourceType){
    case 'cdn':
    {
        files = walk(path.resolve('.', './dev/dist/cdn'));
        files = files.concat(walk(path.resolve('.', './dev/dist/resources')))
        files.forEach((f)=>{
           tasks[f] = f.replace(WORKING_DIR, REMOTE_DIR);
        })
        break;
    }
    case 'static':
    {
        files = walk(path.resolve('.', './dev/dist'));
        files.forEach((f)=>{
           tasks[f] = f.replace(WORKING_DIR, REMOTE_DIR);
        })
        for (var key in tasks){ //排出上传 cdn 和 resources 这2个目录, 这2目录预先发布到oss了.
            if (key.indexOf('cdn') != -1 || key.indexOf('resources') != -1) {
                delete tasks[key];
            }
        }
        break;
    }
}
//console.log(tasks);

oss.uploadFiles(tasks, function(err) {
    if(err) console.log(err);
    console.log('done')
});