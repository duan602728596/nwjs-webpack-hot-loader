"use strict";
/**
 * 将js代码注入到pug中
 * @param { string } source      : 源文本
 * @param { string } uploadScript: 脚本
 * @param { Object } query       : 配置
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* 返回指定数量的缩进 */
function indent(char, len) {
    var s = '';
    for (var i = 0; i < len; i++) {
        s += char;
    }
    return s;
}
/* 获取空格规则 */
function getSpaceNumber(source) {
    // 解析body标签的格式
    var formatArray = source.match(/(\s)+body/)[0].split(/(\s)/);
    // 特殊字符
    var CHARACTER = ['', '\n', '\r', 'body', 'head'];
    // 删除特殊字符，剩下的就是缩进符和缩进规则
    for (var i = formatArray.length - 1; i >= 0; i--) {
        if (CHARACTER.indexOf(formatArray[i]) > -1) {
            formatArray.splice(i, 1);
        }
    }
    return formatArray.join('');
}
/* 缩进script */
function formatScript(uploadScript, char) {
    var s = '';
    var idt = indent(char, 3);
    var st = uploadScript.split('\n');
    for (var i = 0, j = st.length; i < j; i++) {
        s += "" + idt + st[i] + "\n";
    }
    return s;
}
function injectPug(source, uploadScript, query) {
    var sp = getSpaceNumber(source);
    var str = "\n" + indent(sp, 2) + "script.\n"
        + (formatScript(uploadScript, sp) + "\n")
        + ("\n" + indent(sp, 2) + "script ")
        + 'window.addEventListener(\'load\', function __hot_update_load__(event){'
        + ("var __update__ = new __NwWebpackHotUpdate__('" + query.buildFile + "', '" + query.rootFile + "');")
        + '__update__.init(); }, false);\n'
        + (indent(sp, 1) + "body");
    var pug = source.replace(/\s+body/, str);
    return pug;
}
exports.default = injectPug;
