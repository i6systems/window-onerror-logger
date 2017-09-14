export default function init(win, format, send) {
  var sentKeys = {};
  var toSend = [];
  var hasPending = false;
  var existingOnerror = win.onerror;

  function addToBatch(payload) {
    toSend.push(payload);
    if (!hasPending) {
      hasPending = true;
      setTimeout(function() {
        send(toSend, win.loggerOpts);
        hasPending = false;
        toSend = [];
      }, 0);
    }
  }

  win.onerror = function() {
    var payload = format.apply(null, arguments);
    var key = JSON.stringify(payload);

    if (!sentKeys[key]) {
      sentKeys[key] = true;
      addToBatch(payload);
    }

    if (existingOnerror) {
      existingOnerror.apply(this, arguments);
    }
  };
};
