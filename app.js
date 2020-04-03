'use strict';

const axios = require('axios');
const md5 = require('md5');
const striptags = require('sanitize-html');
const verses = [];
const chalk = require('chalk');
let log;

// do not log when verbose is not there
if (process.verbose !== true) {
    log = () => { };
} else {
    log = console.log;
}

/**
 * verse
 * about a website/app/etc
 * 
 * @param url mixed if string, use it as URL, if object, assign it
 */
class verse {
    constructor(url, method = 'GET', payload = null, timeout = 5000, title = null, auth = {}, headers = [], CodeGreen = 200, CodeYellow = 404, CodeRed = 500) {
        // check if url is actually object
        let targetURL = '';
        if (typeof url == 'object') {
            Object.keys(url).forEach((k) => {
                this[k] = url[k];
            });
        } else {
            targetURL = url;
            // store in class
            if (!title) {
                title = targetURL;
            }
            this.title = title;
            this.url = targetURL;
            this.method = method;
            this.CodeGreen = CodeGreen;
            this.CodeYellow = CodeYellow;
            this.CodeRed = CodeRed;
            this.timeout = timeout;
            this.hash = md5(this.title);
            this.auth = auth;
            this.payload = payload;
            this.headers = headers;
            this.statusCode = null;
            this.response = null;
            this.statusText = null;
            this.responseText = null;
            this.colorKey = null;
            this.lastCheckedTime = null;
        }



        verses.push(this);
    }
};

const check = async (verse, cb) => {
    // use axios to request
    const cnf = {
        baseURL: verse.url,
        timeout: verse.timeout,
        headers: verse.headers,
        method: verse.method,
        auth: verse.auth,
        data: verse.payload
    };

    log(`\n\n>> Test URL: ${verse.url}\n\n`);
    log('Request Config:');
    log(cnf);

    const instance = axios.create();

    const parse = (resp, verse) => {
        let response;
        if (resp.isAxiosError) {
            // log(resp);
            response = resp.response;
        } else {
            response = resp;
        }

        log(Object.keys(resp));

        verse.statusCode = response.status;
        verse.response = response.data;
        verse.statusText = response.statusText;

        let colorKey = 'red';

        if (verse.statusCode == verse.CodeGreen) {
            colorKey = 'green';
        } else if (verse.statusCode == verse.CodeYellow) {
            colorKey = 'yellow';
        }
        // setback to verse
        verse.colorKey = colorKey;
        verse.responseText = striptags(verse.response, {
            allowedTags: [],
            allowedAttributes: {}
        });

        log(chalk`- code: {${colorKey} ${verse.statusCode} ${verse.statusText}}`);
        log(`- response: ${verse.response.substr(0,100)}...`);
    };

    instance.request(cnf).then((response) => {
        parse(response, verse);
        cb(null, verse);
    }, (error) => {
        parse(error, verse);
        cb(null, verse);
    }).catch(error => {
        log(chalk`{redBg Error ${error.toString()}}`);
        log(error);
        cb(error);
    });
};

const getVerses = () => verses;

module.exports = {
    verse,
    check,
    getVerses
}