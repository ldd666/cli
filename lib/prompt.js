const inquirer = require('inquirer')
exports.getPromptModules = (callback) => {
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
  inquirer.prompt([{
    type: 'list',
    name: 'features',
    message: '请选择项目配置',
    choices: [{
      name: '默认配置',
      value: ['axios', 'vuex'],
      short: 'axios, vuex'
    }, {
      name: '手动配置',
      value: modules,
      short: ''
    }]
  }]).then(function (answers) {
    if (answers.features.length === 2) {
      callback && callback(answers.features)
    } else {
      inquirer.prompt({
        type: 'checkbox',
        name: 'selectFeatures',
        message: '请选择项目配置',
        choices: modules
      }).then(answers => {
        inquirer.prompt(answers
          .selectFeatures
          .map(file => require(`./promptModules/${file}`))
          .reduce((prev, current) => prev.concat(current)))
          .then(moduleAnswers => {
            callback && callback(Object.assign({}, answers, moduleAnswers))
          })
      })
    }
  })
}
