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
    del(["./release/"]);
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
        './static/lib/underscore-min.js',
        './static/lib/md5.js',
        './static/lib/ReconnectingWebSocket.js'
    ];

    return gulp.src(jsArray).pipe(concat('router-redux-history-immutable-md5-underscore-rws.js'))
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
        './static/lib/simditor-2.3.6/scripts/simditor.js',
        './static/lib/simditor-2.3.6/scripts/simditor-emoji.js'
    ];

    return gulp.src(jsArray).pipe(concat('simditor-v20160923.js'))
        .pipe(gulp.dest('./static/lib/combo'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./static/lib/combo'))
});

//压缩js
gulp.task('minifySimditorCss', function() {

    var cssArray = [
        './static/lib/simditor-2.3.6/styles/simditor.css',
        './static/lib/simditor-2.3.6/styles/simditor-emoji.css'
    ];

    return gulp.src(cssArray).pipe(concat('simditor-v20160923.css'))
        .pipe(gulp.dest('./static/lib/combo'));
});




//压缩js
gulp.task('release1', function() {


    function replaceDefaultStr(s){
        var ss = s.replace(/\["default"\]/gm,'[UBIBI_GG_DEFAULT_CONST_STRING]');
        ss = ss.replace(/"__esModule"/gm,'UBIBI_GG_ES_MODULE_CONST_STRING');
        ss = ss.replace(/React\.createElement/gm,'UBIBI_GG_REACT_CREATE_ELEMENT');

        var mm = '' +
            '(function(window,document){   ' +
            '   var UBIBI_GG_REACT_CREATE_ELEMENT = React.createElement;   ' +
            '   var UBIBI_GG_DEFAULT_CONST_STRING = "default";   ' +
            '   var UBIBI_GG_ES_MODULE_CONST_STRING = "__esModule";   ' +
            '   '+ss+'   ' +
            '})(window,window.document) ';
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

    return gulp.src(jsArray).pipe(concat('release.js'))
        .pipe(modify(replaceDefaultStr))
        .pipe(rev())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/static/app/'))
});

//压缩js
gulp.task('copyToServerSvn', function() {


    var jsArray = [
        './dist/index.html'
    ];

    return gulp.src(jsArray)
        .pipe(gulp.dest('/Users/luanhaipeng/svn/appidrsjc4t9gjl/ROOT/'))
});