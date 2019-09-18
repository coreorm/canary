'use strict';

const database = require('s3-nosql');
const req = require('request');
const md5 = require('md5');
const striptags = require('sanitize-html');

// all verses
const verses = [];

// new db
const db = new database(process.env.S3_BUCKET_NAME);

const prefix = 'canary/' + process.env.ENVIRONMENT + '/';

/**
 * verse
 * about a website/app/etc
 */
class verse {
    constructor(title, url, interval = 3000, CodeGreen = 200, CodeYellow = 404, CodeRed = 500, iconURL = null) {
        // store in class
        this.title = title;
        this.url = url;
        this.interval = interval;
        this.CodeGreen = CodeGreen;
        this.CodeYellow = CodeYellow;
        this.CodeRed = CodeRed;
        this.iconURL = iconURL;
        this.prefix = prefix;
        this.hash = md5(this.title);
        this.table = prefix + this.hash;
        this.tableGreen = this.table + '/green';
        this.tableYellow = this.table + '/yellow';
        this.tableRed = this.table + '/red';

        // save to verses
        verses.push(this);
    }
};

const check = (verse, cb) => {
    // verify URL
    req(verse.url, (err, resp, body) => {

        let timestamp = Date.now();
        let d = new Date();
        let today = d.toISOString().substr(0, 10);

        let table = verse.tableRed;
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
                table = verse.tableGreen;
                colorKey = 'green';
            } else if (resp.statusCode == verse.CodeYellow) {
                table = verse.tableYellow;
                colorKey = 'yellow';
            }

            body = striptags(body, {
                allowedTags: [],
                allowedAttributes: {}
            });
        }

        // save to db
        const tb = db.table(table);
        const tbReport = db.table(verse.table);
        tb.fetchOne(today, (err, data) => {
            if (data == null) {
                data = {};
            }
            data[timestamp] = {
                status: resp.statusCode,
                headers: resp.headers,
                body: body.replace(/(\r\n|\n|\r|\t)/gm, ' ')
            };

            tb.save(today, data, (err, d1) => {
                if (err) {
                    return cb(err);
                }
                // save reports as well
                const reportKey = 'report.json';
                tbReport.fetchOne(reportKey, (err, d3) => {
                    if (d3 == null) {
                        d3 = {
                            title: verse.title,
                            updated: new Date(),
                            green: 0,
                            yellow: 0,
                            red: 0
                        };
                    }

                    d3.config = verse;

                    // add to the color
                    d3[colorKey] += 1;

                    tbReport.save(reportKey, d3, (err, d2) => {
                        // finally, move on to the last bit
                        console.log(d3);
                        cb(err, resp.statusCode, data);
                    });

                });
            });
        });


    });
};

const getVerses = () => verses;

module.exports = {
    verse,
    check,
    getVerses
}