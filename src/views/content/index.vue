<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" class="filter-container form-container">
      <div v-for="field in select_arr" :key="field.id" class="select-item">
        <el-input v-if="field.type === 'title' || field.type === 'text' || field.type === 'catid' || field.type === 'varchar'" v-model="postForm[field.field]" :placeholder="field.name" style="width: 200px;" class="filter-item" @keyup.enter.native="selectBtn" />
        <el-select v-if="field.type === 'radio' || field.type === 'checkbox'" v-model="postForm[field.field]" :placeholder="field.name" clearable style="width: 90px" class="filter-item">
          <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-date-picker v-if="field.type === 'datetime'" v-model="postForm[field.field]" type="datetime" format="yyyy-MM-dd HH:mm:ss" :placeholder="field.name" />
      </div>
      <el-button v-if="select_arr.length > 0" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="selectBtn">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </el-form>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column v-for="field in display_arr" :key="field.id" :label="field.name" :prop="field.field" align="center">
        <template slot-scope="scope">
          <span v-if="field.type === 'radio' || field.type === 'checkbox'">{{ scope.row[field.field] | formatFieldName(field.setup) }}</span>
          <span v-else>{{ scope.row[field.field] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteBtn(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchContentList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchContentList } from '@/api/content'
import { fetchModuleFieldList } from '@/api/module'

import waves from '@/directive/waves' // waves directive

import { parseTime } from '@/utils'
import excel from '@/vendor/Export2Excel'

import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

export default {
  name: 'Content',
  components: { Pagination },
  directives: { waves },
  filters: {
    // 格式化字段值进行显示
    formatFieldName(value, setupOptions) {
      if (setupOptions) {
        const setup = JSON.parse(setupOptions)
        const value_arr = setup['options'].split(',')
        if (value_arr && value_arr instanceof Array && value_arr.length > 0) {
          value_arr.map(item => {
            if (Number(item.split('|')[1]) === value) {
              value = item.split('|')[0]
            }
          })
        }
      }
      return value
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [], // 列表数据
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      id: this.$route.meta.id, // 栏目id
      moduleid: this.$route.meta.moduleid, // 模型id
      display_field: this.$route.meta.listfields ? this.$route.meta.listfields : this.$route.meta.listfields.split(','), // 需要显示的字段
      display_arr: [], // 显示字段
      field_arr: [], // 字段列表
      select_field: this.$route.meta.selectfields ? this.$route.meta.selectfields.split(',') : [], // 需要查询的字段
      select_arr: [], // 查询列表
      postForm: {}, // 查询表单数据
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    console.log(this.select_arr)
    this.fetchContentList()
    this.fetchModuleFieldList(this.moduleid)
  },
  methods: {
    // 获取内容信息列表
    fetchContentList(info) {
      let form = { id: this.id, moduleid: this.moduleid }
      if (info) {
        form = Object.assign({}, form, info)
      }
      fetchContentList(form).then(data => {
        this.list = data.items
        this.total = data.total
        this.listLoading = false
      })
    },
    // 删除信息
    deleteBtn() {
    },
    // 获取模型字段列表并进行字段显示和查询处理
    fetchModuleFieldList(moduleid) {
      fetchModuleFieldList({ moduleid }).then(data => {
        if (data && data instanceof Array && data.length > 0) {
          this.field_arr = data
          data.map(item => {
            if (this.display_field.indexOf(item.field) > -1) {
              this.display_arr.push(item)
            }
            if (this.select_field.indexOf(item.field) > -1) {
              this.select_arr.push(item)
            }
          })
        }
      })
    },
    selectBtn() {
      console.log(this.postForm)
      this.listQuery.page = 1
      this.fetchContentList(this.postForm)
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.selectBtn()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      excel.then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>
<style scoped="">
  .filter-container{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .filter-container > .select-item{ padding: 0 3px; }
</style>
