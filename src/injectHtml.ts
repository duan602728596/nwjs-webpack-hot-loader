/**
 * 将js代码注入到html中
 * @param { string } source      : 源文本
 * @param { string } uploadScript: 脚本
 * @param { Object } query       : 配置
 */

type option = {
  buildFile: string,
  rootFile: string,
  type: string
}

function injectHtml(source: string, uploadScript: string, query: option): string{
  // 注入的字符串
  const str = `<script>${ uploadScript }</script>`
            + '<script>'
            + 'window.addEventListener(\'load\', function __hot_update_load__(event){'
            + `var __update__ = new __NwWebpackHotUpdate__('${ query.buildFile }', '${ query.rootFile }');`
            + '__update__.init(); }, false);'
            + '</script>'
            + '</head>';
  const html: string = source.replace(/<\/head>/i, str);
  return html;
}

export default injectHtml;