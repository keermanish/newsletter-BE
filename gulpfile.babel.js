import gulp from 'gulp';
import pm2 from 'pm2';
import watch from 'gulp-watch';
import rimraf from 'rimraf';
import run from 'run-sequence';
import babel from 'gulp-babel';
import nodemon from 'gulp-nodemon';

/* required path config */
const path = {
  'entry': './dist/index.js',
  'src': ['./src/**/*.js'],
  'dist': './dist'
};

/* default/local mode - gulp */
gulp.task('default', ['set-dev-node-env'], cb => {
  run('build', 'watch', cb);
});

/* production mode - gulp prod */
gulp.task('prod', ['set-prod-node-env'], cb => {
  run('build', 'watch', cb);
});

/* stage mode - gulp prod */
gulp.task('stage', ['set-stage-node-env'], cb => {
  run('build', 'watch', cb);
});

/* set development env */
gulp.task('set-dev-node-env', function() {
  process.env.NODE_ENV = 'development';
});

/* set production env */
gulp.task('set-prod-node-env', function() {
  process.env.NODE_ENV = 'production';
});

/* set stage env */
gulp.task('set-stage-node-env', function() {
  process.env.NODE_ENV = 'stage';
});

/**
 * task to bootstrap the application
 * clean - clear old scripts
 * babel - transpile ES6 -> ES5
 * start-server - start node server
 */
gulp.task('build', cb => {
  run('clean', 'babel', 'start-server', cb);
});

/**
 * task to watch for changes
 */
gulp.task('watch', () => {
  return watch(path.src, () => {
    gulp.start('watch-build');
  });
});

/**
 * task update scripts as per changes made
 * clean - clear old scripts
 * babel - transpile ES6 -> ES5
 * restart-server - restart node server
 */
gulp.task('watch-build', cb => {
  run('clean', 'babel', 'restart-server', cb);
});

/* task to clear old scripts */
gulp.task('clean', cb => {
  rimraf(path.dist, cb);
});

/* task to transpile ES6 -> ES5 */
gulp.task('babel', () => {
  return gulp.src(path.src)
    .pipe(babel({
      'presets': ['es2015'],
      'plugins': [
        ['inline-json-import', {}]
      ]
    }))
    .pipe(gulp.dest(path.dist));
});

/* starts a new server instance */
gulp.task('start-server', () => {

  /* for development skip pm2 process */
  if(process.env.NODE_ENV === 'development') {

    /* using nodemon for development mode - since it does not add addition load on the system */
    nodemon({
      script: path.entry,
      ext: 'js html',
      env: { 'NODE_ENV': 'development' }
    });

    return true;
  }

  /*
    - All About PM2 Configuration file - http://pm2.keymetrics.io/docs/usage/application-declaration
    - All the available options that can be added to PM2 config file - http://pm2.keymetrics.io/docs/usage/application-declaration/#list-of-attributes-available
  */

  /* Base Configuration [irrespective of the environment] */
  let pm2Config = {
    'name': 'newsletter-BE',
    'script': path.entry
  };

  /* Environment specific configuration */
  if(process.env.NODE_ENV === 'stage') {
    pm2Config['exec_mode'] = 'fork';
  } else {
    pm2Config['exec_mode'] = 'cluster';

    /**
     * number of instances for your clustered app, 0 means as much instances as you have CPU cores.
     * a negative value means CPU cores - value (e.g -1 on a 4 cores machine will spawn 3 instances)
     */
    pm2Config['instances'] = 0;

    /**
     * your app will be restarted by PM2 if it exceeds the amount of memory specified.
     * human-friendly format : it can be “10M”, “100K”, “2G” and so on…
     */
    pm2Config['max_memory_restart'] = '250M';
    pm2Config['out_file'] = '/var/log/newsletter/app.stdout.log';
    pm2Config['error_file'] = '/var/log/newsletter/app.stderr.log';
  }

  pm2.connect(true, failed => {
    if (failed) {
      console.error(failed);
      process.exit(2);
    }

    pm2.start(pm2Config, (err, apps) => {

      /* disconnect old connection */
      pm2.disconnect();
      if (err) {
        throw err;
      }
    });
  });
});

/* task to restart running server */
gulp.task('restart-server', () => {

  /* for development skip pm2 process */
  if(process.env.NODE_ENV === 'development') {
    return true;
  }

  pm2.connect(true, failed => {
    if (failed) {
      console.error(failed);
      process.exit(2);
    }

    pm2.restart('all', (err, proc) => {

      /* disconnect old connection */
      pm2.disconnect();
      if (err) {
        throw err;
      }
    });
  });
});
