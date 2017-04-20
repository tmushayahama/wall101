// For installation, go to the protractor website
//
// Note that $ and $$ are not jQuery
// $: http://angular.github.io/protractor/#/api?view=build$
// $$: http://angular.github.io/protractor/#/api?view=build$$
// Full api documentation is at: angular.github.io/protractor/#/api
// Full expect() and toBe documenation is at: http://jasmine.github.io/2.1/introduction.html
 
var env = require('./env.js');
//var ScreenshotReporter = require('./screenshotReporter.js');
var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
 
// __dirname retuns a path of this particular config file
var basePath = __dirname + '/';

var reporter = new HtmlScreenshotReporter({
  dest: basePath+"screeshots",
  filename: 'my-report.html'
});
 
exports.config = {

  //The jasmine Framework
  framework: env.framework,
 
  // The address of a running selenium server.
  seleniumAddress: env.seleniumAddress,
 
  // Capabilities to be passed to the webdriver instance.
  multiCapabilities: env.multiCapabilities,
 
   beforeLaunch: function() {
      return new Promise(function(resolve){
        reporter.beforeLaunch(resolve);
      });
   },
   
    afterLaunch: function(exitCode) {
      return new Promise(function(resolve){
        reporter.afterLaunch(resolve.bind(this, exitCode));
      });
   },
  // Spec patterns are relative to the location of the spec file. They may include glob patterns:
  //   {directory}/*.js is a one level wildcard
  //   {directory}/**.js is a multilevel wildcard
  suites: {
    auth: [
      'specs/auth/login.spec.js',
      //'specs/auth/logout.spec.js',
    ],
    folder: [
      // We have to log in before using the next tests
      //'specs/authentication/load-from-access-token.spec.js',
      // Now we run the specs in the order required to not leave too much trash
      // General index
    ],
  },
 
  // Base url
  baseUrl: env.baseUrl,
 
  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    // Use colors in the command line report.
	showColors: true,

	// If true, include stack traces in failures.
	includeStackTrace : false,

	// Default time to wait in ms before a test fails.
	defaultTimeoutInterval: 60000,

	// If true, print timestamps for failures
	showTiming: true,

	// Print failures in real time.
	realtimeFailure: false
  }, 
 
  onPrepare: function () {
    // "relativePath" - path, relative to "basePath" variable	
	browser.driver.manage().window().maximize();
	
	  jasmine.getEnv().addReporter(reporter);
	
	//jasmine.getEnv().addReporter(new ScreenshotReporter(basePath));
		
    global.requirePage = function (relativePath) {
      return require(basePath + 'pages/' + relativePath + '.page.js');
    };
 
    global.getErrors = function(){
      return $$('.alert-box.alert');
    };
    global.getMessages = function(){
      return $$('.alert-box.success');
    };
 
    global.escapeRegExp = function(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
  }
 
};
 
// These will be made available in browser.params inside tests
exports.config.params = env.params;
exports.config.params.currentUrl = undefined;
