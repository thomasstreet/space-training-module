var $ = require('./utils');

var isLeapConnected = false;

var isChrome = !!window.chrome;
var isFirefox = typeof InstallTrigger !== 'undefined';

var waitBeforeShowingPopup = 3000;
var waitBeforeDismissingPopup = 5000;

var warningPopupEl = document.getElementById('warning-popup');
warningPopupEl.addEventListener('click', () => {
  warningPopupEl.className = "none";
});

module.exports = {
  leapDetected() {
    if (!isLeapConnected) {
      isLeapConnected = true;
      $.deactivate(warningPopupEl);
    }
  },
  notChromeOrFirefox() {
    return (!isChrome || !isFirefox);
  },
  shouldShow() {
    // Show if leap is not connected OR the browser is not chrome or firefox
    return !isLeapConnected || this.notChromeOrFirefox();
  },
  determineIfShouldShowPopup() {
    setTimeout(() => {
      if (this.shouldShow()) {
        $.activate(warningPopupEl);

        setTimeout(() => {
          $.deactivate(warningPopupEl);
        }, waitBeforeDismissingPopup);
      }
    }, waitBeforeShowingPopup);
  }
};
