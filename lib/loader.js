"use strict";
/**
 * webpack在nwjs下的热更新功能
 * loader用于直接在html或pug中注入代码
 */
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var loaderUtils = require("loader-utils");
var injectPug_1 = require("./injectPug");
var injectHtml_1 = require("./injectHtml");
module.exports = function (source, inputSourceMap) {
    var callback = this.async();
    // 默认配置
    var defaultOption = {
        buildFile: './build',
        rootFile: 'app.js',
        type: 'html' // 文件类型，html或jade/pug
    };
    // 合并配置
    var query = Object.assign(defaultOption, loaderUtils.getOptions(this));
    // 读取文件，注入html中
    fs.readFile(path.join(__dirname, 'hot-update.js'), function (err, data) {
        if (err) {
            throw new Error(err);
        }
        var uploadScript = data.toString();
        var newSource = (query.type === 'pug' || query.type === 'jade') ? injectPug_1.default(source, uploadScript, query) : injectHtml_1.default(source, uploadScript, query);
        callback(null, newSource, inputSourceMap);
    });
};
