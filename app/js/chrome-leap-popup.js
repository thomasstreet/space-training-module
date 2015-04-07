var isLeapConnected = false;
var isChrome = !!window.chrome;

var waitBeforeShowingPopup = 7000;

module.exports = {
  leapDetected() {
    isLeapConnected = true;
  },
  shouldShow() {
    return !isLeapConnected || !isChrome;
  },
  show() {
    console.log('show');
  },
  determineIfShouldShowPopup() {
    setTimeout(() => {
      if (this.shouldShow()) {
        this.show();
      }
    }, waitBeforeShowingPopup);
  }
};
