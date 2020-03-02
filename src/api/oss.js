import request from '@/utils/request'
export function policy() {
  return request({
    url:'/common/uploadImages',
    method:'post',
  })
}
