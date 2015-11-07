var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var reactify = require('reactify');
var cssConcat = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

var CalculatorPath = {
	ENTRY_POINT : 'public/src/Calculator/js/main.js',
	HTML : 'public/src//Calculator/index.html',
	JS : ['public/src/Calculator/js/*.js', 'public/src/Calculator/js/**/*.js'],
	CSS : ['public/src/Calculator/css/*.css', 'public/src/Calculator/css/**/*.css'],
	JS_OUT_FILE : 'bundle.js',
	CSS_OUT_FILE : 'bundle.css',
	DEST_HTML : 'public/build/Calculator',
	DEST_JS : 'public/build/Calculator/js',
	DEST_CSS : 'public/build/Calculator/css',

	DEST_DIST_HTML : 'public/dist/Calculator',
	DEST_DIST_JS : 'public/dist/Calculator/js',
	DEST_DIST_CSS : 'public/dist/Calculator/css',
}

var ManagementPath = {
	ENTRY_POINT : 'public/src/Management/js/main.js',
	HTML : 'public/src/Management/index.html',
	JS : ['public/src/Management/js/*.js', 'public/src/Management/js/**/*.js'],
	CSS : ['public/src/Management/css/*.css', 'public/src/Management/css/**/*.css'],
	JS_OUT_FILE : 'bundle.js',
	CSS_OUT_FILE : 'bundle.css',
	DEST_HTML : 'public/build/Management',
	DEST_JS : 'public/build/Management/js',
	DEST_CSS : 'public/build/Management/css',

	DEST_DIST_HTML : 'public/dist/Management',
	DEST_DIST_JS : 'public/dist/Management/js',
	DEST_DIST_CSS : 'public/dist/Management/css',
}

//For calculator
gulp.task('calculator-buildjs', function(){
	return gulp.src( CalculatorPath.ENTRY_POINT)
		.pipe(browserify({
			transform : ['reactify']
		}))
		.pipe(rename(CalculatorPath.JS_OUT_FILE))
		.pipe(gulp.dest(CalculatorPath.DEST_JS));
});

gulp.task('calculator-buildcss', function(){
	return gulp.src(CalculatorPath.CSS)
		.pipe(cssConcat(CalculatorPath.CSS_OUT_FILE))
		.pipe(gulp.dest(CalculatorPath.DEST_CSS));
});

gulp.task('calculator-copyHTML', function(){
	return gulp.src(CalculatorPath.HTML)
		.pipe(gulp.dest(CalculatorPath.DEST_HTML));
});

gulp.task('calculator-watch', function(){
	gulp.watch(CalculatorPath.JS, ['calculator-buildjs']);
	gulp.watch(CalculatorPath.CSS, ['calculator-buildcss']);
	gulp.watch(CalculatorPath.HTML, ['calculator-copyHTML']);
})

gulp.task('calculator', ['calculator-watch']);


//For managenment
gulp.task('management-buildjs', function(){
	return gulp.src( ManagementPath.ENTRY_POINT)
		.pipe(browserify({
			transform : ['reactify']
		}))
		.pipe(rename(ManagementPath.JS_OUT_FILE))
		.pipe(gulp.dest(ManagementPath.DEST_JS));
});

gulp.task('management-buildcss', function(){
	return gulp.src(ManagementPath.CSS)
		.pipe(cssConcat(ManagementPath.CSS_OUT_FILE))
		.pipe(gulp.dest(ManagementPath.DEST_CSS));
});

gulp.task('management-copyHTML', function(){
	return gulp.src(ManagementPath.HTML)
		.pipe(gulp.dest(ManagementPath.DEST_HTML));
});

gulp.task('management-watch', function(){
	gulp.watch(ManagementPath.JS, ['management-buildjs']);
	gulp.watch(ManagementPath.CSS, ['management-buildcss']);
	gulp.watch(ManagementPath.HTML, ['management-copyHTML']);
})

gulp.task('management', ['management-watch']);

//This is for production
gulp.task('production', ['dist-js', 'dist-css', 'dist-html']);
gulp.task('dist-js', function(){
	gulp.src( ManagementPath.ENTRY_POINT)
		.pipe(browserify({
			transform : ['reactify']
		}))
		.pipe(rename(ManagementPath.JS_OUT_FILE))
		.pipe(uglify().on('error', gutil.log))
		.pipe(gulp.dest(ManagementPath.DEST_DIST_JS));
	gulp.src( CalculatorPath.ENTRY_POINT)
		.pipe(browserify({
			transform : ['reactify']
		}))
		.pipe(rename(CalculatorPath.JS_OUT_FILE))
		.pipe(uglify().on('error', gutil.log))
		.pipe(gulp.dest(CalculatorPath.DEST_DIST_JS));
})
gulp.task('dist-css',function(){
	gulp.src(ManagementPath.CSS)
		.pipe(cssConcat(ManagementPath.CSS_OUT_FILE))
		.pipe(gulp.dest(ManagementPath.DEST_DIST_CSS));
	gulp.src(CalculatorPath.CSS)
		.pipe(cssConcat(CalculatorPath.CSS_OUT_FILE))
		.pipe(gulp.dest(CalculatorPath.DEST_DIST_CSS));
});
gulp.task('dist-html',function(){
	gulp.src(CalculatorPath.HTML)
		.pipe(gulp.dest(CalculatorPath.DEST_DIST_HTML));
	gulp.src(ManagementPath.HTML)
		.pipe(gulp.dest(ManagementPath.DEST_DIST_HTML));
	 
});
