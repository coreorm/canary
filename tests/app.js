'use strict';
process.verbose = true;

const app = require('../app');
const log = require('tracer').colorConsole().log;
const expect = require('chai').expect;

const cb = (err, verse, code, done) => {
    try {
        // log(verse);
        expect(verse.statusCode).to.equal(code);
        verse.responseText = verse.responseText.substr(0, 100) + '...';
        verse.response = verse.response.substr(0, 100) + '...';
        done(err);
    } catch (e) {
        done(e);
    }
}
describe('app', function () {
    it('Expect https://www.google.com/ to be 200', function (done) {
        this.timeout = 5000;
        app.check(new app.verse('https://www.google.com/'), (err, verse) => cb(err, verse, 200, done));
    });
    //*
    it('Expect https://www.google.com/xxx to be 404', function (done) {
        this.timeout = 5000;
        app.check(new app.verse('https://www.google.com/xxx'), (err, verse) => cb(err, verse, 404, done));
    });

    it('Expect PUT https://www.google.com.au/ to be 405', function (done) {
        this.timeout = 5000;
        app.check(new app.verse({
            url: 'https://www.google.com.au/',
            title: 'Google',
            method: 'put',
            payload: {hello: 'world'},
            timeout: 3000
        }), (err, verse) => cb(err, verse, 405, done));
    });
    //*/
});