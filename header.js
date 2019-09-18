'use strict';

// load conf
const result = require('dotenv').config();

if (process.env.DEBUG) {
    require('mocha');
    global.expect = require('chai').expect;
}
