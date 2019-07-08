const ejs = require('ejs')
const fs = require('fs')
const path = require('path')



class Generator {
    /**
     * 插件名称列表如axios、jquery、cdn
     * @param {*} plugins 
     */
    constructor(plugins, path, projectName) {
        if(!plugins) return;
        this.pkg = {};
        this.importInject = [];
        this.pluginFilePath = [];
        this.pluginCfg = {};
        this.path = path;
        this.projectName = projectName;
        this.init(plugins)
    }
    create() {
        this.render();
        this.extendPackages();
    }
    extendPackages() {
        const packages = require('./template/package.json');
        for(let dep in this.pkg){
            if(!packages[dep]) {
                packages.dependencies[dep] = this.pkg[dep].version;
            }
        }
        this.writeFile('package.json', JSON.stringify(packages, null, 2), [this.path]);
    }
    injectTemplates(fromPath, toPath) {   
        let dirPath = path.resolve(__dirname, 'packages', fromPath, 'template');
        fs.readdirSync(dirPath).forEach((p) => {
            const template = fs.readFileSync(path.resolve(dirPath, p))
            toPath = toPath.map(item => path.resolve(this.path, item))
            this.writeFile(p, template, toPath)
        })
    }
    render() {
        let importInject = this.importInject;
        let projectName = this.projectName;
        let projectPath = this.path;
        function renderCircle(dir){
            if (fs.statSync(dir).isDirectory()) {
                if (dir != templatePath && !fs.existsSync(dir.replace(templatePath, projectPath))) {
                    fs.mkdirSync(dir.replace(templatePath, projectPath));
                }
                fs.readdirSync(dir).forEach(item => {
                    let child = dir + '/' + item;
                    renderCircle(child)
                })
                
            } else {
                const template = fs.readFileSync(dir, 'utf-8')
                const renderFile = ejs.render(template, {
                    importInject: importInject,
                    rootOptions: {
                        projectName: projectName,
                        baseUrl: '/'
                    }
                })
                if(!fs.existsSync(dir.replace(templatePath, projectPath))){
                    fs.writeFile(dir.replace(templatePath, projectPath), renderFile, 'utf8',(err) => {
                        if (err) throw err;
                    })
                }
            }
        }
        let templatePath = path.resolve(__dirname, 'template');
        renderCircle(templatePath)
        
    }
    init(plugins) {
        plugins.forEach(plugin => {
            this.pluginCfg[plugin] = require(`./packages/${plugin}/index.js`)
            // init package
            if(Array.isArray(this.pluginCfg[plugin].packages)){
                this.pluginCfg[plugin].packages.forEach(item => {
                    if(!item.name) return;
                    this.pkg[item.name] = item;
                })
            }
            if(this.pluginCfg[plugin].imports) {
                this.importInject.push(plugins);
            }
            this.injectTemplates(plugin, this.pluginCfg[plugin].path);

         });
    }
    writeFile(filename, content, dir) {
        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path);
        }
        dir.forEach(item => {
            if (!fs.existsSync(item)) {
                fs.mkdirSync(item);
            }
        })
        
        fs.writeFile(path.resolve(dir[dir.length - 1],filename), content, 'utf8',(err) => {
            if (err) throw err;
        })

    }
}
// 根据包名读取配置信息
// 修改import
// 插入文件如store。js 

// 修改package.json 已完成



module.exports = Generator;