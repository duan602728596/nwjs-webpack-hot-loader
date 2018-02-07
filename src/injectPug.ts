/**
 * 将js代码注入到pug中
 * @param { string } source      : 源文本
 * @param { string } uploadScript: 脚本
 * @param { Object } query       : 配置
 */

type option = {
  buildFile: string,
  rootFile: string,
  type: string
}

/* 返回指定数量的缩进 */
function indent(char: string, len: number): string{
  let s: string = '';
  for(let i: number = 0; i < len; i++){
    s += char;
  }
  return s;
}

/* 获取空格规则 */
function getSpaceNumber(source: string): string{
  // 解析body标签的格式
  const formatArray: Array<string> = source.match(/(\s)+body/)[0].split(/(\s)/);
  // 特殊字符
  const CHARACTER: Array<string> = ['', '\n', '\r', 'body', 'head'];
  // 删除特殊字符，剩下的就是缩进符和缩进规则
  for(let i: number = formatArray.length - 1; i >= 0; i--){
    if(CHARACTER.indexOf(formatArray[i]) > -1){
      formatArray.splice(i, 1);
    }
  }
  return formatArray.join('');
}

/* 缩进script */
function formatScript(uploadScript, char: string): string{
  let s: string = '';
  const idt: string = indent(char, 3);
  const st: Array<string> = uploadScript.split('\n');
  for(let i: number = 0, j: number = st.length; i < j; i++){
    s += `${ idt }${ st[i] }\n`;
  }
  return s;
}

function injectPug(source: string, uploadScript: string, query: option): string{
  const sp: string = getSpaceNumber(source);
  const str: string = `\n${ indent(sp, 2) }script.\n`
                    + `${ formatScript(uploadScript, sp) }\n`
                    + `\n${ indent(sp, 2) }script `
                    + 'window.addEventListener(\'load\', function __hot_update_load__(event){'
                    + `var __update__ = new __NwWebpackHotUpdate__('${ query.buildFile }', '${ query.rootFile }');`
                    + '__update__.init(); }, false);\n'
                    + `${ indent(sp, 1) }body`;
  const pug: string = source.replace(/\s+body/, str);
  return pug;
}

export default injectPug;