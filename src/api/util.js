import request from '@/utils/request'
export function post(url,data) { // post 方法
    return request({
        url:url,
        method:'post',
        data:data
    })
}
export function get(url,param) { // get 方法
    return request({
        url:url,
        method:'get',
        params:param
    })
}
export function del(url,id) {  // 删除方法
    return request({
        url:url+"?ids="+id,
        method:'post',
    })
}
