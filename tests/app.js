'use strict';

const app = require('../app');
const log = require('tracer').colorConsole().log;

const cb = (err, verse) => {
    log(err, verse.responseCode, verse.responseText.substr(0, 100) + '...');
    log(verse);
}
describe('app', function () {
    it('canary.check', function (done) {
        this.timeout = 5000;
        app.check(new app.verse('Google', 'https://www.google.com/'), (err, verse) => {
            cb(err, verse);
            done(err);
        });
    });

    it('canary.check2', function (done) {
        this.timeout = 5000;
        app.check(new app.verse('Google', 'https://www.google.com/xxx'), (err, verse) => {
            cb(err, verse);
            done(err);
        });
    });

    it('canary.check3', function (done) {
        this.timeout = 50000;
        app.check(new app.verse('Copyright', 'https://www.copyrights.com.au/sdafasf'), (err, verse) => {
            cb(err, verse);
            done(err);
        });
    });
});