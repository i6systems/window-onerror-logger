function encode(logs) {
    var encodedLogs = [];
    for (var i = 0; i < logs.length; i++) {
        encodedLogs[i] = 'logs[]=' + encodeURIComponent(JSON.stringify(logs[i]));
    }
    return encodedLogs.join('&');
}

export default function send(logs, loggerOpts) {
    var xhr = new XMLHttpRequest();
    loggerOpts = loggerOpts || {};
    xhr.open(loggerOpts.method || 'POST', loggerOpts.url || '/log');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(encode(logs));
}
