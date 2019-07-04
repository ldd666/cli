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
        this.pkg = {};
        this.importInject = [];
        this.pluginFilePath = [];
        this.pluginCfg = {};
        this.init(plugins)
    }
    create() {
        this.extendPackages();
    }
    extendPackages() {
        
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
    init(plugins) {
        plugins.forEach(plugin => {
            this.pluginCfg[plugin] = require(`./packages/${plugin}/index.js`)
 
            if(Array.isArray(this.pluginCfg[plugin].packages)){
                this.pluginCfg[plugin].packages.forEach(name => {
                    if(!value.name) return;
                    this.pkg[value.name] = value;
                })
            }
            if(this.pluginCfg[plugin].imports) {
                this.importInject.push(plugins);
            }
         });
    }
    readFile() {
        
    }
}
// 根据包名读取配置信息
// 修改import
// 修改package.json
// 插入文件如store。js 



