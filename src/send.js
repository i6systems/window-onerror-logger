function encode(logs) {
  var encodedLogs = [];
  for (var i = 0; i < logs.length; i++) {
    encodedLogs[i] = 'logs[]=' + encodeURIComponent(JSON.stringify(logs[i]));
  }
  return encodedLogs.join('&');
}

export default function send(logs, loggerOpts) {
  var xhr = new XMLHttpRequest();
  loggerOpts = loggerOpts || {
    method: 'POST',
    url: '/log'
  };
  xhr.open(loggerOpts.method, loggerOpts.url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(encode(logs));
}
