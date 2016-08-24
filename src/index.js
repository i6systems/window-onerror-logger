function send(messages) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/log');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send('logs[]=' + JSON.stringify({
    level: 'ERROR',
    channel: 'js_errors',
    messages: messages
  }));
}

function isDefined(obj) {
  return typeof obj !== 'undefined';
}

function formatPayload(message, url, lineNo, columnNo, error) {
  var context = {};
  var payload = { message: message, context: context };

  if (typeof url === 'string') {
    context.location = url + (isDefined(lineNo)
      ? (':' + lineNo) + (isDefined(columnNo) ? (':' + columnNo) : '')
      : '');
  }

  if (error && error.stack) {
    context.stack = String(error.stack);
  }

  return payload;
}

export function init(win) {
  var sentKeys = {};
  var toSend = [];
  var hasPending = false;
  var existingOnerror = win.onerror;

  function addToBatch(payload) {
    toSend.push(payload);
    if (!hasPending) {
      hasPending = true;
      setTimeout(function() {
        send(toSend);
        hasPending = false;
        toSend = [];
      }, 0);
    }
  }

  win.onerror = function() {
    var payload = formatPayload.apply(null, arguments);
    var key = JSON.stringify(payload);

    if (!sentKeys[key]) {
      sentKeys[key] = true;
      addToBatch(payload);
    }

    if (existingOnerror) {
      existingOnerror.call(this, arguments);
    }
  };
};
