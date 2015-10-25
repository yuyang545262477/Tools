var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    browserSync = require('browser-sync'),
    htmlmin = require('gulp-htmlmin'),
    reload = browserSync.reload;


gulp.task('htmls', function() {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/htmls'))
});

gulp.task('index', function () {
    return gulp.src('src/index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'))
})

//编译sass，自动添加前缀
gulp.task('styles',function(){
    return sass('src/styles/**/*.scss')
                .pipe(autoprefixer('last 2 version','safari 5','ie 8','ie 9','opera 12.1','ios 6','android 4'))
                .pipe(concat('main.css'))
                .pipe(gulp.dest('dist/transition/css'))
                .pipe(rename({suffix: '.min'}))
                .pipe(minifycss())
                .pipe(gulp.dest('dist/css'))
                .pipe(notify({message: 'Style tast complete' }))

});
//js代码效验，合并和压缩
gulp.task('scripts',function(){
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/transition/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({message: 'Scripts task complete'}))
});
//压缩图片
gulp.task('images',function(){
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({optimizationLevel: 5, progressive: true, interlaced: true})))
        .pipe(gulp.dest('dist/img'))
        .pipe(notify({message: 'Images task complete'}));
});
//清除文件
gulp.task('clean',function(cb){
    del(['dist/**/*.css','dist/**/*.js','dist/img','dist/*.html'],cb)//cb 确保在退出前完成任务
});
//设置服务器
gulp.task('server',function(){
    browserSync({
        server:{
            baseDir:'dist'
        }
    });
    //watch index.html
    gulp.watch('src/index.html', ['index']);
    //watch .html files
    gulp.watch('src/htmls/**/*.html', ['htmls']);

    //watch .css files
    gulp.watch('src/styles/**/*.scss',['styles']);
    //watch .js files
    gulp.watch('src/scripts/**/*.js',['scripts']);
    //watch .image files
    gulp.watch('src/images/**/*',['images']);
    gulp.watch(['*.html','transition/**/*.css','transition/**/*.js'],{cwd:'dist'},reload);
});

//设置默认任务
gulp.task('default',function(){//clean任务执行完成之前才会去运行其他的任务
    gulp.start('index','htmls','styles','scripts','images','server');
});