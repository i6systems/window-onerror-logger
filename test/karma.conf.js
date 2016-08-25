/* eslint-env node */

module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: [
      'jasmine-ajax',
      'jasmine'
    ],
    files: [
      { pattern: 'src/**/*.js', included: false, watched: true },
      'test/index.js'
    ],
    preprocessors: {
      'test/index.js': ['rollup']
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity
  });
};
