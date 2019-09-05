<template>
  <div class="app-container">
    <el-form v-if="!is_tree" ref="postForm" :model="postForm" class="filter-container form-container">
      <div v-for="field in select_arr" :key="field.id" class="select-item">
        <el-input v-if="field.type === 'title' || field.type === 'text' || field.type === 'catid' || field.type === 'varchar'" v-model="postForm[field.field]" :placeholder="field.name" style="width: 200px;" class="filter-item" @keyup.enter.native="selectBtn" />
        <el-select v-if="field.type === 'radio' || field.type === 'checkbox' || field.type === 'select'" v-model="postForm[field.field]" :placeholder="field.name" clearable class="filter-item">
          <el-option v-for="item in filterSelectOptions(field.setup)" :key="item.key" :label="item.name" :value="item.value" />
        </el-select>
        <el-date-picker v-if="field.type === 'datetime'" v-model="postForm[field.field]" type="datetime" format="yyyy-MM-dd HH:mm:ss" :placeholder="field.name" />
      </div>
      <el-button v-if="select_arr.length > 0 && !is_tree" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="selectBtn">
        查询
      </el-button>
      <el-button v-if="!is_tree" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-if="!is_tree" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
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
          <span v-if="field.type === 'radio' || field.type === 'checkbox' || field.type === 'select'">{{ scope.row[field.field] | formatFieldName(field.setup) }}</span>
          <span v-else>{{ scope.row[field.field] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="is_tree" type="primary" size="small" @click="handleUpdate(scope.row)">添加子项</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="deleteBtn(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0 && !is_tree" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchContentList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item v-for="field in field_arr" :key="field.id" :label="field.name" :prop="field.field" :required="field.required ===1">
          <el-input v-if="field.type === 'title' || field.type === 'text' || field.type === 'catid' || field.type === 'varchar'" v-model="temp[field.field]" :placeholder="field.name" />
          <el-select v-if="field.type === 'radio' || field.type === 'checkbox' || field.type === 'groupid' || field.type === 'select'" v-model="temp[field.field]" :placeholder="field.name" class="filter-item">
            <el-option v-for="item in filterSelectOptions(field.setup)" :key="item.key" :label="item.name" :value="item.value" />
          </el-select>
          <el-date-picker v-if="field.type === 'datetime'" v-model="temp[field.field]" type="datetime" format="yyyy-MM-dd HH:mm:ss" :placeholder="field.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">{{ dialogStatus === 'create' ? '提交' : '保存' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchContentList, createContent, updateContent, deleteContent } from '@/api/content'
import { fetchModuleFieldList } from '@/api/module'

import waves from '@/directive/waves' // waves directive

import { parseTime } from '@/utils'
import { validateMessages, valideRules } from '@/utils/validate'
const jsonToExcel = import('@/vendor/Export2Excel')

import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Content',
  components: { Pagination },
  directives: { waves },
  filters: {
    // 格式化字段值进行显示
    formatFieldName(value, setupOptions) {
      if (setupOptions) {
        const setup = JSON.parse(setupOptions)
        const value_arr = setup['options'].indexOf(',') > -1 ? setup['options'].split(',') : setup['options'].split('\n')
        if (value_arr && value_arr instanceof Array && value_arr.length > 0) {
          value_arr.map(item => {
            if (Number(item.split('|')[1]) === Number(value)) {
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
        limit: 20
      },
      catid: this.$route.meta.id, // 栏目id
      is_tree: this.$route.meta.is_tree, // 是否为树形结构
      moduleid: this.$route.meta.moduleid, // 模型id
      display_field: this.$route.meta.listfields ? this.$route.meta.listfields.split(',') : [], // 需要显示的字段
      display_arr: [], // 显示字段
      field_arr: [], // 字段列表
      select_field: this.$route.meta.selectfields ? this.$route.meta.selectfields.split(',') : [], // 需要查询的字段
      select_arr: [], // 查询列表
      postForm: {}, // 查询表单数据
      temp: {}, // 编辑框表单数据对象
      temp_base: {}, // 编辑框表单数据对象基础模板
      dialogFormVisible: false, // 是否显示编辑框
      dialogStatus: '', // 编辑框状态，创建或修改
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {},
      downloadLoading: false
    }
  },
  created() {
    this.fetchContentList()
    this.fetchModuleFieldList(this.moduleid)
  },
  methods: {
    // 获取内容信息列表
    fetchContentList(info) {
      let form = { catid: this.catid, moduleid: this.moduleid }
      if (info) {
        form = Object.assign({}, form, info)
      }
      fetchContentList(form).then(data => {
        this.list = data.items
        this.total = data.total
        this.listLoading = false
      })
    },
    // 获取模型字段列表并进行字段显示和查询处理
    fetchModuleFieldList(moduleid) {
      fetchModuleFieldList({ moduleid }).then(data => {
        if (data && data instanceof Array && data.length > 0) {
          this.field_arr = data
          this.field_arr.map(item => {
            this.temp[item.field] = ''
          })
          this.temp_base = Object.assign({}, this.temp)
          this.rules = this.formatRules(data)
          data.map(item => {
            if (this.display_field.indexOf(item.field) > -1) {
              this.display_arr.push(item)
              this.display_arr.sort((a, b) => {
                a.listorder > b.listorder
              })
            }
            if (this.select_field.indexOf(item.field) > -1) {
              this.select_arr.push(item)
            }
          })
        }
      })
    },
    // 格式化规则
    formatRules(file_arr) {
      if (file_arr.length > 0) {
        const obj = {}
        file_arr.map(item => {
          let trigger = 'blur'
          if (item.type === 'radio' || item.type === 'checkbox' || item.type === 'select') {
            trigger = 'change'
          }
          const rule_info = {
            required: item.required === 1,
            message: item.errormsg || validateMessages[item.pattern] || '该值不能为空',
            trigger
          }
          if (item.pattern && valideRules[item.pattern]) {
            Object.assign(rule_info, { pattern: (valideRules[item.pattern])() })
          }
          obj[item.field] = [rule_info]
          if (item.type === 'text' || item.type === 'varchar' || item.type === 'title' || item.type === 'textarea') {
            if (item.maxlength > 0 && item.maxlength > item.minlength) {
              obj[item.field].push({
                min: item.minlength,
                max: item.maxlength,
                message: item.errormsg || validateMessages[item.pattern] || '该值不能为空',
                trigger
              })
            }
          }
        })
        return obj
      }
      return {}
    },
    // 查询
    selectBtn() {
      console.log(this.postForm)
      Object.keys(this.postForm).map(key => {
        if (this.postForm[key] === '') {
          delete this.postForm[key]
        }
      })
      this.listQuery.page = 1
      this.fetchContentList(this.postForm)
    },
    // 创建操作
    handleCreate() {
      this.temp = Object.assign({}, this.temp_base) // 重置模板数据
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 创建内容
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const form = Object.assign({}, { moduleid: this.moduleid, catid: this.catid }, this.temp)
          createContent(form).then((data) => {
            var obj = Object.assign({}, this.temp, { id: data })
            this.list.unshift(obj)
            this.dialogFormVisible = false
            this.total = this.total + 1
            this.$notify({
              title: '成功',
              message: '创建内容成功!',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 更新操作
    handleUpdate(row) {
      const obj = {}
      for (const key in row) {
        obj[key] = typeof row[key] === 'number' ? row[key].toString() : row[key]
      }
      this.temp = Object.assign({}, obj) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新內容
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, { moduleid: this.moduleid, catid: this.catid }, this.temp)
          updateContent(tempData).then(() => {
            for (const v of this.list) {
              if (Number(v.id) === Number(this.temp.id)) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 刪除內容
    deleteBtn(index, row) {
      this.$confirm(`确定删除${row.name || row.title || ''}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteContent({ id: row.id, catid: this.catid, moduleid: this.moduleid }).then(data => {
          this.$notify({
            title: '成功',
            message: '刪除成功!',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.total = this.total - 1
          this.list.splice(index, 1)
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    // 过滤设置值
    filterSelectOptions(options) {
      if (options) {
        let str = JSON.parse(options)['options']
        str = str.indexOf(',') > -1 ? str.split(',') : str.split('\n')
        if (str && str instanceof Array && str.length > 0) {
          const arr = str.map(item => {
            return {
              name: item.split('|')[0],
              value: item.split('|')[1].toString()
            }
          })
          return arr
        }
      }
      return []
    },
    // 导出下载excel
    handleDownload() {
      this.downloadLoading = true
      jsonToExcel.then(excel => {
        const tHeader = []
        for (let i = 0; i < this.display_arr.length; i++) {
          tHeader.push(this.display_arr[i].name)
        }
        const data = this.formatJson(this.display_arr, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.$route.meta.title
        })
        this.downloadLoading = false
      })
    },
    // 过滤数组值
    filter_arr: function(value, arr) {
      let str = ''
      arr.map(item => {
        if (item.value === value) {
          str = item.name
        }
      })
      return str
    },
    // 格式化数据处理
    formatJson(filter_arr, jsonData) {
      return jsonData.map(v => filter_arr.map(j => {
        if (j.field === 'createtime') {
          return parseTime(v[j.field])
        } else if (j.type === 'radio' || j.type === 'checkbox' || j.type === 'select') {
          return this.filter_arr(v[j.field], this.filterSelectOptions(j.setup))
        } else {
          return v[j.field]
        }
      }))
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
