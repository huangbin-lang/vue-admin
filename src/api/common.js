import service from "@/utils/request.js";
/**
 * vue3.0
 */
import { GetCategory, GetCategoryAll } from "@/api/news.js";
import { reactive } from "@vue/composition-api";
export function common() {
  const categoryItem = reactive({
    item: []
  })
  //获取分类
  const getInfoCtegory = () => {
    GetCategory({}).then((response) => {
      categoryItem.item = response.data.data.data
    }).catch((error) => { })
  }
  //获取全部分类
  const getCategoryAll = () => {
    GetCategoryAll({}).then(response => {
      categoryItem.item = response.data.data
    }).catch(error => {

    })
  }
  return { getInfoCtegory, getCategoryAll, categoryItem }
}

export function QiniuToken(data) {
  return service.request({
    method: "post",
    url: "/uploadImgToken/",
    data
  })
}