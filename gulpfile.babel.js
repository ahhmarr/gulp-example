var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass=require('gulp-sass');

var dirs = {
    js: 'app/js',
    css: 'app/css'
};
var notificationHelper = function(file) {
    if (file.jshint.success) {
        // Don't show something if success
        return false;
    }
    var errors = file.jshint.results.map(function(data) {
        if (data.error) {
            return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
    }).join("\n");
    return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
}

gulp.task('sass',function(){
    return gulp.src(`${dirs.css}**/*.scss`)
            .pipe(sourcemaps.init())
            .pipe(sass().on('error',function(err){
                notify().write(err);
                this.emit('end');
            }))
            .pipe(concat('style.min.css'))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist'));

})
gulp.task('transpile', function() {
    return gulp.src(`${dirs.js}**/*.js`)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(jshint())
        .pipe(notify(notificationHelper))
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))

});
gulp.task('watch', function() {
    gulp.watch(`${dirs.js}**/*.js`, ['transpile']);
    gulp.watch(`${dirs.css}**/*.scss`, ['sass']);
});
gulp.task('default', ['transpile','sass']);
gulp.task('build', ['transpile','sass']);
