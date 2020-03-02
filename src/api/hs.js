import request from '@/utils/request'
// 专题分类接口
export function fetchList(params) {
  return request({
    url:'/subject/list/0',
    method:'get',
    params:params
  })
}
// 添加专题分类接口
export function createhs(data) { 
    return request({
      url:'/subject/saveOrUpdate',
      method:'post',
      data:data
    })
  }
  // 获取专题分类单个信息
  export function geths(id) { 
    return request({
      url:'/subject/'+id,
      method:'get',
    })
  }
  // 编辑单个专题分类
  export function updatehs(data) { 
    return request({
      url:'/subject/saveOrUpdate',
      method:'post',
      data:data
    })
  }
  // 删除专题分类
  export function dele(id) { 
    return request({
      url:'/subject/delete/' +id,
      method:'post',
    })
  }
  // 内容发布列表接口
  export function publish(params,id) { 
    return request({
      url:'/subject/list/' + id,
      method:'get',
      params:params
    })
  }

  export function select(id) { 
    return request({
      url:'/subject/subjectSelectList/' +id,
      method:'get',
    })
  }
  // 关联商品接口
  export function relation(data) { 
    return request({
      url:'/subject/subjectProductRelation' ,
      method:'post',
      data:data
    })
  }
  // 选中商品接口
  export function checking(id) { 
    return request({
      url:'/subject/homeShowIds/' +id,
      method:'get',
    })
  }
  // 首页内容接口
  export function homeShowList(params) { 
    return request({
      url:'/subject/homeShowList',
      method:'get',
      params:params
    })
  }
  // 添加首页内容接口
  export function addHomeShowList(data) { 
    return request({
      url:'/subject/saveOrUpdateHomeShow',
      method:'post',
      data:data
    })
  }
  // 删除首页内容接口
  export function delHomeShowList(ids) { 
    return request({
      url:'/subject/deleteHomeShow?ids=' +ids,
      method:'post',
    })
  }
  // 获取单个首页内容接口
  export function getHomeShow(id){
    return request({
      url:'/subject/homeShowDetail?homeShowId=' +id,
      method:'get'
    })
  }
  // 下拉框
  export function option(){
    return request({
      url:'/option?type=1',
      method:'get'
    })
  }