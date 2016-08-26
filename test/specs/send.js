/* eslint-env jasmine */

import send from '../../src/send';

describe('send', function() {
  function parseLogsBody(body, index) {
    return JSON.parse(body['logs[]'][index]);
  }

  beforeEach(function() {
    jasmine.Ajax.install();
    jasmine.Ajax.stubRequest('/log');
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  it('should send a POST request to /log', function() {
    send(['l']);

    var requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(1);

    var req = requests.mostRecent();
    expect(req.method).toBe('POST');

    var logData = parseLogsBody(req.data(), 0);
    expect(logData).toBe('l');
  });

  it('should send an array of logs in a single request', function() {
    send(['a', 'b']);

    var requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(1);

    var req = requests.mostRecent();
    expect(req.method).toBe('POST');

    var l1 = parseLogsBody(req.data(), 0);
    expect(l1).toBe('a');

    var l2 = parseLogsBody(req.data(), 1);
    expect(l2).toBe('b');
  });
});
