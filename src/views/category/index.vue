<template>
  <div class="app-container category-container">
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
      添加栏目
    </el-button>
    <el-table
      v-loading="listLoading"
      :data="category_arr"
      :row-style="showRow"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
      :indent="0"
      :default-expand-all="true"
      :expand-row-keys="['id']"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="排序" prop="listorder" align="center" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.listorder" />
        </template>
      </el-table-column>
      <el-table-column label="栏目id" prop="id" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="栏目名称" width="250">
        <template slot-scope="scope">
          <span :style="tableRowPaddingStyle(scope.row)" class="catname" :class="scope.row.is_last === true ? 'last-child' : scope.row.level > 1 ? 'child' : ''">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属模型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.moduleid | formatModuleName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="is_admin" label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="addChild(scope.row)">
            添加子栏目
          </el-button>
          <el-button type="primary" size="small" @click="fieldEdit(scope.row)">
            修改
          </el-button>
          <el-button size="small" type="danger" @click="deleteBtn(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button v-if="category_arr.length > 0" class="filter-item" style="margin-left: 10px; margin-top: 15px;" type="primary" @click="handleSort">
      排序
    </el-button>
  </div>
</template>

<script>
import { fetchCategoryList, updateCategorySort, deleteCategory } from '@/api/category'
import { fetchModuleList } from '@/api/module'

import { mapGetters } from 'vuex'
let module_arr = []
fetchModuleList({ limit: 200 }).then(data => {
  module_arr = data.items
})

export default {
  name: 'Category',
  filters: {
    formatModuleName(moduleid) {
      let module_name = ''
      module_arr.map((item, index) => {
        if (item.ids === moduleid) {
          module_name = item.title || item.names
        }
      })
      return module_name
    }
  },
  data() {
    return {
      category_arr: [],
      module_arr: [],
      tableKey: 0,
      is_admin: false,
      catid: this.$route.params.catid,
      listLoading: true,
      sortable: null
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.getCategoryList()
    if (this.roles.includes('admin')) {
      this.is_admin = true
    }
  },
  methods: {
    showRow: function(row) {
      // const show = row.row.parent ? row.row.parent._expanded && row.row.parent._show : true
      // row.row._show = show
      // return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
      return 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
    },
    // 获取栏目列表
    getCategoryList() {
      fetchCategoryList().then(data => {
        if (data instanceof Array && data.length > 0) {
          this.category_arr = this.get_tree(0, data)
        }
        this.listLoading = false
        this.$nextTick(() => {
          this.expandAll()
        })
      })
    },
    get_tree(bcid, data, level = 0) {
      let category_arr = []
      const str_arr = this.getChild(bcid, data, (level || 0))
      if (str_arr.length > 0) {
        if (bcid !== 0) {
          str_arr[str_arr.length - 1]['is_last'] = true
        }
        str_arr.map((item, index) => {
          category_arr.push(item)
          const child_arr = this.get_tree(item.id, data, (item.level ? item.level : 0))
          if (child_arr.length > 0) {
            item['hasChildren'] = true
            category_arr = category_arr.concat(child_arr)
          } else {
            item['hasChildren'] = false
          }
        })
      }
      return category_arr
    },
    getChild(bcid, arr, level) {
      const arr_str = arr.filter(item => {
        if (item.parentid === bcid) {
          item['level'] = level + 1
          return true
        }
      })
      return arr_str
    },
    // 删除栏目
    deleteBtn(index, row) {
      if (row.hasChildren) {
        this.$alert('此栏目包含子栏目无法直接删除', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        this.$confirm(`确定删除${row.name || ''}栏目?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCategory({ id: row.id, moduleid: row.moduleid }).then(data => {
            this.$notify({
              title: '成功',
              message: '删除栏目成功',
              type: 'success',
              duration: 2000
            })
            if (row.parentid !== 0) {
              this.formatCategory(this.category_arr, row.id, row.parentid, index)
            }
            this.category_arr.splice(index, 1)
          })
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    // 格式化过滤栏目信息
    formatCategory(arr, current_deleteid, parentid, current_deleteindex) {
      if (arr.length > 0) {
        const str_arr = this.getChild(parentid, arr, 0)
        if (str_arr.length > 1) {
          str_arr.map((item, index) => {
            if (item.id === current_deleteid && index === str_arr.length - 1) {
              this.$set(this.category_arr[current_deleteindex - 1], 'is_last', true)
            }
          })
        } else {
          this.$set(this.category_arr[current_deleteindex - 1], 'hasChildren', false)
        }
      }
    },
    // 添加栏目
    handleCreate() {
      this.$router.push('/category/create')
    },
    // 跳转到栏目详情
    fieldEdit(row) {
      this.$router.push('/category/' + row.id)
    },
    // 添加子栏目
    addChild(row) {
      this.$router.push('/category/create?pid=' + row.id + '&moduleid=' + row.moduleid)
    },
    // 保存排序
    handleSort() {
      const sortData = this.category_arr.map(item => {
        return {
          id: item.id,
          listorder: item.listorder
        }
      })
      updateCategorySort({ sortData }).then(data => {
        this.$notify({
          title: '成功',
          message: '排序成功',
          type: 'success',
          duration: 2000
        })
        this.category_arr = data
      })
    },
    tableRowPaddingStyle(row) {
      return {
        'padding-left': `${(row.level > 1 ? (30 - row.level - 1) : 0)}px`,
        'margin-left': `${(row.level - 1) * 30}px`
      }
    },
    expandAll() {
      const els = this.$el.getElementsByClassName('el-table__expand-icon')
      for (let i = 0; i < els.length; i++) {
        els[i].click()
      }
    }
  }
}
</script>
<style lang="scss" scoped="">
  .category-container .el-input__inner{
    padding: 0;
    text-align: center;
  }
  .category-container .el-input--medium{
    width: 50px;
  }
  .category-container .el-table__row span.catname{
    position: relative;
  }
  .category-container .child:before{
    content: '├─';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .category-container .last-child:before{
    content: '└─';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    display: flex;
  }
</style>

<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
