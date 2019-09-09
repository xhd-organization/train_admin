<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-width="120px">
      <el-form-item label="请选择模型" class="postInfo-container-item" prop="moduleid">
        <el-select v-model="postForm.moduleid" @change="changeCateogryModule">
          <el-option v-for="item in module_arr" :key="item.ids" :value="item.ids" :label="item.title || item.names" />
        </el-select>
      </el-form-item>
      <el-form-item label="上级栏目" class="postInfo-container-item" prop="parentid">
        <el-select v-model="postForm.parentid" popper-class="category-select">
          <el-option v-for="item in category_arr" :key="item.id" :class="item.is_last === true ? `last-child level${item.level}` : item.level > 1 ? `child level${item.level}` : ''" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="栏目名称:" class="postInfo-container-item" prop="name">
        <el-input v-model="postForm.name" />
      </el-form-item>
      <el-form-item label="栏目目录:" class="postInfo-container-item" prop="path">
        <el-input v-model="postForm.path" />
      </el-form-item>
      <el-form-item v-if="field_arr.length > 0" label="列表显示字段:" class="postInfo-container-item">
        <el-checkbox-group v-model="listfields">
          <el-checkbox v-for="field in field_arr" :key="field.id" :label="field.field" name="listfields">{{ field.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="field_arr.length > 0" label="查询字段:" class="postInfo-container-item">
        <el-checkbox-group v-model="selectfields">
          <el-checkbox v-for="field in field_arr" :key="field.id" :label="field.field" name="selectfields">{{ field.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="栏目图标:" class="postInfo-container-item">
        <el-input v-model="postForm.icon" style="width: 80px; margin-right: 20px;" /><svg-icon v-if="postForm.icon" :icon-class="postForm.icon" class-name="disabled" />
      </el-form-item>
      <el-form-item label="栏目简介:" class="postInfo-container-item">
        <el-input v-model="postForm.description" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm">{{ isEdit ? '保存' : '提交' }}</el-button>
        <el-button @click="cancelForm">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchCategoryList, createCategory, fetchCategoryDetail, updateCategory } from '@/api/category'
import { fetchModuleList, fetchModuleFieldList } from '@/api/module'

const defaultForm = {
  description: '',
  moduleid: '',
  parentid: 0,
  name: '',
  path: '',
  icon: '',
  listfields: [],
  selectfields: [],
  id: undefined
}
console.log(Object.assign({}, defaultForm))
export default {
  name: 'CategoryDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      listfields: [], // 列表显示字段
      selectfields: [], // 查询字段
      rules: {
        name: { required: true, message: '请输入栏目名称', trigger: 'blur' },
        path: { required: true, message: '请输入栏目目录', trigger: 'blur' },
        title: [{ validator: validateRequire }]
      },
      tempRoute: {},
      category_arr: [], // 栏目列表
      module_arr: [], // 模型列表
      field_arr: [] // 字段列表
    }
  },
  created() {
    if (this.isEdit) {
      const catid = this.$route.params && this.$route.params.catid
      this.fetchData(catid)
    } else {
      this.postForm = Object.assign({}, defaultForm)
      if (this.$route.query.pid) {
        this.$set(this.postForm, 'parentid', Number(this.$route.query.pid))
        this.$set(this.postForm, 'moduleid', this.$route.query.moduleid)
      }
    }

    this.fetchCategoryList()
    this.fetchModuleList()

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    // 获取栏目详情
    fetchData(id) {
      fetchCategoryDetail({ id }).then(data => {
        this.postForm = data
        this.listfields = data.listfields ? data.listfields.split(',') : []
        this.selectfields = data.selectfields ? data.selectfields.split(',') : []
        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑栏目'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.name}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑栏目'
      document.title = `${title} - ${this.postForm.name}`
    },
    // 提交表单信息
    async submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const form = Object.assign({ }, this.postForm, { listfields: this.listfields, selectfields: this.selectfields })
          if (this.isEdit) {
            updateCategory(form).then(data => {
              this.$notify({
                title: '成功',
                message: '更新栏目成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.cancelForm()
            })
          } else {
            createCategory(form).then(data => {
              this.$notify({
                title: '成功',
                message: '创建栏目成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.cancelForm()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    cancelForm() {
      this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
        if (this.isActive(this.$route)) {
          this.toLastView(visitedViews, this.$route)
        }
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    // 修改上级栏目id
    changeParentId(arr) {
      console.log(arr)
      this.$set(this.postForm, 'parentid', arr[arr.length - 1])
    },
    // 获取栏目列表
    fetchCategoryList() {
      fetchCategoryList().then(data => {
        if (data instanceof Array && data.length > 0) {
          this.category_arr = this.get_tree(0, data)
          console.log(this.category_arr)
        }
        this.category_arr.unshift({ id: 0, name: '作为一级栏目', parentid: '0' })
        if (this.isEdit) {
          this.fetchModuleFieldList()
        }
      })
    },
    // 获取模型列表
    fetchModuleList() {
      fetchModuleList({ limit: 200 }).then(data => {
        if (!this.postForm.moduleid) {
          this.$set(this.postForm, 'moduleid', data.items[0].ids)
        }
        this.module_arr = data.items
      })
    },
    // 获取字段列表
    fetchModuleFieldList() {
      fetchModuleFieldList({ moduleid: this.postForm.moduleid }).then(data => {
        this.field_arr = data
      })
    },
    // 修改模型回调事件
    changeCateogryModule(value) {
      this.postForm.moduleid = value
      this.fetchModuleFieldList()
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;
  padding: 20px;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }
}

</style>
<style type="text/css">
  .category-select span{
    position: relative;
  }
  .category-select .child span, .category-select .last-child span{
    padding-left: 15px;
    margin-left: 10px;
  }
  .category-select .child span:before{
    content: '├';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .category-select .last-child span:before{
    content: '└';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    padding-top: 5px;
    box-sizing: border-box;
  }
  .category-select .level2{
    margin-left: 20px;
  }
    .category-select .level3{
    margin-left: 40px;
  }
</style>
<style type="text/css" scoped="">
  .disabled {
    pointer-events: none;
  }
</style>
