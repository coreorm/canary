'use strict';

const app = require('../app');
const log = require('tracer').colorConsole().log;

describe('app', function () {
    it('canary.check', function (done) {
        this.timeout = 5000;
        const cb = (err, code, body) => {
            log(err, code);
            done(err);
        }
        app.check(new app.verse('Google', 'https://www.google.com/'), cb);
    });

    it('canary.check2', function (done) {
        this.timeout = 5000;
        const cb = (err, code, body) => {
            log(err, code);
            done(err);
        }
        app.check(new app.verse('Google', 'https://www.google.com/xxx'), cb);
    });

    it('canary.check3', function (done) {
        this.timeout = 50000;
        const cb = (err, code, body) => {
            log(err, code);
            done(err);
        }
        app.check(new app.verse('Copyright', 'https://www.copyrights.com.au/sdafasf'), cb);
    });
});