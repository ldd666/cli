exports.getPromptModules = () => {
  const modules = [
    'axios',
    'qcdn',
    'element'
  ]
  return modules.map(file => require(`./promptModules/${file}`)).reduce((prev, current) => prev.concat(current))
}
