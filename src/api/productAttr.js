import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/productAttribute/productAttributeList/',
    method:'get',
    params:params
  })
}

export function deleteProductAttr(id) {
  return request({
    url:'/productAttribute/deleteProductAttribute?' + id,
    method:'post',
  })
}

export function createProductAttr(data) {
  return request({
    url:'/productAttribute/addOrUpdateProductAttribute',
    method:'post',
    data:data
  })
}

export function updateProductAttr(data) {
  return request({
    url:'/productAttribute/addOrUpdateProductAttribute',
    method:'post',
    data:data
  })
}
export function getProductAttr(id) {
  return request({
    url:'/productAttribute/productAttributeDetail?productAttributeId='+id,
    method:'get'
  })
}

export function getProductAttrInfo(productCategoryId) {
  return request({
    url:'/productAttribute/attrInfo/'+productCategoryId,
    method:'get'
  })
}
