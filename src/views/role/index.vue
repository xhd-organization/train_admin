<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">创建角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="角色名" width="400">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑权限</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'创建角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名称">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="栏目权限">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            :default-checked-keys="select_arr"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { fetchCategoryList } from '@/api/category'
import { get_router } from '@/store/modules/permission'
import { fetchContentList } from '@/api/content'
import { updateCategoryPermission, createCategoryPermission, deleteCategoryPsermission } from '@/api/role'

const defaultRole = {
  name: '',
  description: '',
  routes: [],
  id: ''
}

export default {
  data() {
    return {
      rolesListIndex: 0,
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      catid: this.$route.meta.id, // 栏目id
      moduleid: this.$route.meta.moduleid, // 模型id
      dialogType: 'new',
      checkStrictly: false,
      select_arr: [], // 默认选中的key值数组
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      serviceRoutes: ''
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    async getRoutes() {
      const category_arr = await fetchCategoryList()
      const router_arr = get_router(0, category_arr)
      this.serviceRoutes = category_arr
      console.log(this.serviceRoutes)
      this.routes = this.generateRoutes(router_arr)
    },
    async getRoles() {
      const form = { catid: this.catid, moduleid: this.moduleid, is_all: true }
      const arr = await fetchContentList(form)
      this.rolesList = arr.items
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []
      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          id: route.id,
          title: route.title || route.meta.title
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.id)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit({ $index, row }) {
      this.rolesListIndex = $index
      // console.log(scope.row)
      this.dialogType = 'edit'
      // this.checkStrictly = true
      this.dialogVisible = true
      this.role = deepClone(row)
      const arr = []
      this.serviceRoutes.map(item => {
        if (item.meta.role.indexOf(this.role.id) > -1) {
          arr.push(item.id)
        }
      })
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(arr)
        // this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定删除这个角色?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteCategoryPsermission({ id: row.id, catid: this.catid, moduleid: this.moduleid })
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      console.log(checkedKeys)
      // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      const updateParams = Object.assign(this.role, { categoryids: checkedKeys.toString(), catid: this.catid, moduleid: this.moduleid })
      if (isEdit) {
        await updateCategoryPermission(updateParams)
        this.serviceRoutes = this.serviceRoutes.map(item => {
          const is_index = item.meta.role.indexOf(this.role.id)
          if (checkedKeys.indexOf(item.id) > -1) {
            if (is_index < 0) {
              item.meta.role.push(this.role.id)
            }
          } else {
            if (is_index > -1) {
              item.meta.role.splice(is_index, 1)
            }
          }
          return item
        })
        Object.assign(this.rolesList[this.rolesListIndex], { name: this.role.name, description: this.role.description })
        // await updateRole(this.role.key, this.role)
      } else {
        this.role.id = await createCategoryPermission(updateParams)
        this.serviceRoutes = this.serviceRoutes.map(item => {
          const is_index = item.meta.role.indexOf(this.role.id)
          if (checkedKeys.indexOf(item.id) > -1) {
            if (is_index < 0) {
              item.meta.role.push(this.role.id)
            }
          } else {
            if (is_index > -1) {
              item.meta.role.splice(is_index, 1)
            }
          }
          return item
        })
        this.rolesList.unshift(this.role)
      }

      const { description, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Nmae: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
