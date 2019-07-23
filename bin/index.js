#!/usr/bin/env node

const program = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')
const exists = require('fs').existsSync
const Generate = require('../lib/generator')
const execa = require('execa')

program
  .version(require('../package').version, '-v, --version')
  .usage('<project-name>')

program.on('--help', () => {
  console.log()
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # create a new project with an simple template'))
  console.log('    $ baike my-project')
  console.log()
})
process.on('exit', () => {
  console.log()
})

async function create () {
  program.parse(process.argv)
  if (program.args.length < 1) return program.help()

  const rawName = program.args[0]
  const projectPath = path.resolve(rawName)
  const isExist = exists(projectPath)
  const { ok } = await inquirer.prompt([{
    type: 'confirm',
    message: isExist
      ? chalk.red('Target directory exists. Continue?')
      : 'Generate project in current directory?',
    name: 'ok'
  }])
  if (ok) {
    if (isExist) {
      const child = execa('rm', ['-r', projectPath])
      child.on('close', code => {
      })
    }
    run(projectPath, rawName)
  }
}

create()

const plugins = new Set()
async function run (projectPath, projectName) {
  prompt({
    type: 'confirm',
    message: '是否使用axio进行数据请求？',
    name: 'ok',
    plugin: 'axios'
  }, () => {
    prompt({
      type: 'confirm',
      message: '是否使用qcdn',
      name: 'ok',
      plugin: 'qcdn'
    }, () => {
      const generator = new Generate(plugins, projectPath, projectName)
      generator.create()
    })
  })
}

async function prompt ({ type, message, name, plugin }, callback) {
  const { ok } = await inquirer.prompt([{
    type: type,
    message: message,
    name: name
  }])
  if (ok) {
    plugins.add(plugin)
  }
  callback && callback()
}
