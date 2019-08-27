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
          <el-input v-model="scope.row.listorder" :style="(!scope.row.level && scope.row.hasChildren === false ? 'margin-left: 20px;' : '')" />
        </template>
      </el-table-column>
      <el-table-column label="catid" prop="id" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="栏目名称" align="center">
        <template slot-scope="scope">
          <span :style="tableRowPaddingStyle(scope.row)" :class="scope.row.is_last === true ? 'last-child' : scope.row.level > 0 ? 'child' : ''">{{ scope.row.catname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属模型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.module }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="is_admin" label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="fieldEdit(scope.row)">
            添加子栏目
          </el-button>
          <el-button type="primary" size="mini" @click="fieldEdit(scope.row)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="deleteBtn(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchCategoryList, updateFieldSort, deleteModuleField } from '@/api/category'

import { mapGetters } from 'vuex'

export default {
  name: 'FieldModule',
  data() {
    return {
      category_arr: [],
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
    getCategoryList() {
      fetchCategoryList().then(data => {
        if (data instanceof Array && data.length > 0) {
          this.category_arr = this.get_tree(0, data)
        }
        console.log(this.category_arr)
        this.listLoading = false
        this.$nextTick(() => {
          this.expandAll()
        })
      })
    },
    get_tree(bcid, data, level = 0) {
      const arr = data.filter((item, index) => {
        const str_arr = this.getChild(item.id, data, (item.level ? item.level : 0))
        if (str_arr.length > 0) {
          item['children'] = str_arr
          item['children'][str_arr.length - 1]['is_last'] = true
          item['hasChildren'] = true
        } else {
          item['hasChildren'] = false
        }
        if (item.parentid === bcid) {
          return true
        }
      })
      return arr
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
    // 禁用
    disabledBtn() {
      console.log('禁用')
    },
    // 删除字段
    deleteBtn(index, row) {
      this.$confirm(`确定删除${row.name || ''}栏目?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteModuleField({ id: row.id, field: row.field, moduleid: row.moduleid }).then(data => {
          this.$notify({
            title: '成功',
            message: '删除字段成功',
            type: 'success',
            duration: 2000
          })
          this.field_arr.splice(index, 1)
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    // 添加栏目
    handleCreate() {
      this.$router.push('/category/create')
    },
    // 跳转到栏目详情
    fieldEdit(row) {
      console.log(row)
      this.$router.push('/category/' + row.id)
    },
    // 保存排序
    handleSort() {
      const sortData = this.category_arr.map(item => {
        return {
          id: item.id,
          listorder: item.listorder
        }
      })
      updateFieldSort({ sortData, moduleid: this.moduleid }).then(data => {
        this.$notify({
          title: '成功',
          message: '排序成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    tableRowPaddingStyle(row) {
      return {
        'padding-left': `${(row.level ? 30 : 0)}px`,
        'margin-left': `${row.level * 50}px`
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
  .category-container .el-table__row .el-table_1_column_3 span{
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
