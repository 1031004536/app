import request from '@/utils/request'
export function fetchList(params) {  //企业列表
  return request({
    url:'/company/list',
    method:'get',
    params:params
  })
}
export function createCompany(data) { //增加企业
  return request({
    url:'/company/update',
    method:'post',
    data:data
  })
}
export function updateShowStatus(data) {
    return request({
      url:'/company/update/showStatus',
      method:'post',
      data:data
    })
  }
export function deleteCompany(id) {  //解除经销商
  return request({
    url:'/company/removeCompany/'+id,
    method:'post',
  })
}
export function distributor(params) { //经销商信息列表
  return request({
    url:'/company/agentList',
    method:'get',
    params:params
  })
}

export function getCompany(params,id) { //获取单个列表信息
  return request({
    url:'/table/' + id,
    method:'get',
    params:params
  })
}
export function relateCompany(data) { //绑定经销商
    return request({
      url:'/company/relateCompany',
      method:'post',
      data:data
    })
  }
export function updateCompany(data) { //更改信息
  return request({
    url:'/company/update/',
    method:'post',
    data:data
  })
}

