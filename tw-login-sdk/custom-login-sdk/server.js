var path = require('path');
var fs = require('fs');
var express = require('express');
var server = express();

function mount(server) {
    server.all('/api/v1*', function (req, res, next) {
        console.log(`client request: ${req.path}`);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('x-mock-server', true);
        var localFilePath = path.resolve(__dirname, `./json${req.path}.json`);
        console.log(`server response: ${localFilePath}`);
        try {
            let data = fs.readFileSync(localFilePath, 'utf-8');
            if (data) {
                res.end(data);
            }
            else {
                next();
            }
        } catch (e) {
            console.log('local json not found, route request to backend server')
            next();
        }

    })
}

module.exports = {
    mount: mount
}
