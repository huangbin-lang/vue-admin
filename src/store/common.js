import { GetCategory, GetCategoryAll } from "@/api/news.js";

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
  actions
};