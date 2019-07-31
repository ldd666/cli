module.exports = [{
  type: 'confirm',
  message: '是否使用element-ui',
  name: 'element'
}, {
  type: 'confirm',
  message: '',
  name: 'elementTheme',
  when: (answers) => {
    return answers.element
  }
}, {
  type: 'input',
  message: '请输入主题颜色,如#ffffff',
  name: 'elementColor',
  when: (answers) => {
    return answers.element
  },
  validate: (value) => {
    const reg = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/g
    if (reg.test(value)) {
      return true
    }
    return '请输入正确的颜色值'
  }
}]
