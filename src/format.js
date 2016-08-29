function isDefined(obj) {
  return typeof obj !== 'undefined';
}

export default function format(message, file, line, column, error) {
  var context = {};

  if (message) { message = String(message); }
  if (file) { context.file = String(file); }
  if (isDefined(line)) { context.line = Number(line); }
  if (isDefined(column)) { context.column = Number(column); }
  if (error && error.stack) {
    context.stack = String(error.stack);
  }

  return {
    level: 'ERROR',
    channel: 'js_errors',
    messages: [{ message: message }],
    context: context
  };
}
