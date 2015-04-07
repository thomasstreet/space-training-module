var isLeapConnected = false;

var isChrome = !!window.chrome;
var isFirefox = typeof InstallTrigger !== 'undefined';

var waitBeforeShowingPopup = 7000;

var warningPopupEl = document.getElementById('warning-popup');
warningPopupEl.addEventListener('click', () => {
  warningPopupEl.className = "none";
});

module.exports = {
  leapDetected() {
    if (!isLeapConnected) {
      isLeapConnected = true;
      this.hide();
    }
  },
  notChromeOrFirefox() {
    return (!isChrome || !isFirefox);
  },
  shouldShow() {
    // Show if leap is not connected OR the browser is not chrome or firefox
    return !isLeapConnected || this.notChromeOrFirefox();
  },
  show() {
    warningPopupEl.className = "active";
  },
  hide() {
    warningPopupEl.className = "none";
  },
  determineIfShouldShowPopup() {
    setTimeout(() => {
      if (this.shouldShow()) {
        this.show();
        setTimeout(this.hide, 8000);
      }
    }, waitBeforeShowingPopup);
  }
};
