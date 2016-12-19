var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    notify = require('gulp-notify'),
    sourcemaps=require('gulp-sourcemaps'),
    babel=require('gulp-babel'),
    concat=require('gulp-concat'),
    uglify=require('gulp-uglify');

var dirs={
    js : 'app/'
};


gulp.task('lint', function() {
    return gulp.src(`${dirs.js}*.js`)
         .pipe(sourcemaps.init())
         .pipe(babel({
            presets : ['es2015']
        }))
        .pipe(jshint())
        .pipe(notify(function(file) {
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
        }));
});
gulp.task('transpile', function() {
    return gulp.src(`${dirs.js}*.js`)
         .pipe(sourcemaps.init())
         .pipe(babel({
            presets : ['es2015']
        }))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('lo.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))

});
gulp.task('watch', function() {
    gulp.watch('app/*.js', ['transpile','jshint']);
});
gulp.task('default', ['transpile']);
