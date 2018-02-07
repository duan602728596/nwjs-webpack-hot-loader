"use strict";
/**
 * 将js代码注入到html中
 * @param { string } source      : 源文本
 * @param { string } uploadScript: 脚本
 * @param { Object } query       : 配置
 */
Object.defineProperty(exports, "__esModule", { value: true });
function injectHtml(source, uploadScript, query) {
    // 注入的字符串
    var str = "<script>" + uploadScript + "</script>"
        + '<script>'
        + 'window.addEventListener(\'load\', function __hot_update_load__(event){'
        + ("var __update__ = new __NwWebpackHotUpdate__('" + query.buildFile + "', '" + query.rootFile + "');")
        + '__update__.init(); }, false);'
        + '</script>'
        + '</head>';
    var html = source.replace(/<\/head>/i, str);
    return html;
}
exports.default = injectHtml;
