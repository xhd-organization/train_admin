import { asyncRoutes, constantRoutes } from '@/router'
import { fetchCategoryList } from '@/api/category'
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

// 首字母大写
function titleCase5(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

// 获取栏目并格式化成路由形式
function get_router(bcid, data, level = 0) {
  const arr = data.filter((item, index) => {
    const str_arr = get_child_router(item.id, data, (item.level ? item.level : 0))
    if (str_arr.length > 0) {
      item['children'] = str_arr
      item['children'][str_arr.length - 1]['is_last'] = true
      item['hasChildren'] = true
      str_arr.map((subitem, idx) => {
        item['children'][idx]['meta'] = {
          title: subitem.name,
          icon: subitem.icon || 'list',
          moduleid: subitem.moduleid,
          id: subitem.id,
          pagesize: subitem.pagesize,
          listfields: subitem.listfields,
          selectfields: subitem.selectfields
        }
        item['children'][idx]['component'] = () => import('@/views/content/index')
        item['children'][idx]['name'] = titleCase5(subitem.path) + titleCase5(item.path)
      })
    } else {
      item['hasChildren'] = false
    }
    if (item.parentid === bcid) {
      item['meta'] = {
        title: item.name,
        icon: item.icon || 'list',
        moduleid: item.moduleid,
        id: item.id,
        pagesize: item.pagesize,
        listfields: item.listfields,
        selectfields: item.selectfields
      }
      item['component'] = Layout
      if (item.hasChildren) {
        item['redirect'] = `/${item.path}/${item.children[0].path}`
        item['name'] = titleCase5(item.path)
      } else {
        item['children'] = [{
          path: 'index',
          component: () => import('@/views/content/index'),
          name: titleCase5(item.path),
          meta: {
            title: item.name,
            icon: item.icon || 'list',
            moduleid: item.moduleid,
            id: item.id,
            pagesize: item.pagesize,
            listfields: item.listfields,
            selectfields: item.selectfields
          }
        }]
      }
      item['path'] = '/' + item.path
      return true
    }
  })
  return arr
}

function get_child_router(bcid, arr, level) {
  const arr_str = arr.filter(item => {
    if (item.parentid === bcid) {
      item['level'] = level + 1
      return true
    }
  })
  return arr_str
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  async generateRoutes({ commit }, roles) {
    const router_role = await fetchCategoryList()
    const router_arr = get_router(0, router_role)
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = router_arr.concat(asyncRoutes) || []
      } else {
        accessedRoutes = filterAsyncRoutes(router_arr.concat(asyncRoutes), roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
