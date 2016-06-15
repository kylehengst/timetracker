var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var order = require('gulp-order');
var dir = __dirname;

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'compact'
};
var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};
var componentsCss = [
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'bower_components/toastr/toastr.css',
    'bower_components/angular/angular-csp.css',
    'bower_components/angular-xeditable/dist/css/xeditable.css'
];
var componentsJs = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap/dist/js/bootstrap.js',
    'bower_components/moment/moment.min.js',
    'bower_components/angular/angular.js',
    'bower_components/ngtouch/build/ngTouch.min.js',
    'bower_components/angular-sanitize/angular-sanitize.min.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angularjs-slider/dist/rzslider.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    'bower_components/angular-file-upload/dist/angular-file-upload.js',
    'bower_components/toastr/toastr.js',
    'bower_components/firebase/firebase.js',
    'bower_components/angularfire/dist/angularfire.js',
    'bower_components/angular-xeditable/dist/js/xeditable.js',
    'bower_components/moment/min/moment-with-locales.min.js'
];

gulp.task('default', ['concat_bower_js','concat_bower_css','css_sass','css_prefix','concat_js']);

// app
gulp.task('css_sass', function() {

    return gulp
        .src('./resources/sass/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write())
        //.pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest('./public/assets/css'));

});
gulp.task('css_prefix', ['css_sass'], function(){
    return gulp
        .src('./public/assets/css/app.css')
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest('./public/assets/css'))

});
gulp.task('concat_js',function(){
    return gulp
        .src(['./env.js','./app/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./public/assets/js'))
        ;
});

// dependencies
gulp.task('concat_bower_css',function(){
    return gulp
        .src(componentsCss)
        .pipe(concat('components.css'))
        .pipe(gulp.dest('./public/assets/css'))
        ;
});
gulp.task('concat_bower_js',function(){
    return gulp
        .src(componentsJs)
        .pipe(concat('components.js'))
        .pipe(gulp.dest('./public/assets/js'))
        ;
});

gulp.task('watch', function() {
    gulp.watch(['resources/sass/**/*.scss'], ['css_sass','css_prefix']);
    gulp.watch(['./app/**/*.js'], ['concat_js']);
});