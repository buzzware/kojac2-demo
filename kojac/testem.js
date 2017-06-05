/* eslint-env node */
module.exports = {
  "test_page": "tests/index.html?hidepassed&nolint",
  "disable_watching": true,
  "launch_in_ci": [
    "PhantomJS"
  ],
  "launch_in_dev": [
    "PhantomJS",
    "Chrome"
  ]
};
