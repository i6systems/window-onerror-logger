/* eslint-env jasmine */

import init from '../../src/init';

describe('init', function() {
  var win;
  var format;
  var send;

  function getLogs(messageIndex) {
    return send.calls.argsFor(messageIndex)[0];
  }

  beforeEach(function() {
    jasmine.clock().install();
    win = jasmine.createSpy();
    format = jasmine.createSpy().and.callFake(function(message, file, line, column, error) {
      return {
        message: message,
        file: file,
        line: line,
        column: column,
        error: error
      };
    });
    send = jasmine.createSpy();
    init(win, format, send);
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    jasmine.Ajax.uninstall();
  });

  it('should call an existing window.onerror with correct arguments', function(done) {
    var mywin = jasmine.createSpy();
    mywin.onerror = function(message, file, line, column, error) {
      expect(message).toBe('m');
      expect(file).toBe('u');
      expect(line).toBe(1);
      expect(column).toBe(2);
      expect(error).toBe('e');
      done();
    };
    init(mywin, format, send);
    mywin.onerror('m', 'u', 1, 2, 'e');
  });

  it('should batch requests per tick', function() {
    var i;

    for (i = 0; i < 2; i++) { win.onerror('a' + i); }
    jasmine.clock().tick(1);

    for (i = 0; i < 2; i++) { win.onerror('b' + i); }
    jasmine.clock().tick(1);

    expect(send.calls.count()).toBe(2);

    var firstReqLogs = getLogs(0);
    expect(firstReqLogs.length).toBe(2);
    expect(firstReqLogs[0].message).toBe('a0');
    expect(firstReqLogs[1].message).toBe('a1');

    var secondReqMessages = getLogs(1);
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
    var logs = getLogs(0);
    expect(logs.length).toBe(2);
    expect(logs[0].message).toBe('a');
    expect(logs[1].message).toBe('d');
  });
});
