import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/orgnization',
  //   name: 'System',
  //   meta: { title: '系统设置', icon: 'guide' },
  //   children: [
  //     {
  //       path: 'orgnization',
  //       component: () => import('@/views/system/orgnization'),
  //       name: 'OrgnizationSystem',
  //       meta: { title: '机构管理', icon: 'edit' }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/system/role'),
  //       name: 'RoleSystem',
  //       meta: { title: '角色管理', icon: 'peoples' }
  //     },
  //     {
  //       path: 'user',
  //       component: () => import('@/views/system/user'),
  //       name: 'UserSystem',
  //       meta: { title: '用户管理', icon: 'user' }
  //     },
  //     {
  //       path: 'city',
  //       component: () => import('@/views/system/city'),
  //       name: 'CitySystem',
  //       meta: { title: '城市列表', icon: 'list' }
  //     },
  //     {
  //       path: 'campus',
  //       component: () => import('@/views/system/campus'),
  //       name: 'CampusSystem',
  //       meta: { title: '校区列表', icon: 'list' }
  //     },
  //     {
  //       path: 'defend',
  //       component: () => import('@/views/system/defend/index'),
  //       name: 'Defend',
  //       meta: { title: '系统维护', icon: 'password' },
  //       redirect: '/system/defend/inlinelog',
  //       children: [
  //         {
  //           path: 'inlinelog',
  //           component: () => import('@/views/system/defend/inlinelog'),
  //           name: 'InlinelogSystem',
  //           meta: { title: '在线日志', icon: 'edit' }
  //         },
  //         {
  //           path: 'load',
  //           component: () => import('@/views/system/defend/load'),
  //           name: 'LoadSystem',
  //           meta: { title: '资源负载', icon: 'edit' }
  //         },
  //         {
  //           path: 'smanager',
  //           component: () => import('@/views/system/defend/smanager'),
  //           name: 'SmanagerSystem',
  //           meta: { title: '系统管理', icon: 'edit' }
  //         },
  //         {
  //           path: 'functions',
  //           component: () => import('@/views/system/defend/functions'),
  //           name: 'FunctionsSystem',
  //           meta: { title: '功能管理', icon: 'edit' }
  //         },
  //         {
  //           path: 'ip',
  //           component: () => import('@/views/system/defend/ip'),
  //           name: 'IpSystem',
  //           meta: { title: 'ip管理', icon: 'edit' }
  //         },
  //         {
  //           path: 'permission',
  //           component: () => import('@/views/system/defend/permission'),
  //           name: 'PermissionSystem',
  //           meta: { title: '权限操作日志', icon: 'edit' }
  //         },
  //         {
  //           path: 'source',
  //           component: () => import('@/views/system/defend/source'),
  //           name: 'SourceSystem',
  //           meta: { title: '数据源', icon: 'edit' }
  //         },
  //         {
  //           path: 'logs',
  //           component: () => import('@/views/system/defend/logs'),
  //           name: 'LogsSystem',
  //           meta: { title: '系统日志', icon: 'edit' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'param',
  //       component: () => import('@/views/system/param'),
  //       name: 'CampusSystem',
  //       meta: { title: '参数管理', icon: 'list' }
  //     },
  //     {
  //       path: 'field',
  //       component: () => import('@/views/system/field'),
  //       name: 'CampusSystem',
  //       meta: { title: '字典管理', icon: 'education' }
  //     }
  //   ]
  // },
  // {
  //   path: '/wechat',
  //   component: Layout,
  //   redirect: '/wechat/message',
  //   name: 'Wechat',
  //   meta: { title: '微信管理', icon: 'wechat' },
  //   children: [
  //     {
  //       path: 'message',
  //       component: () => import('@/views/wechat/message'),
  //       name: 'MessageWechat',
  //       meta: { title: '消息管理', icon: 'message' }
  //     },
  //     {
  //       path: 'rules',
  //       component: () => import('@/views/wechat/rules'),
  //       name: 'RulesWechat',
  //       meta: { title: '规则管理', icon: 'list' }
  //     },
  //     {
  //       path: 'template',
  //       component: () => import('@/views/wechat/template'),
  //       name: 'TemplateSystem',
  //       meta: { title: '模板管理', icon: 'table' }
  //     },
  //     {
  //       path: 'user',
  //       component: () => import('@/views/wechat/user'),
  //       name: 'UserWechat',
  //       meta: { title: '用户管理', icon: 'user' }
  //     },
  //     {
  //       path: 'public',
  //       component: () => import('@/views/wechat/public'),
  //       name: 'PublicWechat',
  //       meta: { title: '公众号管理', icon: 'list' }
  //     }
  //   ]
  // },
  // {
  //   path: '/train',
  //   component: Layout,
  //   redirect: '/train/defend',
  //   name: 'Train',
  //   meta: { title: '培训管理', icon: 'education' },
  //   children: [
  //     {
  //       path: 'message',
  //       component: () => import('@/views/train/defend'),
  //       name: 'DefendTrain',
  //       meta: { title: '课程维护', icon: 'list' }
  //     },
  //     {
  //       path: 'setup',
  //       component: () => import('@/views/train/setup'),
  //       name: 'SetupTrain',
  //       meta: { title: '课程设置', icon: 'tree-table' }
  //     },
  //     {
  //       path: 'progress',
  //       component: () => import('@/views/train/progress'),
  //       name: 'ProgressTrain',
  //       meta: { title: '学习进度', icon: 'skill' }
  //     },
  //     {
  //       path: 'learn',
  //       component: () => import('@/views/train/learn'),
  //       name: 'LearnTrain',
  //       meta: { title: '学习信息', icon: 'list' }
  //     },
  //     {
  //       path: 'download',
  //       component: () => import('@/views/train/download'),
  //       name: 'DownloadTrain',
  //       meta: { title: '下载记录', icon: 'list' }
  //     }
  //   ]
  // },
  // {
  //   path: '/preparing',
  //   component: Layout,
  //   redirect: '/preparing/menu',
  //   name: 'Preparing',
  //   meta: { title: '备课管理', icon: 'education' },
  //   children: [
  //     {
  //       path: 'menu',
  //       component: () => import('@/views/preparing/menu'),
  //       name: 'MenuPreparing',
  //       meta: { title: '备课菜单设置', icon: 'list' }
  //     },
  //     {
  //       path: 'defend',
  //       component: () => import('@/views/preparing/defend'),
  //       name: 'DefendPreparing',
  //       meta: { title: '备课维护', icon: 'list' }
  //     },
  //     {
  //       path: 'filetype',
  //       component: () => import('@/views/preparing/filetype'),
  //       name: 'FiletypePreparing',
  //       meta: { title: '课件类型设置', icon: 'tree-table' }
  //     },
  //     {
  //       path: 'learn',
  //       component: () => import('@/views/preparing/learn'),
  //       name: 'LearnPreparing',
  //       meta: { title: '学习信息', icon: 'list' }
  //     },
  //     {
  //       path: 'download',
  //       component: () => import('@/views/preparing/download'),
  //       name: 'DownloadPreparing',
  //       meta: { title: '下载记录', icon: 'list' }
  //     },
  //     {
  //       path: 'feedback',
  //       component: () => import('@/views/preparing/feedback'),
  //       name: 'FeedbackPreparing',
  //       meta: { title: '反馈记录', icon: 'skill' }
  //     }
  //   ]
  // },
  {
    path: '/category',
    component: Layout,
    redirect: '/category/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/category/index'),
        name: 'Category',
        meta: { title: '栏目管理', icon: 'list', noCache: true }
      },
      {
        path: 'create',
        component: () => import('@/views/category/create'),
        name: 'CreateCategory',
        hidden: true,
        meta: { title: '创建栏目', icon: 'form', noCache: true }
      },
      {
        path: ':catid',
        component: () => import('@/views/category/edit'),
        hidden: true,
        name: 'EditCategory',
        meta: { title: '编辑栏目', icon: 'form', noCache: true }
      }
    ]
  },
  {
    path: '/module',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/module/index'),
        name: 'Module',
        meta: { title: '模型管理', icon: 'form' }
      },
      {
        path: 'create',
        component: () => import('@/views/module/create'),
        name: 'CreateModule',
        meta: { title: '创建模型', icon: 'edit' },
        hidden: true
      },
      {
        path: 'field/:moduleid',
        component: () => import('@/views/module/fieldindex'),
        name: 'FieldModule',
        meta: { title: '模型字段' },
        redirect: '',
        hidden: true,
        children: [{
          path: '',
          component: () => import('@/views/module/field'),
          name: 'IndexField',
          meta: { title: '字段列表' },
          hidden: true
        }, {
          path: 'create',
          component: () => import('@/views/module/createfield'),
          name: 'CreateField',
          meta: { title: '添加字段' },
          hidden: true
        }, {
          path: ':fieldid',
          component: () => import('@/views/module/editfield'),
          name: 'EditField',
          meta: { title: '编辑字段' },
          hidden: true
        }]
      },
      {
        path: 'edit/:moduleid',
        component: () => import('@/views/module/edit'),
        name: 'EditModule',
        meta: { title: '编辑模型', noCache: true },
        hidden: true
      }
    ]
  },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'Guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    hidden: true,
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: '图标', icon: 'icon', noCache: true }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    hidden: true,
    name: 'Example',
    meta: {
      title: 'Example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'Create Article', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true,
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    hidden: true,
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    hidden: true,
    name: 'Zip',
    meta: { title: 'Zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'Export Zip' }
      }
    ]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'PDF', icon: 'pdf' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },

  {
    path: '/clipboard',
    hidden: true,
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ]
  },

  {
    path: 'external-link',
    hidden: true,
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
console.log(router)
export default router
