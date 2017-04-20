var HomePage = function () {};

HomePage.prototype.path = '#/app/folder/-1';

HomePage.prototype.getPath = function () {
 var self = this;
 return self.path;
};

HomePage.prototype.getTitle = function () {
 return browser.getTitle();
};

HomePage.prototype.getUsername = function () {
 return element(by.binding(''));
};

HomePage.prototype.getPathRegex = function () {
 var regex = escapeRegExp(this.getPath());
 return new RegExp(regex);
};

HomePage.prototype.get = function () {
 var url = browser.baseUrl + this.getPath();

 if (browser.params.currentUrl !== url) {
  browser.params.currentUrl = url;
  return browser.get(url);
 } else {
  return true;
 }
};

module.exports = HomePage;