/**
 * 安装步骤：
 * 1、安装nodejs(https://nodejs.org/en/)
 * 2、安装依赖项。在命令行中执行：npm install
 * 3、npm install -g gulp
 * 4、npm install -g grunt
 *
 *
 *
 */




var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del');

var rev = require('gulp-rev');
//- 对文件名加MD5后缀

var revCollector = require('gulp-rev-collector');
//- 路径替换


//删除文件夹中的内容
gulp.task('clean', function() {
    del(["./dist/"]);
});

//压缩js
gulp.task('minifyCommonJS', function() {


    var jsArray = [
        './static/lib/jquery.min.js',
        './static/lib/react.min.js',
        './static/lib/react-dom.min.js',
        './static/lib/ReactRouter.min.js',
        './static/lib/redux.min.js',
        './static/lib/react-redux.min.js',
        './static/lib/history.min.js'
    ];

    return gulp.src(jsArray).pipe(concat('jquery-react-router-redux-history.js'))
        .pipe(gulp.dest('./static/lib/combo'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./static/lib/combo'))
});



//压缩js
gulp.task('minifyCommonJS2', function() {


    var jsArray = [
        './static/lib/react-dom.min.js',
        './static/lib/ReactRouter.min.js',
        './static/lib/redux.min.js',
        './static/lib/react-redux.min.js',
        './static/lib/history.min.js'
    ];

    return gulp.src(jsArray).pipe(concat('router-redux-history.js'))
        .pipe(gulp.dest('./static/lib/combo'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./static/lib/combo'))
});


//压缩js
gulp.task('minifySimditorJS', function() {


    var jsArray = [
        './static/lib/simditor-2.3.6/scripts/module.js',
        './static/lib/simditor-2.3.6/scripts/hotkeys.js',
        './static/lib/simditor-2.3.6/scripts/uploader-bce.js',
        './static/lib/simditor-2.3.6/scripts/simditor.js'
    ];

    return gulp.src(jsArray).pipe(concat('simditor-all.js'))
        .pipe(gulp.dest('./static/lib/combo'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./static/lib/combo'))
});