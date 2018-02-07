/**
 * webpack在nwjs下的热更新功能
 *
 * @param { string } buildFile: webpack编译后的文件地址。注意！要用相对地址，相对于作为入口的.html文件
 * @param { string } rootFile : webpack入口文件，文件名
 */

class __NwWebpackHotUpdate__{
  private fs: {
    watch: Function
  };
  private path: {
    parse: Function
  };
  private body: Element;
  private scripts: NodeListOf<HTMLScriptElement>;
  watchFile: string;
  buildFile: string;
  rootFile: string;
  buildName: RegExp;

  constructor(buildFile: string, rootFile: string){
    this.fs = require('fs');
    this.path = require('path');

    this.body = document.getElementsByTagName('body')[0];
    this.scripts = document.getElementsByTagName('script');

    // watch监视的文件夹
    this.watchFile = /\/$/.test(buildFile) ? buildFile : (buildFile + '/');

    // webpack编译后的文件夹，可能的是类似于"/xx"或"./xx"
    // 判断末尾是否有"/"，如果没有"/"的话，会给地址添加"/"
    this.buildFile = this.watchFile.match(/[^/.]+\/?$/)[0];

    // webpack入口文件，文件名
    // 如果文件不带.js扩展名，则自动添加扩展名
    this.rootFile =  /\.js$/.test(rootFile) ? rootFile : (rootFile + '.js');

    // 获取webpack编译目录的名字
    this.buildName = new RegExp('^(\\.\\/)?' + buildFile.match(/[^/\\.]+/)[0]);
  }

  /* 更新 */
  update(eventType: string, filename: string): void{
    // 获取变更文件，并且截取到时间戳之前
    const changeFileName: string = filename.split('?')[0];

    // 判断是否是js文件
    const fileQuery: {
      ext: string,
      base: string
    } = this.path.parse(changeFileName);

    if(fileQuery.ext !== '.js'){
      return void 0;
    }

    // 有文件变化但是script标签内没有文件
    if((this.rootFile && fileQuery.base !== this.rootFile) || (eventType === 'rename')){
      let _hasOne: boolean = false;     // 判断只执行一次app.js

      const newScript: HTMLScriptElement = document.createElement('script');
      this.body.appendChild(newScript);
      newScript.setAttribute('src', `${ this.rootFile }?t=${ new Date().getTime() }`);
      newScript.setAttribute('data-file', this.rootFile);

      // 清理旧的js标签
      const rootFile: string = this.buildName.test(this.rootFile) ? this.rootFile : `${ this.buildFile }${ this.rootFile }`;
      for(let i: number = this.scripts.length - 1; i >= 0; i--){
        // 获取src标签的地址，并且截取到时间戳之前。使用getAttribute是因为：使用.src会获取到完整的基于浏览器地址的路径
        const src: string = this.scripts[i].getAttribute('src').split('?')[0];
        // 如果scripts的src是以webpack的编译目录开头，即html文件在build文件夹内，需要加目录，否则不加目录
        const srcFile: string = this.buildName.test(src) ? src : (this.buildFile + src);
        // 判断相对路径是否一致
        if(srcFile === rootFile || ('./' + srcFile) === rootFile){
          if(_hasOne){
            this.body.removeChild(this.scripts[i]);
          }else{
            _hasOne = true;
          }
        }
      }
    }

    // 文件变化
    if(eventType === 'change'){
      const cFile: string = this.buildFile + changeFileName;  // 改变文件的相对路径
      let _isUpdate: boolean = false;                         // 是否更新

      for(let i: number = this.scripts.length - 1; i >= 0; i--){
        // 获取src标签的地址，并且截取到时间戳之前。使用getAttribute是因为：使用.src会获取到完整的基于浏览器地址的路径
        const src: string = this.scripts[i].getAttribute('src').split('?')[0];

        // 如果scripts的src是以webpack的编译目录开头，即html文件在build文件夹内，需要加目录，否则不加目录
        const srcFile: string = this.buildName.test(src) ? src : (this.buildFile + src);

        // 判断相对路径是否一致
        if(srcFile === cFile || ('./' + srcFile) === cFile){
          if(_isUpdate === false){
            // 创建script标签并添加属性
            const newScript: HTMLScriptElement = document.createElement('script');
            this.body.appendChild(newScript);
            newScript.setAttribute('src', `${ src }?t=${ new Date().getTime() }`);
            newScript.setAttribute('data-file', cFile);
            // 将更新标志设置为true
            _isUpdate = true;
          }else{
            // 清理、删除旧的js标签
            this.body.removeChild(this.scripts[i]);
          }
        }
      }
    }
  }

  /* 初始化 */
  init(): void{
    this.fs.watch(this.watchFile, {
      recursive: true
    }, this.update.bind(this));
  }
}