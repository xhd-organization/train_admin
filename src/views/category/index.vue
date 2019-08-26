<template>
  <div class="app-container category-container">
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
      添加栏目
    </el-button>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
      :default-expand-all="true"
      :expand-row-keys="['id']"
      :indent="20"
      :data="category_arr"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="排序" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <el-input v-model="scope.row.listorder" />
        </template>
      </el-table-column>
      <el-table-column label="catid" prop="id" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="栏目名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.catname }}</span>
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
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
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
    getCategoryList() {
      fetchCategoryList().then(data => {
        if (data instanceof Array && data.length > 0) {
          this.category_arr = this.get_tree(0, data)
          console.log(this.category_arr)
        }
        this.listLoading = false
      })
    },
    get_tree(bcid, data) {
      const arr = data.filter((item, index) => {
        const str_arr = this.getChild(item.id, data)
        if (str_arr.length > 0) {
          item['children'] = this.getChild(item.id, data)
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
    getChild(bcid, arr) {
      const arr_str = arr.filter(item => {
        if (item.parentid === bcid) {
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
      this.$confirm(`确定删除${row.name || ''}字段?`, '提示', {
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
      this.$router.push('/module/field/' + this.moduleid + '/create')
    },
    // 跳转到模型字段管理
    fieldEdit(row) {
      console.log(row)
      this.$router.push('/module/field/' + this.moduleid + '/' + row.id)
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
    }
  }
}
</script>
<style lang="scss">
  .category-container .el-input__inner{
    padding: 0;
    text-align: center;
  }
</style>
