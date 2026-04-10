var gulp = require('gulp');
var runSequence = require('gulp-run-sequence');
var rename = require('gulp-rename');
var del = require('del');
var output = './dev/dist';

function compileCSS(isWatch){
    if (isWatch){
        gulp.watch('./css/**/*.css', function(){
            compile();
        })
    }else{
        compile();
    }

    function compile(){
        var postcss = require('gulp-postcss');
        var processors = [
            require('postcss-color-function'),
            require('autoprefixer'),
            require('precss'),
            require('postcss-assets')({loadPaths:['./images/']})
        ];
        gulp.src('./css/**/*.css')
            .pipe(postcss(processors))
            .pipe(gulp.dest(output));
        console.log('compile css done');
    }
}

function compileJS(isWatch){
    var path = require('path');
    var webpack = require('webpack');
    var cfg = isWatch ? require('./webpack.dev.config.js') : require('./webpack.prod.config.js');
    var compiler = webpack(cfg);
    if (isWatch){
        compiler.watch({ // watch options:
            aggregateTimeout: 300, // wait so long for more changes
            poll: true // use polling instead of native watchers
            // pass a number to set the polling interval
        }, function(err, stats) {
            if (err){
                console.error(err)
            }
            console.log("recompile js done");
        });
    }else{
        compiler.run(function(err, stats) {
           if (err){
               console.error(err);
           }
           console.log("done js compile");
        });
    }
    
}

function compileHTML(isWatch){
    if (isWatch){
        gulp.watch('./*.html', function(){
            gulp.src('./*.html')
                .pipe(gulp.dest(output))
        })
    }else{
        gulp.src('./*.html')
                .pipe(gulp.dest(output))
    }
}

gulp.task('prepareCDN', function(){
    // var exec = require('child_process').exec;
    // return exec('node tools/cdn_copy.js')
    var npmPkgNames = ['./node_modules/jquery/**/*', './node_modules/moment/**/*',
        './node_modules/react/**/*', './node_modules/react-dom/**/*'];
    return gulp.src(npmPkgNames, {base: './node_modules'})
        .pipe(gulp.dest('./cdn'));

});

gulp.task('clean', function(){
    var clean = require('gulp-clean');
    return del([output, './cdn'])
});

gulp.task('copyBs3Images', function(){
    gulp.src(['./resources/**/images/*'], {base:'.'})
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(`${output}/images`));
});

gulp.task('htmlreplace', function(){
    var replace = require('gulp-replace-task');
    gulp.src('./html/**/*.html')
        .pipe(replace({
            patterns:[
                {
                    match: '${staticPath}',
                    replacement: 'http://localhost:8090/dev'
                },
                {
                    match: '${staticVersion}',
                    replacement: '0.0.0'
                }
            ]
        }))
        .pipe(gulp.dest('./dev/dist/html'));
});

gulp.task('resources', ['copyBs3Images', 'htmlreplace'], function(){
    return gulp.src(['./resources/**/*', './images/**/*', './cdn/**/*', './*.html'], {base:'.'})
        .pipe(gulp.dest(output))
});

gulp.task('css', function(){
    compileCSS(false);
});

gulp.task('js', function(){
    compileJS(false);
});

gulp.task('css-watch', function(){
    compileCSS(true);
});

gulp.task('js-watch', function(){
    compileJS(true);
});

gulp.task('html-watch', function(){
    compileHTML(true);
});

gulp.task('server', function(){
    var proxy = require('express-http-proxy');
    var express = require('express');
    var app = express();
    app.use(express.static('.'));
    app.use('/', proxy('broker.btmsc.lwork.com'));
    app.use('/dev', proxy('localhost'));
    app.listen(8090);
});

gulp.task('geetestserver', function(){
    var exec = require('child_process').exec;
    exec('node tools/geetest_server.js')
});

gulp.task('dev', function(){
    runSequence('clean', 'prepareCDN', 'resources', 'css', 'html-watch', 'css-watch', 'js-watch', 'geetestserver', 'server');
});

gulp.task('build', function(){
   return runSequence('clean', 'prepareCDN', 'resources', 'css', 'js');
});

gulp.task('remotedev', function(){
    runSequence('clean', 'prepareCDN', 'resources', 'css', 'js', 'html-watch', 'css-watch', 'js-watch', 'geetestserver');
});
