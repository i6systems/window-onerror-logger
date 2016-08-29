export default function send(logs) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/log');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(logs.map(function(log) {
    return 'logs[]=' + encodeURIComponent(JSON.stringify(log));
  }).join('&'));
}
