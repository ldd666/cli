const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const basics = ['axios', 'vuex', 'qcdn']
const modules = [
  new inquirer.Separator(' = The features = '),
  {
    name: 'vuex',
    checked: true
  }, {
    name: 'axios',
    checked: true
  }, {
    name: 'qcdn',
    checked: true
  }, {
    name: 'element'
  }, {
    name: 'css'
  }, {
    name: 'components'
  }, {
    name: 'login'
  }, {
    name: 'auth'
  }
]
const themes = [{
  name: 'xiaoqi'
}, {
  name: 'dandan'
}, {
  name: 'pangzi'
}]
exports.getPromptModules = (callback) => {
  const Packages = getPackageName()
  inquirer.prompt([{
    type: 'list',
    name: 'features',
    message: '请选择项目配置',
    default: 2,
    choices: [{
      name: '基础配置',
      value: basics,
      short: 'axios, vuex, qcdn'
    }, {
      name: '手动配置',
      value: modules,
      short: ''
    }, {
      name: '主题选择',
      value: themes,
      short: ''
    }]
  }]).then(function (answers) {
    const selectStr = JSON.stringify(answers.features)
    const answersInfo = {
      features: []
    }
    switch (selectStr) {
      case JSON.stringify(basics):
        // 写基础配置
        console.log('-----基础配置如下------')
        answersInfo.features = answers.features.filter((feature) => Packages.indexOf(feature) > -1)
        callback && callback(answersInfo)
        break
      case JSON.stringify(modules):
        // 写模块逻辑
        console.log('-----手动配置如下------')
        inquirer.prompt({
          type: 'checkbox',
          name: 'features',
          message: '',
          choices: answers.features
        }).then(answers => {
          inquirer.prompt(answers
            .features
            .map(file => require(`./promptModules/${file}`))
            .reduce((prev, current) => prev.concat(current)))
            .then(moduleAnswers => {
              // callback && callback(Object.assign({}, answers, moduleAnswers))
              const features = answers.features.filter(feature => Packages.indexOf(feature) > -1)
              for (const preset in moduleAnswers) {
                // type 为input类型的，或者list单选列表的
                const value = moduleAnswers[preset]
                if (typeof value === 'string') {
                  if (Packages.indexOf(value) > -1) {
                    features.push(value)
                  }
                }
                // checkbox类型
                if (typeof value === 'object') {
                  value.forEach(answer => {
                    if (Packages.indexOf(answer) > -1) {
                      features.push(answer)
                    }
                  })
                }
              }
              answersInfo.features = features
              callback && callback(Object.assign({}, answersInfo, moduleAnswers))
            })
        })
        break
      case JSON.stringify(themes):
        // 写主题逻辑
        console.log('------请选择主题-------')
        // type = 'rawlist'
        break
    }

    // if (answers.selectFeatures.length === 2) {
    //   callback && callback(answers)
    // } else {
    //   inquirer.prompt({
    //     type: 'checkbox',
    //     name: 'selectFeatures',
    //     message: '请选择项目配置',
    //     choices: modules
    //   }).then(answers => {
    //     inquirer.prompt(answers
    //       .selectFeatures
    //       .map(file => require(`./promptModules/${file}`))
    //       .reduce((prev, current) => prev.concat(current)))
    //       .then(moduleAnswers => {
    //         callback && callback(Object.assign({}, answers, moduleAnswers))
    //       })
    //   })
    // }
  })
}

function getPackageName() {
  const name = []
  fs.readdirSync(path.resolve(__dirname,'./packages')).forEach(item => {
    name.push(item)
  })
  return name
}
