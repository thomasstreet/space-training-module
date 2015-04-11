var $ = require('./utils');

var hasShown = false;

var hintPopupEl = document.getElementById('hint-popup');
hintPopupEl.addEventListener('click', () => {
  $.deactivate(hintPopupEl);
});

function showPopup() {
  $.activate(hintPopupEl);

  setTimeout(() => {
    $.deactivate(hintPopupEl);
  }, 10000);
}

module.exports = {
  leapDetected() {
    if (!hasShown) {
      hasShown = true;
      setTimeout(showPopup, 10000);
    }
  }
};
