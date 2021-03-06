<template>
  <div class="app-container field-container">
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
      添加字段
    </el-button>
    <el-table ref="dragTable" :key="tableKey" v-loading="listLoading" :data="field_arr" row-key="id" fit highlight-current-row style="width: 100%;">
      <el-table-column label="排序" prop="listorder" align="center" width="80">
        <template slot-scope="scope" align="center">
          <span><el-input v-model="scope.row.listorder" name="listorder" class="input-text-c" /></span>
        </template>
      </el-table-column>
      <el-table-column label="字段名" prop="name" align="center" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.field }}</span>
        </template>
      </el-table-column>
      <el-table-column label="别名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字段类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统字段" align="center">
        <template slot-scope="scope">
          <span :style="'color:' + (scope.row.issystem ? '#008000' : '#ff0000')"><i :class="scope.row.issystem ? 'el-icon-check' : 'el-icon-close'" /></span>
        </template>
      </el-table-column>
      <el-table-column label="必填" align="center">
        <template slot-scope="scope">
          <span :style="'color:' + (scope.row.required ? '#008000' : '#ff0000')"><i :class="scope.row.required ? 'el-icon-check' : 'el-icon-close'" /></span>
        </template>
      </el-table-column>
      <el-table-column v-if="is_admin" label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="fieldEdit(scope.row)">
            修改
          </el-button>
          <el-button :disabled="scope.row.issystem && (['catid', 'title', 'status', 'createtime'].indexOf(scope.row.field) > -1) ? true : false" type="primary" size="small" @click="disabledBtn(scope.row)">
            禁用
          </el-button>
          <el-button :disabled="scope.row.issystem ? true: false" size="mini" type="danger" @click="deleteBtn(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="filter-item" style="margin-left: 10px; margin-top: 15px;" type="primary" @click="handleSort">
      排序
    </el-button>
  </div>
</template>

<script>
import { fetchModuleFieldList, updateFieldSort, deleteModuleField } from '@/api/module'

import { mapGetters } from 'vuex'

import Sortable from 'sortablejs'

export default {
  name: 'FieldModule',
  data() {
    return {
      field_arr: [],
      tableKey: 0,
      is_admin: false,
      listLoading: true,
      moduleid: this.$route.params.moduleid,
      sortable: null
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.getModuleField(this.moduleid)
    if (this.roles.includes('admin')) {
      this.is_admin = true
    }
  },
  methods: {
    getModuleField(moduleid) {
      fetchModuleFieldList({ moduleid, is_field: true }).then(data => {
        this.field_arr = data
        this.listLoading = false
        this.$nextTick(() => {
          this.setSort()
        })
      })
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
    // 添加模型
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
      const sortData = this.field_arr.map(item => {
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
    // 拖拽并且进行排序
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          if (evt.oldIndex < evt.newIndex) {
            this.$set(this.field_arr[evt.oldIndex], 'listorder', evt.newIndex + 1 < this.field_arr.length ? this.field_arr[evt.newIndex + 1].listorder + 1 : this.field_arr[evt.newIndex].listorder + 1)
          } else if (evt.oldIndex > evt.newIndex) {
            this.$set(this.field_arr[evt.oldIndex], 'listorder', evt.newIndex > 0 ? this.field_arr[evt.newIndex + 1].listorder - 1 : (this.field_arr[evt.newIndex].listorder > 0 ? this.field_arr[evt.newIndex].listorder - 1 : 0))
          }
          const targetRow = this.field_arr.splice(evt.oldIndex, 1)[0]
          this.field_arr.splice(evt.newIndex, 0, targetRow)
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .field-container .el-input__inner{
    padding: 0;
    text-align: center;
  }
  .sortable-ghost{
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }
</style>

