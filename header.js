'use strict';

if (process.env.DEBUG) {
    require('mocha');
    global.expect = require('chai').expect;
}
