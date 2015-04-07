function show(el) {
  el.style.display = "block";
}

function hide(el) {
  el.style.display = "none";
}

function activate(el) {
  el.className = "active";
}

function deactivate(el) {
  el.className = "";
}

module.exports = {
  show,
  hide,
  activate,
  deactivate
};
