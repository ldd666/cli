module.exports = [{
  type: 'confirm',
  message: '是否使用css预处理器？',
  name: 'css'
}, {
  type: 'list',
  name: 'cssPre',
  message: '请选择一个css预处理器',
  choices: ['Stylus', 'Less', 'Sass/SCSS']
}]
