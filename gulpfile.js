"use strict";

const
    babel = require('rollup-plugin-babel'),
    concat = require('gulp-concat'),
    dest = require('gulp-dest'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    browser = require('browser-sync'),
    panini = require('panini'),
    plumber = require('gulp-plumber'),
    rollup = require('rollup-stream'),
    sass = require('gulp-sass'),
    shell = require('gulp-shell'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps');

const global = {
    production: false,
    noTranspileScriptsPaths: [

    ],
    stylesheetsPaths: [
        'node_modules/reset-css',
        'node_modules/bootstrap-sass/assets/stylesheets'
    ],
    paths: {
        source: 'src/',
        distribution: 'public/'
    }
};

function checkProcessStatus() {
    if (process.argv.indexOf("--prod") !== -1) {
        return true;
    }

    return false;
}


function createDir(path) {
    return shell([
        'mkdir -p ' + path
    ]);
}

gulp.task('default', function () {
    global.production = checkProcessStatus();
    if (global.production) {
        cleanDir(global.paths.distribution);
        createDir(global.paths.distribution);
    }
    setTimeout(function () {
        gulp.start('server');
        gulp.start('scss');
        gulp.start('js');
        gulp.start('fonts');
        gulp.start('html');
        gulp.start('watch');
    }, 100);
});

gulp.task('watch', function () {
    gulp.watch(global.paths.source + 'assets/scss/**/*.scss', ['scss', 'reload']);
    gulp.watch(global.paths.source + 'assets/js/**/*.js', ['js', 'reload']);
    gulp.watch([global.paths.source + 'html/*.html', global.paths.source + 'html/**/*.html'], ['html', 'reload']);
    gulp.watch(global.paths.source + 'assets/fonts/**/*', ['fonts', 'reload']);
});

gulp.task('scss', function () {
    return gulp.src(global.paths.source + "assets/scss/app.scss")
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass({
            outputStyle: 'compact',
            includePaths: global.stylesheetsPaths
        }).on("error", sass.logError))
        .pipe(sourcemaps.write("./", {
            includeContent: false
        }))
        .pipe(gulp.dest(global.paths.distribution + "css"));
});

gulp.task('js', function () {
    return plumber(
        function (error) {
            gutil.log(error);
            this.emit("end");
        })
        .pipe(rollup({
            input: global.paths.source + "assets/js/app.js",
            format: "iife",
            sourcemap: true,
            plugins: [
                babel()
            ],
            name: "name"
        }))
        .pipe(source("app.js", './src/assets/js'))
        .pipe(dest(global.paths.distribution + "js", {ext: ".js"}))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./"))
        .pipe(browser.reload({stream: true}));
});

gulp.task('html', function () {
    return gulp.src(global.paths.source + 'html/pages/**/*.{html,hbs,handlebars}')
        .pipe(panini({
            root: global.paths.source + 'html/pages/',
            layouts: global.paths.source + 'html/layouts/',
            partials: global.paths.source + 'html/partials/'
        }))
        .pipe(gulp.dest(global.paths.distribution));
});


gulp.task('fonts', function () {
    return gulp.src([global.paths.source + 'assets/fonts/**/*'])
        .pipe(gulp.dest(global.paths.distribution + 'fonts'));
});

gulp.task('server', function (done) {
    browser.init({
        server: {
            baseDir: global.paths.distribution
        }
    });
    done();
});

gulp.task('reload', function (done) {
    panini.refresh();
    browser.reload();
    done();
});
