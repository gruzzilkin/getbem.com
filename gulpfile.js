var gulp = require('gulp');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var flatten = require('gulp-flatten');
var bempack = require('gulp-bem-pack');

var del = require('del');
var through = require('through2');
var glue = require('glue-streams');
var save = require('save-stream');
var join = require('path').join;

function getCssFiles(bemObject) {
    return gulp.src(join(bemObject.path, bemObject.id + '.css'));
}

var levels = [
		'libs/bootstrap/levels/normalize',
		'libs/bootstrap/levels/print',
		'libs/bootstrap/levels/glyphicons',
		'libs/bootstrap/levels/scaffolding',
		'libs/bootstrap/levels/core-css',
		'blocks'
	],
    bundles = ['pages'],
    postfixCSS = function (item) {
        return join(item, '**/*.css')
    },
    postfixJS = function (item) {
        return join(item, '**/*.js')
    },
    postfixHTML = function (item) {
        return join(item, '**/*.jade')
    };

gulp.task('js', ['clean'], function () {
    return gulp.src(levels.map(postfixJS))
        .pipe(bempack('index.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('css', ['clean'], function () {
    return gulp.src(levels.map(postfixCSS))
        .pipe(concat('index.css'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('html', ['clean'], function () {
    var mixins = gulp.src(levels.map(postfixHTML))
        .pipe(save()
    );

    return gulp.src(bundles.map(postfixHTML))
        .pipe(through.obj(function (page, enc, cb) {
            return glue.obj(mixins.load(), page)
                .pipe(concat(page))
                .pipe(plumber())
                .pipe(jade({pretty: true}))
                .pipe(flatten())
                .pipe(gulp.dest('./dist'))
                .on('error', cb)
                .on('end', cb);
        }))
        .pipe(gulp.dest('./dist'));

});

gulp.task('assets', ['clean'], function () {
    return gulp.src('assets/**').pipe(gulp.dest('dist'));
});

gulp.task('clean', function (cb) {
    del(['./dist'], cb);
});

gulp.task('build', ['clean', 'html', 'css', 'js', 'assets']);

/* Some external tasks */
require('./gulpfile.ext.js');
