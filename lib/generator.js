const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const execa = require('execa')
const chalk = require('chalk')

class Generator {
  /**
     * 插件名称列表如axios、jquery、cdn
     * @param {*} presets
     */
  constructor (presets, path, projectName) {
    if (!presets) return
    this.presets = presets

    // preset中 包依赖
    this.presetPkg = {}
    // 各个preset， 配置集合
    this.presetCfg = {}
    // 项目路径
    this.path = path
    // 项目名称
    this.projectName = projectName
    this.init(presets)
  }

  create () {
    this.render()
    this.extendPackages()
    this.installDeps()
  }

  extendPackages () {
    const packages = require('./template/package.json')
    for (const dep in this.presetPkg) {
      if (!packages[dep]) {
        packages.dependencies[dep] = this.presetPkg[dep].version
      }
    }
    fs.writeFileSync(path.resolve(this.path, 'package.json'), JSON.stringify(packages, null, 2), 'utf8', (err) => {
      if (err) throw err
    })
  }

  /**
   * 安装项目依赖
   */
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

  /**
   * 从preset文件中，拷贝到项目文件指定目录下
   * @param {*} fromPath
   * @param {*} toPath
   */
  injectTemplates (fromPath, toPath) {
    // 创建项目文件夹
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path)
    }
    // 在项目文件夹中添加template所在的文件夹，以防报文件路径找不多error
    toPath.forEach(dirname => {
      let fullname = ''
      dirname.target.split('/').forEach((name) => {
        fullname = fullname ? fullname + '/' + name : name
        const fullpath = path.resolve(this.path, fullname)
        if (!fs.existsSync(fullpath)) {
          fs.mkdirSync(fullpath)
        }
      })
    })
    // 获取模板文件路径
    const templatePath = path.resolve(__dirname, 'packages', fromPath, 'template')
    // 读取模板文件并复制模板到项目中
    toPath.forEach(dirname => {
      const sourcePath = path.resolve(templatePath, dirname.source)
      const targetPath = path.resolve(this.path, dirname.target)
      this.readCircle(sourcePath, targetPath)
    })
  }

  /**
   * 读取项目文件，并将handbar模板，渲染为模板文件
   */
  render () {
    const presets = this.presets
    const projectName = this.projectName
    const projectPath = this.path
    const templatePath = path.resolve(__dirname, 'template')

    // 将源项目文件复制到项目文件中，便于对所有文件进行渲染，包括包文件。
    // 若先渲染，包文件将无法被渲染，不能填写变量了
    const sourcePath = path.resolve(templatePath, './')
    const targetPath = path.resolve(projectPath, './')
    this.readCircle(sourcePath, targetPath)

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
            presets: presets,
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
    renderCircle(targetPath)
  }

  /**
   * 从一个目录，复制到另外一个目录
   * @param {*} source
   * @param {*} target
   */
  readCircle (source, target) {
    if (fs.statSync(source).isDirectory()) {
      fs.readdirSync(source).forEach(item => {
        if (fs.statSync(source + '/' + item).isDirectory() && !fs.existsSync(target + '/' + item)) {
          fs.mkdirSync(target + '/' + item)
        }
        this.readCircle(source + '/' + item, target + '/' + item)
      })
    } else {
      let template = ''
      if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(source)) {
        template = fs.readFileSync(source)
      } else {
        template = fs.readFileSync(source, 'utf-8')
      }
      fs.writeFileSync(target, template, 'utf8', (err) => {
        if (err) throw err
      })
    }
  }

  /**
   * 获取presets中的配置信息
   * @param {*} presets
   */
  init (presets) {
    // execa('rm', ['-r', this.path])
    presets.features.forEach(preset => {
      this.presetCfg[preset] = require(`./packages/${preset}/index.js`)
      // init package
      if (Array.isArray(this.presetCfg[preset].packages)) {
        this.presetCfg[preset].packages.forEach(item => {
          if (!item.name) return
          this.presetPkg[item.name] = item
        })
      }
      // 将模板文件 copy 到项目路径下面
      this.injectTemplates(preset, this.presetCfg[preset].path)
    })
  }
}
module.exports = Generator
