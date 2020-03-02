import request from '@/utils/request'
export function fetchList() {
  return request({
    url:'/permission/permissionTreeList',
    method:'get',
  })
}
export function portParam(url,param,method) {
    return request({
      url: url,
      method:method,
      data:param
    })
  }
  export function port(url,method) {
    return request({
      url: url,
      method:method,
    })
  }