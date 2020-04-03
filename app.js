'use strict';

const req = require('request');
const md5 = require('md5');
const striptags = require('sanitize-html');
const verses = [];

/**
 * verse
 * about a website/app/etc
 */
class verse {
    constructor(url, method = 'GET', payload = null, timeout = 5000, title = null, auth = {}, headers = [], CodeGreen = 200, CodeYellow = 404, CodeRed = 500) {
        // store in class
        if (!title) {
            title = url;
        }
        this.title = title;
        this.url = url;
        this.method = method;
        this.CodeGreen = CodeGreen;
        this.CodeYellow = CodeYellow;
        this.CodeRed = CodeRed;
        this.timeout = timeout;
        this.hash = md5(this.title);
        this.auth = auth;
        this.payload = payload;
        this.headers = headers;
        this.responseCode = null;
        this.response = null;
        this.responseText = null;
        this.colorKey = null;

        verses.push(this);
    }
};

const check = (verse, cb) => {
    // verify URL
    req(verse.url, (err, resp, body) => {

        let timestamp = Date.now();
        let d = new Date();
        let today = d.toISOString().substr(0, 10);
        let colorKey = 'red';

        if (err) {
            resp = {
                headers: err,
                statusCode: 500
            }
            body = err.toString();
            // clear error as we don't need it
            err = null;
        } else {
            if (resp.statusCode == verse.CodeGreen) {
                colorKey = 'green';
            } else if (resp.statusCode == verse.CodeYellow) {
                colorKey = 'yellow';
            }
        }
        // setback to verse
        verse.colorKey = colorKey;
        verse.response = body;
        verse.responseText = striptags(body, {
            allowedTags: [],
            allowedAttributes: {}
        });
        verse.responseCode = resp.statusCode;

        // call back
        cb(err, verse);
    });
};

const getVerses = () => verses;

module.exports = {
    verse,
    check,
    getVerses
}