/* eslint-env jasmine */

import { init } from '../src/index';

describe('be/window_onerror_logger', function() {
  var win;

  function parseBody(body) {
    return JSON.parse(body['logs[]'][0]);
  }

  function getMessages(messageIndex) {
    return parseBody(jasmine.Ajax.requests.at(messageIndex).data()).messages;
  }

  beforeEach(function() {
    jasmine.clock().install();
    jasmine.Ajax.install();
    jasmine.Ajax.stubRequest('/log');
    win = jasmine.createSpy();
    init(win);
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    jasmine.Ajax.uninstall();
  });

  it('should send a POST request to /log', function() {
    win.onerror();
    jasmine.clock().tick(1);
    var req = jasmine.Ajax.requests.mostRecent();
    expect(req.method).toBe('POST');
    var logData = parseBody(req.data());
    expect(logData.level).toBe('ERROR');
    expect(logData.channel).toBe('js_errors');
  });

  it('should batch requests per tick', function() {
    var i;

    for (i = 0; i < 2; i++) { win.onerror('a' + i); }
    jasmine.clock().tick(1);

    for (i = 0; i < 2; i++) { win.onerror('b' + i); }
    jasmine.clock().tick(1);

    expect(jasmine.Ajax.requests.count()).toBe(2);

    var firstReqMessages = getMessages(0);
    expect(firstReqMessages.length).toBe(2);
    expect(firstReqMessages[0].message).toBe('a0');
    expect(firstReqMessages[1].message).toBe('a1');

    var secondReqMessages = getMessages(1);
    expect(secondReqMessages.length).toBe(2);
    expect(secondReqMessages[0].message).toBe('b0');
    expect(secondReqMessages[1].message).toBe('b1');
  });

  it('should not send the same error more than once per page-load', function() {
    win.onerror('a', 'b', 1, 2, new Error('c'));
    for (var i = 0; i < 2; i++) {
      win.onerror('d', 'e', 3, 4, new Error('f'));
    }
    jasmine.clock().tick(1);
    var messages = getMessages(0);
    expect(messages.length).toBe(2);
    expect(messages[0].message).toBe('a');
    expect(messages[1].message).toBe('d');
  });

  describe('message', function() {
    function getLoggedData() {
      win.onerror.apply(null, arguments);
      jasmine.clock().tick(1);
      return parseBody(jasmine.Ajax.requests.mostRecent().data()).messages[0];
    }

    it('should handle double-quote encoding', function() {
      var data = getLoggedData('a "b" c');
      expect(data.message).toBe('a "b" c');
    });

    it('should be set when provided', function() {
      var data = getLoggedData();
      expect(data.message).not.toBeDefined();
    });

    it('should be undefined when not provided', function() {
      var data = getLoggedData('m');
      expect(data.message).toBe('m');
    });

    describe('location', function() {
      it('should be empty if undefined', function() {
        expect(getLoggedData().context.location).not.toBeDefined();
      });

      it('should have a url', function() {
        expect(getLoggedData('m', 'u').context.location).toEqual('u');
      });

      it('should have a url and lineNo', function() {
        expect(getLoggedData('m', 'u', 0).context.location).toEqual('u:0');
      });

      it('should have a url lineNo and columnNo', function() {
        expect(getLoggedData('m', 'u', 1, '3').context.location).toEqual('u:1:3');
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
        expect(getLoggedData(err.message, 'u', 0, 2, err).context.stack)
          .toMatch(/stackShouldReportThisFunctionName/);
      });
    });
  });
});
