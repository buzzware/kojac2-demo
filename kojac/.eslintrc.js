module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  rules: {
	  "no-console":0,
	  "no-unused-vars":0,
		"quotes": 0,
    "indent": 0,
	  "no-unreachable": 0,
	  "no-mixed-spaces-and-tabs": 0,
    "func-names": 0,
    "no-use-before-define": [2, "nofunc"],
    "prefer-arrow-callback": 0,
    "prefer-rest-params": 0,
    "import/no-unresolved": 0,
    "no-underscore-dangle": 0
  }
};
