var LOCAL_CONFIG = {
  appName: 'local',
  appVersion: '1',
  hardCodeStripe: true,
  stripePublicKey: '',
  stripePrivateKey: '',
  productionPaypal: false,
};

var DEV_CONFIG = {
  appName: 'lessig-trust-test',
  hardCodeStripe: true,
  stripePublicKey: '',
  stripePrivateKey: '',
  appVersion: '1',
  productionPaypal: false,
};

var STAGING_CONFIG = {
  appName: 'lessig-trust',
  appVersion: 'staging',
  productionPaypal: true,
};

var LESSIG_CONFIG = {
  appName: 'lessig-trust',
  appVersion: '1',
  productionPaypal: true,
};

var preprocessAppYaml = function(config) {
  return {
    src : [ 'build/app.yaml' ],
    options: { inline : true, context : config }
  };
};

var createConfigFile = function(config) {
  return {
    "build/config.json": function(fs, fd, done) {
      fs.writeSync(fd, JSON.stringify(config));
      done();
    }
  };
};

module.exports = function(grunt) {
  // configure the tasks
  grunt.initConfig({
    clean: {
      main: {
        src: [ 'build' ],
      },
    },

    copy: {
      main: {
        files: [        
          {cwd: 'backend/', src: '**', dest: 'build/', expand: true },
          {cwd: 'lib/', src: '**', dest: 'build/', expand: true },
          {cwd: 'assets/', src: '**', dest: 'build/static/', expand: true },
          {cwd: 'jinja_templates', src: '**', dest: 'build/templates/', expand: true },          
        ],
      },
    },

    preprocess: {
      local : preprocessAppYaml(LOCAL_CONFIG),
      dev: preprocessAppYaml(DEV_CONFIG),
      staging: preprocessAppYaml(STAGING_CONFIG),
      lessig: preprocessAppYaml(LESSIG_CONFIG),
      
    },

    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: [
          {cwd: 'markup/', src: '*.jade.j2', dest: 'build/templates/',
           expand: true, ext: '.html'},
          {cwd: 'markup/', src: '*.jade', dest: 'build/static/', expand: true,
           ext: '.html'},
        ]
      }
    },

    autoprefixer: {
      build: {
        expand: true,
        cwd: 'build/static/css/',
        src: [ '*.css' ],
        dest: 'build/static/css/'
      }
    },

    shell: {
      devserver: {
        command: 'dev_appserver.py --skip_sdk_update_check --host 0.0.0.0 --admin_host 0.0.0.0 build/',
        options: {
          async: true,
        },
      },
    },

    "file-creator": {
      local: createConfigFile(LOCAL_CONFIG),
      dev: createConfigFile(DEV_CONFIG),
      staging: createConfigFile(STAGING_CONFIG),
      lessig:createConfigFile(LESSIG_CONFIG)
    },

    watch: {
      markup: {
        files: 'markup/**',
        tasks: [ 'jade' ]
      },
      copy: {
        files: [ '{js/src,resources,assets,templates,backend}/**' ],
        tasks: [ 'copy', 'preprocess:local' ]
      }
    },
  });

  // load the tasks
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-file-creator');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-shell-spawn');

  // define the tasks
  grunt.registerTask(
    'build',
    'Compiles all of the assets and copies the files to the build directory.',
    [ 'clean', 'copy', 'jade']
  );
  grunt.registerTask(
    'local',
    'Builds, runs the local dev server, and watches for updates.',
    [ 'build', 'preprocess:local', 'file-creator:local',
      'shell:devserver', 'watch']
  );
  grunt.registerTask('dev', 'Builds for the DEV appengine environment.',
                     [ 'build', 'preprocess:dev', 'file-creator:dev' ]);
  grunt.registerTask('staging', 'Builds for the STAGING appengine environment.',
                     [ 'build', 'preprocess:staging', 'file-creator:staging' ]);
  grunt.registerTask('lessig', 'Builds the live lessig app.',
                     [ 'build', 'preprocess:lessig', 'file-creator:lessig' ]);

};
