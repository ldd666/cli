const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const execa = require('execa')
const execSync = require('child_process').execSync;


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
        // 安装package.json 依赖
        this.installDeps();
    }
    extendPackages() {
        const packages = require('./template/package.json');
        for(let dep in this.pkg){
            if(!packages[dep]) {
                packages.dependencies[dep] = this.pkg[dep].version;
            }
        }
        this.writeFile('package.json', JSON.stringify(packages, null , 2), [this.path]);
    }
    installDeps() {
        //execSync('npm install');
        // console.log(this.path, process.cwd());
        const child = execa('npm', ['install', '--registry=https://registry.npm.taobao.org'], {
            cwd: this.path
        })
        // child.stdout.on('data', buffer => {
        //     console.log(buffer, '==buffer');
        //     let str = buffer.toString().trim()
        //     console.log(str, '====');
        //     process.stdout.write(buffer);
        // })
        // child.on('close', code => {
        //     if (code !== 0) {
        //       return
        //     }
        // })
        //const execSync = require('child_process').execSync;
        //execSync('npm install --registry=https://registry.npm.taobao.org', {stdio:[0,1,2],cwd: this.path});

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
            const projectDir = dir.replace(templatePath, projectPath);
            if (fs.statSync(dir).isDirectory()) {
                if (dir != templatePath && !fs.existsSync(projectDir)) {
                    fs.mkdirSync(projectDir);
                }
                fs.readdirSync(dir).forEach(item => {
                    renderCircle(dir + '/' + item)
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
                fs.writeFileSync(projectDir, renderFile, 'utf8',(err) => {
                    if (err) throw err;
                })
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
                this.importInject.push(plugin);
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
        
        fs.writeFileSync(path.resolve(dir[dir.length - 1],filename), content, 'utf8',(err) => {
            if (err) throw err;
        })

    }
}
module.exports = Generator;