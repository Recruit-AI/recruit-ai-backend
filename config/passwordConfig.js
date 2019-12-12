var owasp = require('owasp-password-strength-test');
owasp.config({
  allowPassphrases: false,
  minLength: 8
});
module.exports = owasp