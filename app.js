'use strict';

const axios = require('axios');
const md5 = require('md5');
const striptags = require('sanitize-html');
const verses = [];
const chalk = require('chalk');
let log;

// do not log when verbose is not there
if (process.verbose === true) {
    log = console.log;
} else {
    log = () => { };
}

/**
 * verse
 * about a website/app/etc
 * 
 * @param url mixed if string, use it as URL, if object, assign it
 */
class verse {
    constructor(url, method = 'GET', payload = null, timeout = 5000, title = null, auth = {}, headers = []) {
        // check if url is actually object
        let targetURL = '';
        if (typeof url == 'object') {
            Object.keys(url).forEach((k) => {
                this[k] = url[k];
            });

            this.CodeGreen = 200;
            this.CodeYellow = 404;
        } else {
            targetURL = url;
            // store in class
            this.title = title;
            this.timeout = timeout;
            this.url = targetURL;
            this.method = method;
            this.auth = auth;
            this.payload = payload;
            this.headers = headers;
            this.statusCode = null;
            this.response = null;
            this.statusText = null;
            this.responseText = null;
            this.colorKey = 'red';
            this.timeElapsed = 0;
        }
        if (!this.title) {
            this.title = this.url;
        }
        this.hash = md5(this.title);
        verses.push(this);
    }
};

const check = async (verse, cb) => {
    let startTime = Date.now();
    // use axios to request
    const cnf = {
        baseURL: verse.url,
        timeout: verse.timeout,
        headers: verse.headers,
        method: verse.method,
        auth: verse.auth,
        data: verse.payload
    };

    const instance = axios.create();

    const parse = (resp, verse) => {

        let response;
        if (resp.isAxiosError) {
            // log(resp);
            response = resp.response;
        } else {
            response = resp;
        }

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
        verse.timeElapsed = Date.now() - startTime;


        log(chalk`\n\n{bold TEST URL: ${verse.url}} FINISHED IN ${verse.timeElapsed}ms \nRESULT: {${colorKey} ${verse.statusCode} ${verse.statusText}}\n`);
        log(chalk`\n{bold request config:}`);
        log(cnf);
        log(chalk`\n{bold response:}`);
        log(`${verse.response.replace(/\n/ig, '').trim().trim('\n').substr(0,400)}...`);
    };

    instance.request(cnf).then((response) => {
        parse(response, verse);
        cb(null, verse);
    }, (error) => {
        parse(error, verse);
        cb(null, verse);
    }).catch(error => {
        log(chalk`{red Error ${error.toString()}}`);
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