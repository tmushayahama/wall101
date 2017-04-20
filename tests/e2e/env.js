module.exports = {
 // The address of a running selenium server.
 seleniumAddress:
         (process.env.SELENIUM_URL || 'http://localhost:4444/wd/hub'),
 framework: 'jasmine2',
 capabilities: {
  'browserName':
          (process.env.TEST_BROWSER_NAME || 'chrome'),
  'version':
          (process.env.TEST_BROWSER_VERSION || 'ANY')
 },
 multiCapabilities: [
  {
   'browserName': 'chrome'
  },],
 baseUrl: 'http://localhost:8000/',
 // These will be made available in browser.params inside tests
 params: {
 }
};