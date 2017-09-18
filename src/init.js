export default function init(win, format, send) {
  var sentKeys = {};
  var toSend = [];
  var hasPending = false;
  var existingOnerror = win.onerror;

  var loggerOpts = win.loggerOpts || {
    method: 'POST',
    url: '/log',
    enabled: true,
    console: false,
    propagate: false,
  };

  function addToBatch(payload) {
    toSend.push(payload);
    if (!hasPending) {
      hasPending = true;
      setTimeout(function() {
        send(toSend, loggerOpts);
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

    if (loggerOpts.console) {
      var message = [
        'Message: ' + payload.message,
        'URL: ' + payload.context.file,
        'Line: ' + payload.context.line,
        'Column: ' + payload.context.column,
        'Error object: ' + payload.context.stack,
      ].join(' - ');

      console.error(message);
    }

    if (existingOnerror) {
      existingOnerror.apply(this, arguments);
    }

    return !loggerOpts.propagate;
  };
};
