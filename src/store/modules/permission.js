import { asyncRouterMap, constantRouterMap } from '@/router/index'
import { port } from '@/api/common'
import Layout from '@/views/layout/Layout'
const _import = file => () => import('@/views/' + file + '.vue')

/**
 * 判断用户是否拥有此菜单
 * @param menus
 * @param route
 */
function hasPermission(menus, route) {
  if (route.menu) {
    /*
    * 如果这个路由有menu属性,就需要判断用户是否拥有此menu权限
    */
    return menus.indexOf(route.menu) > -1;
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户菜单权限的路由表
 * @param asyncRouterMap
 * @param menus
 */
function filterAsyncRouter(asyncRouterMap, menus) {
  const accessedRouters = asyncRouterMap.filter(route => {
    //filter,js语法里数组的过滤筛选方法
    if (hasPermission(menus, route)) {
      if (route.children && route.children.length) {
        //如果这个路由下面还有下一级的话,就递归调用
        route.children = filterAsyncRouter(route.children, menus)
        //如果过滤一圈后,没有子元素了,这个父级菜单就也不显示了
        return (route.children && route.children.length)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap, //本用户所有的路由,包括了固定的路由和下面的addRouters
    addRouters: [] //本用户的角色赋予的新增的动态路由
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers) //将固定路由和新增路由进行合并, 成为本用户最终的全部路由信息
    }
  },
  actions: {
    GenerateRoutes({ commit }) {
      //生成路
      return new Promise(async resolve => {
        //roles是后台传过来的角色数组,比如['管理员','文章']
        //const role = userPermission.roleName;
        //const menus = userPermission.menuList;
        //const { companyId, roleId } = userPermission
        //声明 该角色可用的路由
        let accessedRouters
        await port( '/permission/menuTreeList','get').then(data => {
          let dataRouters = []
          for (let i in data) {
            if (data[i].children && data[i].children.length > 0) {
              let parentPath =  data[i].path
              dataRouters.push({
                path: '/'+parentPath,
                component: Layout,
                redirect: '/' + data[i].path + '/' + data[i].children[0].path,
                name: data[i].name,
                meta: {
                  title: data[i].title,
                  icon: data[i].icon
                },
                children: []
              })
              let index = dataRouters.length - 1
              let keep = false
              for (let k in data[i].children) {
                //判断是否是路由页面 2代表路由
                if (data[i].children[k].keepalive) {keep = true}
                else {
                  keep = false
                }
                let childPath =  data[i].children[k].path
                  dataRouters[index].children.push({
                    path:childPath,
                    name: data[i].children[k].name,
                    component: _import( parentPath + '/' + childPath),
                    meta: {
                      keepAlive: keep,
                      title: data[i].children[k].title,
                      icon: data[i].children[k].icon
                    },
                    hidden:data[i].children[k].hidden
                  })
              }

            }
          }
          // console.log(dataRouters)
          accessedRouters = dataRouters
        })
        //执行设置路由的方法
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}
export default permission
