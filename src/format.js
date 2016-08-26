function isDefined(obj) {
  return typeof obj !== 'undefined';
}

export default function format(message, file, line, column, error) {
  var context = {};

  if (file) { context.file = file; }
  if (isDefined(line)) { context.line = line; }
  if (isDefined(column)) { context.column = column; }
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
