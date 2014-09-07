var gulp = require('gulp');
var buildBranch = require('buildbranch');
var watch = require('gulp-watch');

gulp.task('watch', ['build'], function() {
    return watch([
        '{blocks,pages}/**/*.js',
        '{blocks,pages}/**/*.css',
        '{blocks,pages}/**/*.jade',
        '{blocks,pages}/**/*.md'
    ], function (files, cb) {
        gulp.start('build', cb);
    });
});

gulp.task('gh', ['build'], function(done) {
    buildBranch({ folder: 'dist', ignore: ['libs'] }, done);
});

gulp.task('default', ['watch']);
