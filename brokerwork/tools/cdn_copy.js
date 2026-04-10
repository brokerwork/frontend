var shelljs = require('shelljs');

var npmPkgNames = ['jquery', 'moment', 'react', 'react-dom'];

npmPkgNames.forEach(name=>{
    console.log(`copying ${name} from node_modules...`);
    shelljs.cp('-R', `./node_modules/${name}`, './cdn/');
    console.log(`copying ${name} from node_modules done`);
});