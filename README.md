# Window OnError Logger [![Build Status](https://img.shields.io/travis/behance/window-onerror-logger.svg)](http://travis-ci.org/behance/window-onerror-logger) [![NPM version](https://img.shields.io/npm/v/window-onerror-logger.svg)](https://www.npmjs.com/package/window-onerror-logger)

This is a tiny (< 1K ungzipped) `window.onerror` logger which sends the errors to a `/log` endpoint.

## Features

  - errors which occur in a single tick are batched and sent in a single XHR
  - identical errors are suppressed
  - legacy browsers which don't support `XMLHttpRequest` are not supported by this logger
  - only the absolutely necessary features are implemented in order to minimize the surface area for bugs

## Usage

Your application should fetch the `node_modules/window-onerror-logger/logger.min.js`
from disk (after `npm install window-onerror-logger`, of course) and add it as the
first element in the `<head>`.

```html
<html>
  <head>
    <script type="javascript">
      ${getFileFromDisk('node_modules/window-onerror-logger/dist/logger.min.js')}
    </script>
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

## License

[Apache-2.0](/LICENSE)
