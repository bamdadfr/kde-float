var App = {};
App.lastSizes = {};

App.sizes = {
  WIDTH_1: Number(readConfig('WIDTH_1', 0.8)),
  HEIGHT_1: Number(readConfig('HEIGHT_1', 0.9)),
  WIDTH_2: Number(readConfig('WIDTH_2', 0.6)),
  HEIGHT_2: Number(readConfig('HEIGHT_2', 0.7)),
};

App.resizeAndCenter = function (win, widthPercent, heightPercent) {
  if (!win || !win.resizeable) {
    console.log('[kdeFloat] Window not resizeable');
    return;
  }

  var area = workspace.clientArea(KWin.MaximizeArea, win);
  var width = Math.floor(area.width * widthPercent);
  var height = Math.floor(area.height * heightPercent);
  var x = area.x + Math.floor((area.width - width) / 2);
  var y = area.y + Math.floor((area.height - height) / 2);

  // resize
  win.frameGeometry = {x: x, y: y, width: width, height: height};

  // track state
  App.lastSizes[win.internalId] = {w: widthPercent, h: heightPercent};
};

App.cycle = function () {
  var win = workspace.activeWindow;
  var id = win.internalId;
  var lastSize = App.lastSizes[id];

  if (
    lastSize &&
    lastSize.w === App.sizes.WIDTH_1 &&
    lastSize.h === App.sizes.HEIGHT_1
  ) {
    // second resize
    App.resizeAndCenter(win, App.sizes.WIDTH_2, App.sizes.HEIGHT_2);
    return;
  }

  // main resize
  App.resizeAndCenter(win, App.sizes.WIDTH_1, App.sizes.HEIGHT_1);
};

App.main = function () {
  // bind shortcut
  registerShortcut('cycle', 'kdeFloat: Cycle', 'Meta+C', App.cycle);

  // cleanup event
  workspace.windowRemoved.connect(function (win) {
    delete App.lastSizes[win.internalId];
  });
};

App.main();
