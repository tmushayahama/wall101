var fs = require('fs');
var path = require('path');

var saveScreenshot = function(pathname) {
  browser.takeScreenshot().then(function(png) {
    var file = path.resolve(pathname);
    fs.writeFileSync(file, png, { encoding: 'base64' }, console.log);
  });
};

describe('Doc Record Login', function() {

	var usernameInput = element(by.model('loginCtrl.user.UserName'));
	var passwordInput = element(by.model('loginCtrl.user.Password'));
	var loginBtn = element(by.id('dr-signin-btn'));
	
	beforeEach(function() {
		browser.get('http://localhost/dr/#/login');
		console.log(JSON.stringify(this));
    });

	it('should have a title', function() {
		expect(browser.getTitle()).toEqual('DocRecord');
		saveScreenshot('C:\\DocRecord\\trunk\\DocRecordWebApp\\docrecord_test\\e2e\\test-step-1.png');   
	});
  
	it('should pass the login', function() {
		usernameInput.sendKeys('labpc');
		passwordInput.sendKeys('Password123');
		
		usernameInput.getAttribute('value').then(function(value) {
			console.log('Username - ' + value);
		});
		
		passwordInput.getAttribute('value').then(function(value) {
			console.log('Password - ' + value);
		});
		
		loginBtn.click().then(function(){
			return browser.driver.wait(function() {
			  return browser.driver.getCurrentUrl().then(function(url) {
			  console.log("Home Url"+url);
				return /pageTwo/.test(url);
			  });
			}, 20000);
		});
		
		element(by.binding('appCtrl.userInfo.DisplayName')).getText().then(function(text) {
			console.log('Display Name - ' + text);
		});
		saveScreenshot('C:\\DocRecord\\trunk\\DocRecordWebApp\\docrecord_test\\e2e\\test-step-2.png'); 
		
  });
});
