'use strict';

const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

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
            ' {italic Note: authentication is not supported with this option, please use --config-file option instead}',
        typeLabel: '<url>'
    },
    {
        name: 'timeout',
        alias: 't',
        type: Number,
        description: 'Timeout value in ms',
        typeLabel: '<ms>'
    },
    {
        name: 'config-file',
        alias: 'c',
        type: String,
        description: 'JSON config file, file format see example'
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
    console.log(usage)
} else {
    console.log(options)
}