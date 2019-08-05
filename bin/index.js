#!/usr/bin/env node

const program = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')
const exists = require('fs').existsSync
const Generate = require('../lib/generator')
const execa = require('execa')
const { getPromptModules } = require('../lib/prompt')
program
  .version(require('../package').version, '-v, --version')
  .usage('<project-name>')
  .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')

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

create()

async function create () {
  program.parse(process.argv)

  if (program.args.length < 1) return program.help()

  const projectName = program.args[0]
  const projectPath = path.resolve(projectName)
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
    getPromptModules((presets) => {
      console.log(presets)
      const generator = new Generate(presets, projectPath, projectName)
      generator.create()
    })
  }
}
