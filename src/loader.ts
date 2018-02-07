/**
 * webpack在nwjs下的热更新功能
 * loader用于直接在html或pug中注入代码
 */

import path = require('path');
import fs = require('fs');
import loaderUtils = require('loader-utils');
import injectPug from './injectPug';
import injectHtml from './injectHtml';

declare var Object: {
  assign: Function
};

module.exports = function(source: string, inputSourceMap: any): void{
  const callback: Function = this.async();

  type option = {
    buildFile: string,
    rootFile: string,
    type: string
  }
  // 默认配置
  const defaultOption: option = {
    buildFile: './build',   // webpack的默认编译完成文件目录
    rootFile: 'app.js',     // webpack主文件入口
    type: 'html'            // 文件类型，html或jade/pug
  };

  // 合并配置
  const query: option = Object.assign(defaultOption, loaderUtils.getOptions(this));

  // 读取文件，注入html中
  fs.readFile(path.join(__dirname, 'hot-update.js'), (err: any, data: Buffer): void=>{
    if(err){
      throw new Error(err);
    }

    const uploadScript: string = data.toString();
    const newSource: string = (query.type === 'pug' || query.type === 'jade')
        ? injectPug(source, uploadScript, query) : injectHtml(source, uploadScript, query);

    callback(null, newSource, inputSourceMap);
  });
};