var isLeapConnected = false;
var isChrome = !!window.chrome;

var waitBeforeShowingPopup = 7000;

var warningToastEl = document.getElementById('warning-toast');
warningToastEl.addEventListener('click', () => {
  warningToastEl.className = "none";
});

module.exports = {
  leapDetected() {
    if (!isLeapConnected) {
      isLeapConnected = true;
      this.hide();
    }
  },
  shouldShow() {
    return !isLeapConnected || !isChrome;
  },
  show() {
    warningToastEl.className = "active";
  },
  hide() {
    warningToastEl.className = "none";
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
