module.exports = [{
  type: 'confirm',
  message: '是否需要设置element主题',
  name: 'elementTheme'
}, {
  type: 'input',
  message: '请输入主题颜色,如#ffffff',
  name: 'elementColor',
  when: (answers) => {
    return answers.elementTheme
  },
  validate: (value) => {
    const reg = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/g
    if (reg.test(value)) {
      return true
    }
    return '请输入正确的颜色值'
  }
}]
