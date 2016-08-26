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
      'test/specs/**/*.js'
    ],
    preprocessors: {
      'test/specs/**/*.js': ['rollup']
    },
    rollupPreprocessor: {
      sourceMap: 'inline'
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
