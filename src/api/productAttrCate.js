import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/productAttribute/productAttributeCategoryList',
    method:'get',
    params:params
  })
}

export function createProductAttrCate(data) {
  return request({
    url:'/productAttribute/addOrUpdateProductAttributeCategory',
    method:'post',
    data:data
  })
}

export function deleteProductAttrCate(id) {
  return request({
    url:'/productAttribute/deleteProductAttributeCategory?ids='+id,
    method:'post'
  })
}

export function updateProductAttrCate(data) {
  return request({
    url:'/productAttribute/addOrUpdateProductAttributeCategory',
    method:'post',
    data:data
  })
}
export function fetchListWithAttr() {
  return request({
    url:'/productAttribute/category/list/withAttr',
    method:'get'
  })
}
