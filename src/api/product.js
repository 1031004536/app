import request from '@/utils/request'
export function fetchList(data) {
  return request({
    url:'/product/productList',
    method:'post',
    data:data
  })
}

export function fetchSimpleList(params) {
  return request({
    url:'/product/simpleList',
    method:'get',
    params:params
  })
}

export function updateDeleteStatus(params) {
  return request({
    url:'/product/deleteProduct',
    method:'post',
    params:params
  })
}

export function updateNewStatus(params) {
  return request({
    url:'/product/update/newStatus',
    method:'post',
    params:params
  })
}

export function updateRecommendStatus(params) {
  return request({
    url:'/product/update/recommendStatus',
    method:'post',
    params:params
  })
}

export function updatePublishStatus(params) {
  return request({
    url:'/product/update/publishStatus',
    method:'post',
    params:params
  })
}

export function createProduct(data) {
  return request({
    url:'/product/addOrUpdateProduct',
    method:'post',
    data:data
  })
}

export function updateProduct(data) {
  return request({
    url:'/product/addOrUpdateProduct',
    method:'post',
    data:data
  })
}

export function getProduct(id) {
  return request({
    url:'/product/productDetail?productId='+id,
    method:'get',
  })
}

