<template>
  <div class="app-container">
    <el-form v-if="!is_tree" ref="postForm" :model="postForm" class="filter-container form-container">
      <div v-for="field in select_arr" :key="field.id" class="select-item">
        <el-input v-if="field.type === 'title' || field.type === 'text' || field.type === 'catid' || field.type === 'varchar'" v-model="postForm[field.field]" :placeholder="field.name" style="width: 200px;" class="filter-item" @keyup.enter.native="selectBtn" />
        <el-select v-if="field.type === 'radio' || field.type === 'checkbox' || field.type === 'select'" v-model="postForm[field.field]" :placeholder="field.name" clearable class="filter-item">
          <el-option v-for="item in field.setup['options']" :key="item.key" :label="item.name" :value="item.value" />
        </el-select>
        <el-select v-if="field.type === 'source'" v-model="postForm[field.field]" :placeholder="field.name" clearable class="filter-item">
          <el-option v-for="item in source_info[field.field]" :key="item.id" :label="item.name" :value="item.value" />
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
    <el-tree
      v-if="is_tree"
      :data="tree_data"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <span slot-scope="{ node, data }" class="flex custom-tree-node">
        <span class="flex tree_name"><img :src="base_url + '/uxy/diy/' + data.images">{{ data.name }}</span>
        <span>
          <el-button type="text" size="small" @click="() => handleCreate(data)">添加子项</el-button>
          <el-button type="text" size="small" @click="handleUpdate(data)">编辑</el-button>
          <el-button type="text" size="small" @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>
    <el-table
      v-else
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column v-for="field in display_arr" :key="field.id" :label="field.name" :prop="field.field" align="center">
        <template slot-scope="scope">
          <span v-if="field.type === 'radio' || field.type === 'checkbox' || field.type === 'select'">{{ scope.row[field.field] | formatFieldName(field.setup['options']) }}</span>
          <span v-else-if="field.type === 'datetime'">{{ scope.row[field.field] | parseTime }}</span>
          <span v-else-if="field.type === 'source' && source_info[field.field]">{{ formatSourceName(field.field, scope.row[field.field], field.setup['source_name'], field.setup['source_value']) }}</span>
          <span v-else>{{ scope.row[field.field] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="deleteBtn(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0 && !is_tree" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchContentList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 100%;">
        <el-form-item v-if="is_tree" label="上级名称" prop="parentid" :required="true">
          <el-select v-model="temp['parentid']" placeholder="选择上级名称" class="filter-item">
            <el-option v-for="item in tree_data_base" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-for="field in field_arr" :key="field.id" :label="field.name" :prop="field.field" :required="field.required ===1">
          <el-input v-if="field.type === 'title' || field.type === 'text' || field.type === 'catid' || field.type === 'varchar'" v-model="temp[field.field]" :placeholder="field.name" />
          <el-select v-if="field.type === 'radio' || field.type === 'checkbox' || field.type === 'groupid' || field.type === 'select'" v-model="temp[field.field]" :placeholder="field.name" class="filter-item">
            <el-option v-for="item in field.setup['options']" :key="item.key" :label="item.name" :value="item.value" />
          </el-select>
          <el-select v-if="field.type === 'source'" v-model="temp[field.field]" :placeholder="field.name" class="filter-item">
            <el-option v-for="item in source_info[field.field]" :key="item.key" :label="item.name" :value="item.value" />
          </el-select>
          <el-upload
            v-if="field.type === 'image' || field.type === 'images' || field.type === 'file' || field.type === 'files'"
            :ref="'upload_' + field.field"
            class="upload-demo"
            list-type="picture-card"
            :action="upload_url"
            :auto-upload="false"
            :accept="field.setup['filetype']"
            :on-success="(res, file)=> { return uploadSuccess(res,file, field.field) }"
            :on-preview="previewFile"
            :on-remove="(file)=> { return removeFile(file, field.field) }"
            :before-remove="beforeRemove"
            :multiple="field.type === 'images' || field.type === 'files' ? true : false"
            :limit="field.type === 'images' || field.type === 'files' ? 9 : 1"
            :on-exceed="uploadMaxLimit"
            :file-list="temp[field.field]"
          >
            <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
            <div style="margin-top: 10px;"><el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('upload_' + field.field)">开始上传</el-button></div>
          </el-upload>
          <el-date-picker v-if="field.type === 'datetime'" v-model="temp[field.field]" type="datetime" format="yyyy-MM-dd HH:mm:ss" :placeholder="field.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">{{ dialogStatus === 'create' ? '提交' : '保存' }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="is_preview_show">
      <img width="100%" :src="previewImgUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { fetchContentList, createContent, updateContent, deleteContent } from '@/api/content'
import { fetchModuleFieldList } from '@/api/module'

import waves from '@/directive/waves' // waves directive

import { parseTime, formatTime, getTree } from '@/utils'
import { validateMessages, valideRules } from '@/utils/validate'
const jsonToExcel = import('@/vendor/Export2Excel')

import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Content',
  components: { Pagination },
  directives: { waves },
  filters: {
    // 格式化字段值进行显示
    formatFieldName(value, setup) {
      if (setup) {
        if (setup && setup instanceof Array && setup.length > 0) {
          setup.map(item => {
            if (item.value === value) {
              value = item.name
            }
          })
        }
      }
      return value
    },
    // 时间处理显示
    parseTime(value) {
      if (value) {
        return formatTime(value, '{y}-{m}-{d} {h}:{i}:{s}', true)
      }
      return value
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [], // 列表数据
      total: 0, // 列表数据总数量
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      base_url: 'http://127.0.0.1:7001', // 服务器地址
      upload_url: process.env.VUE_APP_BASE_API + '/upload', // 上传地址
      catid: this.$route.meta.id, // 栏目id
      is_tree: this.$route.meta.is_tree, // 是否为树形结构
      moduleid: this.$route.meta.moduleid, // 模型id
      display_field: this.$route.meta.listfields ? this.$route.meta.listfields.split(',') : [], // 需要显示的字段
      display_arr: [], // 显示字段
      field_arr: [], // 字段列表
      select_field: this.$route.meta.selectfields ? this.$route.meta.selectfields.split(',') : [], // 需要查询的字段
      select_arr: [], // 查询列表
      source_info: {}, // 数据源对象
      postForm: {}, // 查询表单数据
      temp: {}, // 编辑框表单数据对象
      temp_base: {}, // 编辑框表单数据对象基础模板
      dialogFormVisible: false, // 是否显示编辑框
      dialogStatus: '', // 编辑框状态，创建或修改
      textMap: { update: '编辑', create: '添加' },
      rules: {},
      downloadLoading: false, // 导出下载加载状态
      is_preview_show: false, // 是否预览
      previewImgUrl: '', // 预览图片地址
      file: {}, // 上传文件对象
      tree_data: [], // 树形结构数据
      tree_data_base: [{ id: 0, name: '作为一级项' }], // 树形数据选择框
      tree_id: 1000
    }
  },
  computed: {
    // 处理列表数据源字段显示
    formatSourceName() {
      return function(field, value, source_name, source_value) {
        let source_display = ''
        if (this.source_info[field] instanceof Array && this.source_info[field].length > 0) {
          for (let i = 0; i < this.source_info[field].length; i++) {
            if (this.source_info[field][i][source_value] === value) {
              source_display = this.source_info[field][i][source_name]
              break
            }
          }
        }
        return source_display
      }
    }
  },
  created() {
    this.fetchContentList()
    this.fetchModuleFieldList(this.moduleid)
  },
  methods: {
    // 获取内容信息列表
    fetchContentList(info) {
      const is_all = this.is_tree
      let form = { catid: this.catid, moduleid: this.moduleid, is_all }
      if (info) {
        form = Object.assign({}, form, info)
      }
      fetchContentList(form).then(data => {
        if (this.is_tree) {
          this.tree_data = this.tree_data.concat(getTree('0', data.items, 0, 'tree'))
          this.tree_data_base = this.tree_data_base.concat(getTree('0', data.items, 0, 'list'))
        } else {
          this.list = data.items
          this.total = data.total
        }
        this.listLoading = false
      })
    },
    // 获取模型字段列表并进行字段显示和查询处理
    fetchModuleFieldList(moduleid) {
      fetchModuleFieldList({ moduleid }).then(data => {
        if (data && data instanceof Array && data.length > 0) {
          const arr = data.map(item => {
            this.temp[item.field] = ''
            const setup = item.setup ? JSON.parse(item.setup) : {}
            if (item.type === 'radio' || item.type === 'checkbox' || item.type === 'groupid' || item.type === 'select') {
              const options = this.filterSelectOptions(setup.options)
              Object.assign(setup, { options })
            }
            if (item.type === 'file' || item.type === 'files' || item.type === 'images' || item.type === 'image') {
              this.$set(this.temp, item.field, [])
              setup['filetype'] = setup['filetype'] instanceof Array && setup['filetype'].length > 0 ? setup['filetype'].toString() : ''
            }
            item.setup = setup
            if (this.display_field.indexOf(item.field) > -1) {
              this.display_arr.push(item)
              this.display_arr.sort((a, b) => {
                a.listorder > b.listorder
              })
            }
            if (this.select_field.indexOf(item.field) > -1) {
              this.select_arr.push(item)
            }
            // 数据源处理
            if (item.type === 'source') {
              this.filtersSourceOptions(item.setup).then(data => {
                this.$set(this.source_info, item.field, data)
              })
            }
            return item
          })
          this.field_arr = arr
          this.temp_base = Object.assign({}, this.temp)
          this.rules = this.formatRules(data)
        }
      })
    },
    // 格式化规则
    formatRules(file_arr) {
      if (file_arr.length > 0) {
        const obj = {}
        file_arr.map(item => {
          let trigger = 'blur'
          if (item.type === 'radio' || item.type === 'checkbox' || item.type === 'select' || item.type === 'source') {
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
      Object.keys(this.postForm).map(key => {
        if (this.postForm[key] === '') {
          delete this.postForm[key]
        }
      })
      this.listQuery.page = 1
      this.fetchContentList(this.postForm)
    },
    // 创建操作
    handleCreate(row) {
      this.temp = Object.assign({}, this.temp_base) // 重置模板数据
      // 单独对树形结构添加parentid
      if (this.is_tree && row) {
        this.temp = Object.assign({}, this.temp, { parentid: row.id })
      }
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
      // const obj = {}
      // for (const key in row) {
      //   obj[key] = typeof row[key] === 'number' ? row[key].toString() : row[key]
      // }
      this.temp = Object.assign({}, row) // copy obj
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
        options = options.indexOf(',') > -1 ? options.split(',') : options.split('\n')
        if (options && options instanceof Array && options.length > 0) {
          const arr = options.map(item => {
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
    // 过滤处理数据源信息
    async filtersSourceOptions(options) {
      if (options) {
        const sourceid = options.sourceid
        const source_name = options.source_name
        const source_value = options.source_value
        const source_moduleid = options.source_moduleid
        let form = { catid: sourceid, moduleid: source_moduleid }
        form = Object.assign({}, form)
        const list = await fetchContentList(form)
        if (list.total > 0) {
          const arr = list.items.map(item => {
            item['name'] = item[source_name]
            item['value'] = String(item[source_value])
            return item
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
    },
    // 上传数量超过最大显示回调
    uploadMaxLimit(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // 移除文件
    removeFile(file, field) {
      if (this.temp[field] instanceof Array && this.temp[field].length > 0) {
        this.temp[field].map((item, index) => {
          if (item.url === file.url) {
            this.temp[field].splice(index, 1)
          }
        })
      }
    },
    // 预览文件
    previewFile(file) {
      this.previewImgUrl = file.url
      this.is_preview_show = true
    },
    // 移除文件之前回调
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 文件上传
    submitUpload(ref_value) {
      this.$refs[ref_value][0].submit()
    },
    // 上传成功回调
    uploadSuccess(response, file, field) {
      if (response.code === 0) {
        this.temp[field].push({ name: '', url: 'http://localhost:7001' + response.data })
      }
    },
    append(data) {
      const newChild = { id: this.tree_id++, name: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
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
  .tree_name{ font-size: 14px; padding-right: 10px; justify-content: flex-start; }
  .tree_name img{ padding-right: 6px; }
</style>
<style type="text/css">
  .upload-demo ul li{ float: left; }
</style>
