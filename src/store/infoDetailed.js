const state = {
  /**
   * 刷新页面时 "" 值会被清空
   */
  id: "" || sessionStorage.getItem('infoId'),
  title: "" || sessionStorage.getItem('infoTitle')
}

const getters = {
  //这里获取到的时 session 里面存的值
  infoId: state => state.id,
  infoTitle: state => state.title
}

/**
 * 同步操作
 */
const mutations = {
  UPDATA_STATE_VALUE(state, params) {
    for (let key in params) {
      state[key] = params[key].value
      if (params[key].session) {
        sessionStorage.setItem(params[key].sessionKey, params[key].value)
      }
    }
  }


  // SET_ID(state, value) {
  //   state.id = value
  //   //h5本地存储
  //   sessionStorage.setItem("infoId",JSON.stringify(value))
  //   //刷新之后 值 会被清空
  //   console.log(state.id);
  // },
  // SET_TITLE(state,value) {
  //   state.title = value
  //   sessionStorage.setItem("infoTitle",JSON.stringify(value))
  //   console.log(state.title);
  // }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}