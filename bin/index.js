#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const exists = require('fs').existsSync;
const Generate = require('../lib/generator')

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
    const projectPath = path.resolve(rawName);
    inquirer.prompt([{
        type: 'confirm',
        message: exists(projectPath) 
            ? 'Target directory exists. Continue?'
            : 'Generate project in current directory?',
        name: 'ok'
    }]).then(answers => {
        if (answers.ok) {
            run(projectPath,rawName)
        }
    }).catch(e => {
        throw new Error(e);
    })
}

process.on('exit', () => {
    console.log()
})

function run(projectPath,projectName) {
    const plugins = new Set();
    inquirer.prompt([{
        type: 'confirm',
        message: '是否使用axio进行数据请求？',
        name: 'ok'
    }]).then(answers => {
        if (answers.ok) {
            // 加入axios代码部分
           plugins.add('axios');
        } 
        inquirer.prompt([{
            type: 'confirm',
            message: '是否使用cdn',
            name: 'ok'
        }]).then(answers => {
            if (answers.ok) {
                // 加入cdn代码部分
            //plugins.add('cdn');
            } 
            const generator = new Generate(plugins, projectPath, projectName)
            generator.create();
        })
    })
    
}