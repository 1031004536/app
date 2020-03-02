import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/sku/getSkuList',
    method:'get',
    params:params
  })
}

export function update(data) {
  return request({
    url:'/sku/updateSku',
    method:'post',
    data:data
  })
}
