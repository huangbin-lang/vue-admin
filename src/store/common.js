import { GetCategory, GetCategoryAll } from "@/api/news.js";
const state = {
  qiniuUrl: "http://q7owrc25z.bkt.clouddn.com/"
}
const getters = {
  qiniuUrl: state => state.qiniuUrl
}
/**
 * vuex
 */
const actions = {
  //获取分类
  getInfoCategory(content, requestData) {
    return new Promise((resolve, reject) => {
      GetCategory({}).then((response) => {
        resolve(response.data.data.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  //获取全部分类
  getCategoryAll(content, requestData) {
    return new Promise((resolve, reject) => {
      GetCategoryAll({}).then(response => {
        resolve(response.data.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
};