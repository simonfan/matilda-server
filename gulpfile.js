const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('nodemon', function () {
  nodemon({
    script: 'index.js',
    ext: 'js html',
    env: {
      'NODE_ENV': 'development',
      'EVENTS_LOG_FILE_PATH': __dirname + '/messages.log',
    }
  })
});
