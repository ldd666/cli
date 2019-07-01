#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const exists = require('fs').existsSync;
const generate = require('../lib/generator')

program
    .version(require('../package').version, '-v, --version')
    .usage('<project-name>');

program.on('--help', () => {
    console.log();
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # create a new project with an simple template'))
    console.log('    $ baike my-project')
    console.log()
    });

function help () {
    program.parse(process.argv)
    if (program.args.length < 1) return program.help()
}
help();

if (program.args) {
    const rawName = program.args[0]
    const to = path.resolve(rawName);
    inquirer.prompt([{
        type: 'confirm',
        message: exists(to) 
            ? 'Target directory exists. Continue?'
            : 'Generate project in current directory?',
        name: 'ok'
    }]).then(answers => {
        if (answers.ok) {
            run()
        }
    }).catch(e => {
        throw new Error(e);
    })
}

process.on('exit', () => {
    console.log()
})

function run() {
    inquirer.prompt([{
        type: 'confirm',
        message: '是否使用axio进行数据请求？',
        name: 'ok'
    }]).then(answers => {
        if (answers.ok) {
            // 加入axios代码部分
            generate()
        } else {
            // 直接编译生成
        }
    })
}