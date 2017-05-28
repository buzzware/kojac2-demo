module.exports = function(config) {
  config.set({
    frameworks: ['qunit'],
    files: [
      'your_ember_code_here.js',
      'tests/unit/*.js'
    ],
    autoWatch: true,
    singleRun: true,
    browsers: ['PhantomJS']
  });
};