import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/admin/adminList',
    method:'get',
    params:params
  })
}
export function authorityList(params) {
  return request({
    url:'/role/roleList',
    method:'get',
    params:params
  })
}
export function createuser(data) {
  return request({
    url:'/admin/register',
    method:'post',
    data:data
  })
}
export function deleteuser(id) {
  return request({
    url:'/admin/delete/'+id,
    method:'post',
  })
}

export function getuser(params,id) {
  return request({
    url:'/admin/'+id,
    method:'get',
    params:params
  })
}

export function updateuser(id,data) {
  return request({
    url:'/admin/update/'+id,
    method:'post',
    data:data
  })
}
export function createrole(data) {
  return request({
    url:'/role/addOrUpdateRole',
    method:'post',
    data:data
  })
}
export function deleterole(id) {
  return request({
    url:'/role/deleteRole?ids='+id,
    method:'post',
  })
}
export function treeList() {
  return request({
    url:'/permission/treeList',
    method:'get',
  })
}
export function updateAuthority(id,data) {
  return request({
    url:'/role/permission/update/' +id,
    method:'post',
    data:data
  })
}