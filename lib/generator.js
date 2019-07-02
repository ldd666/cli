const ejs = require('ejs')
const fs = require('fs')
const path = require('path')



class Generator {
    /**
     * 插件名称列表如axios、jquery、cdn
     * @param {*} plugins 
     */
    constructor(plugins) {
        if(!plugins) return;
        this.pkg = new Set();
        this.pluginFilePath = [];
        plugins.forEach(plugin => {
           const pluginCfg = require(`./packages/${plugin}/index.js`)

           if(Array.isArray(pluginCfg.packages)){
               pluginCfg.packages.forEach(name => {
                   this.extendPackages(name);
               })
           }
           // todo 将axios插件中的文件，拷贝到要生成的目录中！
           this.pluginFilePath.push({
               from:pluginCfg.templatePath,
               to:''
            })
        });
    }
    extendPackages(value) {
        this.pkg.add(value)
    }
    render() {
        // 写个demo 渲染模板
        const template = fs.readFileSync(path.resolve('./lib/template/public/index.html'), 'utf-8');
        const result = ejs.render(template, {
            rootOptions: {
                projectName: 'dandan'
            },
            BASE_URL:'hhhhhhh'
        })
        console.log(result);
    }
}

// 修改import
// 修改package.json
// 插入文件如store。js 



