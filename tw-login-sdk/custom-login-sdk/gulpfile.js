var gulp = require('gulp');

gulp.task('server', function () {
    var express = require('express');
    var apiServer = require('./server');
    var open = require('opn');
    var fs = require('fs')
    var path = require('path');
    var app = express();
    app.use(express.static('.', { index: 'dist/index.html' }));
    app.use('/app', function (req, res) {
        var html = fs.readFileSync(path.resolve('dist/index.html'));
        res.end(html)
    })
    apiServer.mount(app);
    app.listen(3000);
});

gulp.task('htmlreplace', function (cb) {
    var replace = require('gulp-replace-task');
    gulp.src('./index.html')
        .pipe(replace({
            patterns: [
                {
                    match: '${pathPrefix}',
                    replacement: ''
                }
            ]
        }))
        .pipe(gulp.dest('./dist'));
    cb();
})

gulp.task('watch', function (cb) {
    console.log('start gulp watch...')
   return gulp.watch('./index.html', ['htmlreplace'])
});