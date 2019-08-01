const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const execa = require('execa')
const chalk = require('chalk')
const copy = require('copy')

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
    // this.render()
    // this.extendPackages()
    // this.installDeps()
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
    // 读取模板文件
    toPath.forEach(dirname => {
      const sourcePath = path.resolve(templatePath, dirname.source)
      const targetPath = path.resolve(this.path, dirname.target)
      readCircle(sourcePath, targetPath)
    })


    // fs.readdirSync(templatePath).forEach((p) => {
    //   console.log(p)
    //   const template = fs.readFileSync(path.resolve(templatePath, p))
    //   toPath = toPath.map(item => path.resolve(this.path, item))
    //   this.writeFile(p, template, toPath)
    // })
    
    // toPath.forEach(item => {
    //   const sourcePath = path.resolve(templatePath, item.source)
    //   fs.readdirSync(sourcePath).forEach((name) => {
    //     const subPath = path.resolve(templatePath, name)
    //     if (fs.statSync(subPath).isDirectory()) {

    //     }
    //     const template = fs.readFileSync(subPath)
    //     toPath = toPath.map(item => path.resolve(this.path, item))
    //     this.writeFile(toPath, p, template)
        
    //   })
    // })
    function readCircle (source, target) {
      if (fs.statSync(source).isDirectory()) {
        fs.readdirSync(source).forEach(item => {
          console.log(item, '=======')
          if (fs.statSync(target + '/' + item).isDirectory() && !fs.existsSync(target + '/' + item)) {
            fs.mkdirSync(target + '/' + item)
          }
          readCircle(source + '/' + item, target + '/' + item)
        })
      } else {
        console.log(target, '=====')
        const template = fs.readFileSync(source, 'utf-8')
        fs.writeFileSync(target, template, 'utf8', (err) => {
          if (err) throw err
        })
      }
    }
  }

  /**
   * 读取项目文件，并将handbar模板，渲染为模板文件
   */
  render () {
    const presets = this.presets
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
    const templatePath = path.resolve(__dirname, 'template')
    renderCircle(templatePath)
  }

  /**
   * 获取presets中的配置信息
   * @param {*} presets
   */
  init (presets) {
    // execa('rm', ['-r', this.path])
    presets.selectFeatures.forEach(preset => {
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

  // writeFile (dir, filename, content) {
  //   if (!fs.existsSync(this.path)) {
  //     fs.mkdirSync(this.path)
  //   }
  //   dir.forEach(item => {
  //     const pathname = path.resolve(this.path, item)
  //     if (!fs.existsSync(pathname)) {
  //       fs.mkdirSync(pathname)
  //     }
  //   })
  //   if (filename && content) {
  //     fs.writeFileSync(path.resolve(dir[dir.length - 1], filename), content, 'utf8', (err) => {
  //       if (err) throw err
  //     })
  //   }
  // }
}
module.exports = Generator
