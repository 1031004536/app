import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/homeAdvertise/advertiseList',
    method:'get',
    params:params
  })
}
export function updateStatus(id,params) {
  return request({
    url:'/advertise/update/status/'+id,
    method:'post',
    params:params
  })
}
export function deleteHomeAdvertise(data) {
  return request({
    url:'/homeAdvertise/deleteAdvertise',
    method:'post',
    data:data
  })
}
export function createHomeAdvertise(data) {
  return request({
    url:'/homeAdvertise/addOrUpdateAdvertise',
    method:'post',
    data:data
  })
}
export function getHomeAdvertise(id) {
  return request({
    url:'/homeAdvertise/advertiseDetail/'+id,
    method:'get',
  })
}

export function updateHomeAdvertise(id,data) {
  return request({
    url:'/advertise/update/'+id,
    method:'post',
    data:data
  })
}
export function option() {
  return request({
    url:'/option?type=2',
    method:'get',
  })
}
export function optionA() {
  return request({
    url:'/option?type=1',
    method:'get',
  })
}
