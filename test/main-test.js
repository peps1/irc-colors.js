const vows   = require('vows');
const assert = require('assert');
const c      = require('..');

// Activate global syntax.
// Modifies the String prototype for a sugary syntax.
c.global();

const txt = 'test me';
const badtxt = ',1 hi';
const zero = c.bold('');
const tests = {
  'blue': [
    txt,
    '\x0312' + txt + '\x03'
  ],
  'white': [
    txt,
    '\x0300' + txt + '\x03'
  ],
  'red': [
    badtxt,
    '\x0304' + zero + badtxt + '\x03'
  ],
  'bold': [
    txt,
    '\x02' + txt + '\x02'
  ],
  'bold.grey': [
    txt,
    '\x0314' + '\x02' + txt + '\x02\x03'
  ],
  'underline': [
    txt,
    '\x1F' + txt + '\x1F'
  ],
  'green.underline': [
    txt,
    '\x1F\x0303' + txt + '\x03\x1F'
  ],
  'bold.white': [
    txt,
    '\x0300' + '\x02' + txt + '\x02\x03'
  ],
  'white.italic': [
    txt,
    '\x1D\x0300' + txt + '\x03\x1D'
  ],
  'bggray': [
    txt,
    '\x0301,14' + txt + '\x03'
  ],
  'blue.bgblack': [
    txt,
    '\x0312,01' + txt + '\x03'
  ],
  'red.bgblack': [
    badtxt,
    '\x0304,01' + badtxt + '\x03'
  ],
  'rainbow': [
    'hello u',
    '\x0304' + 'h\x03\x0307' + 'e\x03\x0308' +
    'l\x03\x0303' + 'l\x03\x0312' + 'o\x03 \x0302' +
    'u\x03'
  ],
  'stripColors': [
    '\x0304' + 'h\x03\x0307' + 'e\x03\x0308' +
    'l\x03\x0303' + 'l\x03\x0312' + 'o\x03',
    'hello'],
  'red.stripColors': ['hello', 'hello'],
  'bgblue.stripColors': ['hello', 'hello'],
  'red.bold.stripColors': [
    'hello',
    '\x02hello\x02'
  ],
  'bold.red.stripColors': [
    'hello',
    '\x02hello\x02'
  ],
  'stripStyle': [
    '\x0301' + '\x02' + txt + '\x0F\x03',
    '\x0301' + txt + '\x03'
  ],
  'blue.stripStyle': [
    'hello',
    '\x0312' + 'hello\x03',
  ],
  'blue.bgblack.stripStyle': [
    'hello',
    '\x0312,01' + 'hello\x03'
  ],
  'bold.stripStyle': ['hello', 'hello'],
  'bold.blue.stripStyle': [
    'hello',
    '\x0312' + 'hello\x03'
  ],
  'blue.bold.stripStyle': [
    'hello',
    '\x0312' + 'hello\x03'
  ],
  'rainbow.stripStyle': [
    'hello',
    '\x0304' + 'h\x03\x0307' + 'e\x03\x0308' +
    'l\x03\x0303' + 'l\x03\x0312' + 'o\x03'
  ],
  'stripColorsAndStyle': [
    '\x1Fone\x0F \x0312' + '\x02hello\x03',
    'one hello'
  ]
};

const topicMacro = (reg) => {
  return {
    topic: () => {
      let obj = {};

      for (let key in tests) {
        let fn = reg ? c : tests[key][0].irc;
        let s = key.split('.');

        for (let i in s) {
          fn = fn[s[i]];
        }

        obj[key] = reg ? fn(tests[key][0]) : fn();
      }
      return obj;
    }
  };
};

const regular = topicMacro(true);
const globalSyntax = topicMacro(false);

const equal = (expectedStr, gotStr) => {
  let expectedBuf = Buffer.from(expectedStr, 'utf8');
  let gotBuf = Buffer.from(gotStr, 'utf8');
  assert.deepEqual(expectedBuf, gotBuf);
};

const test = (key) => {
  regular[key] = (topic) => {
    equal(topic[key], tests[key][1]);
  };
  globalSyntax[key] = (topic) => {
    equal(topic[key], tests[key][1]);
  };
};

for (let key in tests) {
  test(key);
}

vows.describe('Test').addBatch({
  'Using regular syntax': regular,
  'Using global syntax': globalSyntax
}).export(module);
