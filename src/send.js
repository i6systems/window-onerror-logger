function encode(logs) {
  var encodedLogs = [];
  for (var i = 0; i < logs.length; i++) {
    encodedLogs[i] = 'logs[]=' + encodeURIComponent(JSON.stringify(logs[i]));
  }
  return encodedLogs.join('&');
}

export default function send(logs) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/log');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(encode(logs));
}
