import { Login } from "@/api/login.js";
import { setToken, setUsername, getUsername, removeUserName, removeToken } from "@/utils/app.js"
/**
 * vuex状态管理
 */
const state = {
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
  to_ken: '',
  username: getUsername() || ''
}

const getters = {
  isCollapse: state => state.isCollapse
}

// 监听值的变化
const mutations = {
  SET_ISCOLLAPSE(state) {
    state.isCollapse = !state.isCollapse
    sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse))
  },
  SET_TOKEN(state, value) {
    state.to_ken = value
  },
  SET_USETNAME(state, value) {
    state.username = value
  }
}

const actions = {
  loGin({ commit }, data) {
    return new Promise((resolve, reject) => {
      Login(data).then(response => {
        // response 是 后台 发送过来的东西
        const data = response.data.data
        // 普通的
        // content.commit('SET_TOKEN', data.token)
        // content.commit('SET_USETNAME', data.username)
        // 解构的
        //h5本地存储
        commit('SET_TOKEN', data.token)
        commit('SET_USETNAME', data.username)

        //设置保存token和username
        setToken(data.token)
        setUsername(data.username)

        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  exit({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "")
      commit("SET_USERNAME", "")
      removeUserName()
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
// export default app;