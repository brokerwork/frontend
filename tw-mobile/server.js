var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
const proxy = require('http-proxy-middleware')
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use(express.static(path.resolve('dist')))
app.use(express.static(path.resolve('dist/dev')))
const origin = 'http://trader.tamsc.lwork.com'
app.use('/api', proxy({ target: origin, changeOrigin: true }))
app.use('/v1', proxy({ target: origin, changeOrigin: true }))
app.use('/v2', proxy({ target: origin, changeOrigin: true }))
app.get('*', function(req, res) {
    res.sendFile(path.resolve('dist/dev', 'index.html'))
        // res.sendFile(path.resolve('test.html'))
})
app.all('*', (req, res, next) => {
    console.log(req.path)
    var filePath = `./mock/${req.path}.json`;
    if (fs.existsSync(filePath)) {
        var data = fs.readFileSync(filePath, { encoding: 'utf8' });
        res.json(JSON.parse(data))
    } else {
        next();
    }
})

app.get('/v3/weixin/connect/oauth2/authorize', (req, res) => {
    //1. wx post data on our backend callback url with `code`
    //2. our backend retrieve access_token using `code`
    //3. using access_token retrieve userinfo
    //4. base on wx unionid, register new user or login existing user.
    res.redirect('http://localhost:3000/index.html#/accounts')
})

app.get('/v1/wechat/pages/accounts', (req, res) => {
    res.redirect('http://localhost:3000/accounts.html')
})

app.listen(3003, '127.0.0.1', () => {
    console.log('server started at port 3003')
})