function isDefined(obj) {
  return typeof obj !== 'undefined';
}

function stringifyObject(obj) {
  if (String(obj) === '[object Event]') {
    return 'Event#target.src=' + (obj.target && obj.target.src);
  }
  return obj;
}

export default function format(message, file, line, column, error) {
  var context = {};

  if (message) {
    message = String((typeof message === 'object')
      ? stringifyObject(message)
      : message);
  }
  if (file) { context.file = String(file); }
  if (isDefined(line)) { context.line = Number(line); }
  if (isDefined(column)) { context.column = Number(column); }
  if (error && error.stack) {
    context.stack = String(error.stack);
  }

  return {
    level: 'ERROR',
    channel: 'js_errors',
    message: message,
    context: context
  };
}
