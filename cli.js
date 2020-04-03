'use strict';

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
let startTime = Date.now();
const chalk = require('chalk');

const optionDefinitions = [
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Display the usage guide.'
    },
    {
        name: 'url',
        alias: 'u',
        type: String,
        multiple: true,
        description: 'The URL(s) you would like to check, for more than 1 url, separate them by space' +
            '\n {italic Note: authentication is not supported with this option, please use --config-file option instead}',
        typeLabel: '<url>'
    },
    {
        name: 'timeout',
        alias: 't',
        type: Number,
        description: '{italic optional} Timeout value in ms, default is 5000ms',
        typeLabel: '<ms>'
    },
    {
        name: 'config-file',
        alias: 'c',
        type: String,
        description: 'JSON config file, file format see example here: {underline https://github.com/coreorm/canary/blob/master/sample-config.json}'
    },
    {
        name: 'verbose',
        alias: 'v',
        type: Boolean,
        default: false,
        description: 'Verbose mode'
    }
]

const options = commandLineArgs(optionDefinitions)

if (options.help || Object.keys(options).length <= 0) {
    const usage = commandLineUsage([
        {
            header: 'Web Canary Commandline tool',
            content: 'This tool checks one or multiple websites/services to see whether they are online and return a valid response.'
        },
        {
            header: 'Typical Example',
            content: 'webcanary -u http://www.google.com http://www.apple.com -v -t 1000'
        },
        {
            header: 'Options',
            optionList: optionDefinitions
        },
        {
            content: 'Project home: {underline https://github.com/coreorm/canary}'
        }
    ])
    log(usage);
} else {
    // assign options
    let log = console.log;
    if (options.verbose === true) {
        process.verbose = true;
        log = () => { };
    }
    // include here so verbose works.
    const app = require('./app');
    const verse = app.Verse;

    if (options.url instanceof Array) {
        options.url.forEach(url => {
            new verse({
                url: url,
                timeout: options.timeout
            });
        });
    }

    // only use forEach when not verbose

    app.checkMultiple((e, d) => {
        if (d instanceof Array && d.length > 0) {
            d.forEach(v => {
                if (v instanceof verse) {
                    log(v.cliResult);
                }
            });
        }
        console.log(`\nAll tasks finished in ${Date.now() - startTime}ms`);
    });

}