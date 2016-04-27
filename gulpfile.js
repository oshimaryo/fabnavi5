var NOTIFICATION = false;

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
if(NOTIFICATION)var notifier = require('node-notifier');

var browserify = require('browserify');
var watchify = require('watchify');
var fromArgs = require('watchify/bin/args');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var _ = require('lodash');
var glob = require('glob');

var SRC_CLIENT = glob.sync('app/assets/javascripts/client/**/*.js');

var DIST_CLIENT = "app/assets/javascripts/dist/client";


var options = _.assign({}, watchify.args, {
    transform : ['react-jade'],
    extensions: ['.js','.jade'],
    debug : true,
    poll  : true,
    entries : SRC_CLIENT
});

gulp.task('build', build);
gulp.task('start', watch);

function watch(){
  var b = watchify(browserify(options).transform("babelify", {presets: ["es2015"]}));
  bundle();
  b.on('log', function(res){
    gutil.log(res);
    if(NOTIFICATION){
      notifier.notify({
            title:"Browserify",
            message:res 
      });
    }
  });
  b.on('update', bundle);
  b.on('data', bundle);

  function bundle(){
    return b.bundle()
    .on('error', function(e){
      gutil.log('Browserify Error',e.message);
      gutil.log('Stack Trace:',e.stack);

      if(NOTIFICATION){ 
        try{
          var message = e.path.replace(__dirname+"/app/assets/javascripts/client","");
        } catch(error) {
          var message = e;
        }
        notifier.notify({
          title:"Browserify Error",
          message: message
        });
      }
    })
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(plumber())
    .pipe(sourcemaps.init({loadMaps: true})) 
    .pipe(sourcemaps.write('./')) 
    .pipe(gulp.dest(DIST_CLIENT));
  }
}

function build(){
  var b = browserify(options).transform("babelify", {presets: ["es2015"]});
  b.bundle()
  .on('log', gutil.log)
  .on('error',function(e){
    gutil.log('Browserify Error',e.message);
    gutil.log('Stack Trace:',e.stack);
    setTimeout(function(){
      process.exit(1);
    },1000);
  })
  .pipe(source("bundle.js"))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest(DIST_CLIENT));

}

