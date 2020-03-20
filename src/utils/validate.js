// 过滤特殊符号
export function stripscript(str) {
  var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥%_+……&*（）—|{}【】‘’；：“”。，、？]")
  var rs = "";
  for (var i = 0; i < str.length; i++) {
    rs = rs + str.substr(i, 1).replace(pattern, '');
  }
  return rs;
}
// 邮箱验证
export function validateEmail(value) {
  let reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  return !reg.test(value)? true : false;
}
// 密码验证
export function validatePass(value) {
  let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
  return !reg.test(value)? true : false;
}
// 验证码验证
export function validateCd(value) {
  let reg = /^[a-z0-9]{6}$/
  return !reg.test(value)? true : false;
}