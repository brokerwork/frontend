'use strict';

const TARGET = process.env.npm_lifecycle_event;
console.log('TARGET:'+TARGET)
const isProduction = process.argv.indexOf('-r') != -1;
let env = 'build';

switch (TARGET) {
  case 'start':
  case 'ios':
  case 'android':
    env = 'development';
}

if (!TARGET){
  env = 'development';
}

if (isProduction){
  env = 'production'
}

module.exports = env;
