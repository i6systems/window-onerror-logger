/* eslint-env node */

module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: [
      'jasmine-ajax',
      'jasmine'
    ],
    files: [{
      pattern: 'test/specs/**/*.js',
      watched: false
    }],
    preprocessors: {
      'test/specs/**/*.js': ['rollup']
    },
    rollupPreprocessor: {
  	  plugins: [
		require('rollup-plugin-buble')()
	  ],
      format: 'iife',
      name: 'windowOnerrorLogger',
      sourcemap: 'inline'
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
