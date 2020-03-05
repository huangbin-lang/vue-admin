import cookie from "cookie_js";

const adminToken = 'admin-token';
const usernamekey ='username';

//通过cookie 获取 token
export function getToken() {
  return cookie.get(adminToken)
}

/**
 * 第一个参数是 key
 * 第二个参数是 value
 */
//设置 cookie/token
export function setToken(token) {
  return cookie.set(adminToken, token)
}

// 删除cookie
export function removeToken(token) {
  return cookie.remove(adminToken)
}

//设置 cookie/username
export function setUsername(value) {
  return cookie.set(usernamekey, value)
}

export function getUsername() {
  return cookie.get(usernamekey)
}

export function removeUserName() {
  return cookie.remove(usernamekey)
}