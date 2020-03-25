import service from "@/utils/request.js";

/**
 * 列表
 */
export function GetList(data) {
  return service.request({
    method: "post",
    url: "/news/getList/",
    data
  })
}
/**
 * 新增
 */
export function AddInfo(data) {
  return service.request({
    method: "post",
    url: "/news/add/",
    data
  })
}
/**
 * 编辑
 */
export function EditInfo(data) {
  return service.request({
    method: "post",
    url: "/news/editInfo/",
    data
  })
}
/**
 * 删除
 */
export function DeleteInfo(data) {
  return service.request({
    method: "post",
    url: "/news/deleteInfo/",
    data
  })
}
/**
 * 一级分类添加
 */
export function AddfirstCategory(data) {
  return service.request({
    method: "post",
    url: "/news/addFirstCategory/",
    // data: data 简写成data
    data
  })
}
/**
 * 子级分类添加
 */
export function AddChildrenCategory(data) {
  return service.request({
    method: "post",
    url: "/news/addChildrenCategory/",
    // data: data 简写成data
    data
  })
}
/**
 * 获取分类
 */
export function GetCategory(data) {
  return service.request({
    method: "post",
    url: "/news/getCategory/",
    data
  })
}
/**
 * 获取全部的分类(包含子级)
 */
export function GetCategoryAll(data) {
  return service.request({
    method: "post",
    url: "/news/getCategoryAll/",
    data
  })
}
/**
 * 删除分类
 */
export function DeleteCategory(data) {
  return service.request({
    method: "post",
    url: "/news/deleteCategory/",
    data
  })
}
/**
 * 修改分类
 */
export function EditCategory(data) {
  return service.request({
    method: "post",
    url: "/news/editCategory/",
    data
  })
}