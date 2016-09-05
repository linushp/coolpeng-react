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
var through2=require("through2");

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
gulp.task('minifyCommonJS3', function() {


    var jsArray = [
        './static/lib/react-dom.min.js',
        './static/lib/ReactRouter.min.js',
        './static/lib/redux.min.js',
        './static/lib/react-redux.min.js',
        './static/lib/history.min.js',
        './static/lib/immutable.min.js',
        './static/lib/md5.js',
        './static/lib/src/SmartyTemplate.js'
    ];

    return gulp.src(jsArray).pipe(concat('router-redux-history-immutable-md5-tt.js'))
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

    return gulp.src(jsArray).pipe(concat('simditor-v20160902.js'))
        .pipe(gulp.dest('./static/lib/combo'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./static/lib/combo'))
});



//压缩js
gulp.task('remini', function() {


    function replaceDefaultStr(s){
        var ss = s.replace(/\["default"\]/gm,'[DEFAULT_CONST_STRING]');
        ss = ss.replace(/"__esModule"/gm,'ES_MODULE_CONST_STRING');
        var mm = '(function(){  var DEFAULT_CONST_STRING = "default"; var ES_MODULE_CONST_STRING = "__esModule";  '+ss+' })()';
        return mm;
    }

    function modify(modifier) {
        return through2.obj(function (file, encoding, done) {
            var content = modifier(String(file.contents));
            file.contents = new Buffer(content);
            this.push(file);
            done();
        });
    }

    var jsArray = [
        './dist/static/app/*.js'
    ];

    return gulp.src(jsArray).pipe(concat('mm.js'))
        .pipe(modify(replaceDefaultStr))
        .pipe(gulp.dest('./dist/static/app5/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/static/app5/'))
});



//压缩js
gulp.task('copyToServerSvn', function() {


    var jsArray = [
        './dist/index.html'
    ];

    return gulp.src(jsArray)
        .pipe(gulp.dest('/Users/luanhaipeng/svn/appidrsjc4t9gjl/ROOT/'))
});