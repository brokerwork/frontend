var OssEasy = require("oss-easy");
var config = require('../config');

var OssFactory = {
  create: function(options, bucketName){
    var cfg = Object.assign({}, config.ossOptions, options)
    var oss = new OssEasy(cfg, bucketName);
    return oss;
  }
}

module.exports = OssFactory;
