'use strict';

var _chai = require('chai');

var _const_sampler = require('../src/samplers/const_sampler.js');

var _const_sampler2 = _interopRequireDefault(_const_sampler);

var _in_memory_reporter = require('../src/reporters/in_memory_reporter.js');

var _in_memory_reporter2 = _interopRequireDefault(_in_memory_reporter);

var _tracer = require('../src/tracer.js');

var _tracer2 = _interopRequireDefault(_tracer);

var _thrift = require('../src/thrift.js');

var _thrift2 = _interopRequireDefault(_thrift);

var _util = require('../src/util.js');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

// Copyright (c) 2016 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

describe('ThriftUtils', function () {
    it('should exercise all paths in getTagType', function () {
        var blob = new Buffer(1);
        var testCases = [{ 'key': 'double', 'value': 1.0, vType: 'DOUBLE', vDouble: 1.0 }, { 'key': 'boolean', 'value': true, vType: 'BOOL', vBool: true }, { 'key': 'binary', 'value': blob, vType: 'BINARY', vBinary: blob }, { 'key': 'string', 'value': 'some-string', vType: 'STRING', vStr: 'some-string' }, { 'key': 'object', 'value': { x: 'y' }, vType: 'STRING', vStr: '{"x":"y"}' }, { 'key': 'func', 'value': function f() {}, vType: 'STRING', vStr: 'function f() {}' }];

        testCases.forEach(function (testCase) {
            var tag = { 'key': testCase['key'], 'value': testCase['value'] };
            var actualTag = _thrift2.default.getThriftTags([tag])[0];
            var expectedTag = {
                key: testCase.key,
                vType: testCase.vType,
                vStr: testCase.vStr === undefined ? '' : testCase.vStr,
                vDouble: testCase.vDouble === undefined ? 0 : testCase.vDouble,
                vBool: testCase.vBool === undefined ? false : testCase.vBool,
                vLong: testCase.vLong === undefined ? _thrift2.default.emptyBuffer : testCase.vLong,
                vBinary: testCase.vBinary === undefined ? _thrift2.default.emptyBuffer : testCase.vBinary
            };
            _chai.assert.deepEqual(actualTag, expectedTag);
        });
    });

    it('should initialize emptyBuffer to all zeros', function () {
        var buf = new Buffer(8);
        buf.fill(0);

        _chai.assert.deepEqual(_thrift2.default.emptyBuffer, buf);
    });

    it('should convert timestamps to microseconds', function () {
        var reporter = new _in_memory_reporter2.default();
        var tracer = new _tracer2.default('test-service-name', reporter, new _const_sampler2.default(true));
        var span = tracer.startSpan('some operation', { startTime: 123.456 });
        span.log({ event: 'some log' }, 123.567);
        span.finish(123.678);
        tracer.close();
        var tSpan = _thrift2.default.spanToThrift(span);
        _chai.assert.deepEqual(tSpan.startTime, _util2.default.encodeInt64(123456));
        _chai.assert.deepEqual(tSpan.duration, _util2.default.encodeInt64((123.678 - 123.456) * 1000));
        _chai.assert.deepEqual(tSpan.logs[0].timestamp, _util2.default.encodeInt64(123567));
    });
});
//# sourceMappingURL=thrift.js.map
//# sourceMappingURL=thrift.js.map