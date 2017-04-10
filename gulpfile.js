//引入gulp
var gulp = require("gulp");

var gulpSequence = require('gulp-sequence');
var jshint = require('gulp-jshint');
//引入组件
// var sass = require("gulp-sass");
var stylus = require('gulp-stylus');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');


// 编译sass
// gulp.task("sass", function() {
// 	gulp.src("./src/css/*.scss")
// 		.pipe(sass())
// 		.pipe(gulp.dest("./public/css"));
// });

gulp.task('base', function() {
	return gulp.src('src/css/toy.css')
			.pipe(gulp.dest('src/style'));
});

// 编译stylus
gulp.task('myStylus', function() {
	return gulp.src('src/stylus/*.styl')
			.pipe(stylus())
			.pipe(gulp.dest('src/css'));
});

// postcss
gulp.task('myPostcss', function() {
	return gulp.src('src/css/*.css')
			.pipe(postcss([autoprefixer]))
			.pipe(gulp.dest('src/style'));
});

// stylelint
gulp.task('stylelint', function() {
	return gulp.src('src/css/*.css')
			.pipe(require('gulp-postcss')(
					[
							require('stylelint')({
								configFile: 'mylint.stylelintrc.json'
							}),
							require('postcss-reporter')({clearMessages: true})
					]
			));
});

gulp.task('sequence', gulpSequence('myStylus', 'myPostcss'));

gulp.task('watchStyleFile', function() {
	var watcher = gulp.watch('src/stylus/*.styl', ['sequence']);
	watcher.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

gulp.task('jshint', function() {
		return gulp.src('src/js/any.js')
				.pipe(jshint())
				.pipe(jshint.reporter('default'));
});