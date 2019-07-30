const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const execa = require('execa')
const chalk = require('chalk')

class Generator {
  /**
     * 插件名称列表如axios、jquery、cdn
     * @param {*} plugins
     */
  constructor (plugins, path, projectName) {
    if (!plugins) return
    this.pkg = {}
    this.importInject = []
    this.pluginFilePath = []
    this.pluginCfg = {}
    this.path = path
    this.projectName = projectName
    this.init(plugins)
  }

  create () {
    this.render()
    this.extendPackages()
    this.installDeps()
  }

  extendPackages () {
    const packages = require('./template/package.json')
    for (const dep in this.pkg) {
      if (!packages[dep]) {
        packages.dependencies[dep] = this.pkg[dep].version
      }
    }
    this.writeFile('package.json', JSON.stringify(packages, null, 2), [this.path])
  }

  installDeps () {
    const child = execa('npm', ['install', '--registry=http://registry.npm.qiwoo.org'], {
      cwd: this.path,
      stdio: ['inherit', 'inherit', 'inherit']
    })

    child.on('close', code => {
      if (code !== 0) return
      console.log(chalk.red('依赖安装完成'))
    })
  }

  injectTemplates (fromPath, toPath) {
    const dirPath = path.resolve(__dirname, 'packages', fromPath, 'template')
    fs.readdirSync(dirPath).forEach((p) => {
      const template = fs.readFileSync(path.resolve(dirPath, p))
      toPath = toPath.map(item => path.resolve(this.path, item))
      this.writeFile(p, template, toPath)
    })
  }

  render () {
    const importInject = this.importInject
    const projectName = this.projectName
    const projectPath = this.path
    function renderCircle (dir) {
      const projectDir = dir.replace(templatePath, projectPath)
      if (fs.statSync(dir).isDirectory()) {
        if (dir !== templatePath && !fs.existsSync(projectDir)) {
          fs.mkdirSync(projectDir)
        }
        fs.readdirSync(dir).forEach(item => {
          renderCircle(dir + '/' + item)
        })
      } else {
        let renderFile = ''
        if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(dir)) {
          renderFile = fs.readFileSync(dir)
        } else {
          const template = fs.readFileSync(dir, 'utf-8')
          renderFile = ejs.render(template, {
            importInject: importInject,
            rootOptions: {
              projectName: projectName,
              baseUrl: '/'
            }
          })
        }
       
        fs.writeFileSync(projectDir, renderFile, 'utf8', (err) => {
          if (err) throw err
        })
      }
    }
    const templatePath = path.resolve(__dirname, 'template')
    renderCircle(templatePath)
  }

  init (plugins) {
    execa('rm', ['-r', this.path])
    plugins.forEach(plugin => {
      this.pluginCfg[plugin] = require(`./packages/${plugin}/index.js`)
      // init package
      if (Array.isArray(this.pluginCfg[plugin].packages)) {
        this.pluginCfg[plugin].packages.forEach(item => {
          if (!item.name) return
          this.pkg[item.name] = item
        })
      }
      if (this.pluginCfg[plugin].imports) {
        this.importInject.push(plugin)
      }
      this.injectTemplates(plugin, this.pluginCfg[plugin].path)
    })
  }

  writeFile (filename, content, dir) {
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path)
    }
    dir.forEach(item => {
      if (!fs.existsSync(item)) {
        fs.mkdirSync(item)
      }
    })

    fs.writeFileSync(path.resolve(dir[dir.length - 1], filename), content, 'utf8', (err) => {
      if (err) throw err
    })
  }
}
module.exports = Generator
