/* eslint-env jasmine */

import format from '../../src/format';

describe('format', function() {
  it('should handle circular structures', function() {
    var m = {};
    m.a = m;
    var data = format(m, m, m, m, m);
    JSON.stringify(data);
  });

  describe('mesage', function() {
    it('should handle double-quote encoding', function() {
      var data = format('a "b" c');
      expect(data.messages[0].message).toBe('a "b" c');
    });

    it('should be set when provided', function() {
      var data = format();
      expect(data.messages[0].message).not.toBeDefined();
    });

    it('should be undefined when not provided', function() {
      var data = format('m');
      expect(data.messages[0].message).toBe('m');
    });
  });

  describe('source', function() {
    it('should be undefined if undefined', function() {
      expect(format().context.file).not.toBeDefined();
    });

    it('should be undefined if url is an empty string', function() {
      expect(format('m', '').context.file).not.toBeDefined();
    });

    it('should have a url', function() {
      var context = format('m', 'u').context;
      expect(context.file).toEqual('u');
      expect(context.line).not.toBeDefined();
      expect(context.column).not.toBeDefined();
    });

    it('should have a url and lineNo', function() {
      var context = format('m', 'u', 0).context;
      expect(context.file).toEqual('u');
      expect(context.line).toEqual(0);
    });

    it('should have a url lineNo and columnNo', function() {
      var context = format('m', 'u', 1, 3).context;
      expect(context.file).toEqual('u');
      expect(context.line).toEqual(1);
      expect(context.column).toEqual(3);
    });
  });

  describe('stack', function() {
    it('should be included when provided', function() {
      var err;
      try {
        (function stackShouldReportThisFunctionName() {
          throw new Error('__e1__');
        }());
      }
      catch (e) {
        err = e;
      }
      expect(format(err.message, 'u', 0, 2, err).context.stack)
        .toMatch(/stackShouldReportThisFunctionName/);
    });
  });
});
