exports.getPromptModules = () => {
  const modules = [
    'axios',
    'qcdn',
    'element',
    'vuex',
    'css',
    'components',
    'login',
    'auth'
  ]
  return modules.map(file => require(`./promptModules/${file}`)).reduce((prev, current) => prev.concat(current))
}
