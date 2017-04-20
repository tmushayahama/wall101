var LoginPage = function () {};

LoginPage.prototype.path = '#/auth';

LoginPage.prototype.getPath = function () {
 var self = this;
 return self.path;
};

LoginPage.prototype.getTitle = function () {
 return browser.getTitle();
};

LoginPage.prototype.getLoginModalTrigger = function () {
 return element(by.css('.gb-top-nav-1')).$('.gb-login-btn');
};

LoginPage.prototype.getUsernameInput = function () {
 return element(by.model('loginCtrl.user.UserName'));
};

LoginPage.prototype.getPasswordInput = function () {
 return element(by.model('loginCtrl.user.Password'));
};

LoginPage.prototype.getLoginBtn = function () {
 return element(by.id('gb-signin-btn'));
};

LoginPage.prototype.getErrorMessageAlert = function () {
 return element(by.binding('loginCtrl.errorMessage'));
};

LoginPage.prototype.getPathRegex = function () {
 var regex = escapeRegExp(this.getPath());
 return new RegExp(regex);
};

LoginPage.prototype.get = function () {
 var url = browser.baseUrl + this.getPath();

 if (browser.params.currentUrl !== url) {
  browser.params.currentUrl = url;
  return browser.get(url);
 } else {
  return true;
 }
};

module.exports = LoginPage;