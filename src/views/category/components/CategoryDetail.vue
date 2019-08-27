<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-width="100px">
      <el-form-item label="请选择模型" class="postInfo-container-item" prop="moduleid">
        <el-select v-model="postForm.moduleid">
          <el-option v-for="item in module_arr" :key="item.ids" :value="item.ids" :label="item.title || item.names" />
        </el-select>
      </el-form-item>
      <el-form-item label="上级栏目" class="postInfo-container-item" prop="parentid">
        <el-cascader ref="category" v-model="select_category" :options="category_arr" :props="{ label: 'catname', value: 'id', expandTrigger: 'hover' }" :show-all-levels="false" @click="getCheckedNodes" @change="changeParentId" />
      </el-form-item>
      <el-form-item label="栏目名称:" class="postInfo-container-item" prop="catname">
        <el-input v-model="postForm.catname" />
      </el-form-item>
      <el-form-item label="栏目目录:" class="postInfo-container-item" prop="catdir">
        <el-input v-model="postForm.catdir" />
      </el-form-item>
      <el-form-item label="栏目简介:" class="postInfo-container-item">
        <el-input v-model="postForm.description" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm">保存</el-button>
        <el-button @click="cancelForm">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchCategoryList, createCategory, fetchCategoryDetail, updateCategory } from '@/api/category'
import { fetchModuleList } from '@/api/module'

const defaultForm = {
  listfields: '*',
  moduleid: '',
  parentid: '0',
  catname: '',
  catdir: '',
  id: undefined
}

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
      rules: {
        catname: { required: true, message: '请输入栏目名称', trigger: 'blur' },
        catdir: { required: true, message: '请输入栏目目录', trigger: 'blur' },
        title: [{ validator: validateRequire }]
      },
      tempRoute: {},
      category_arr: [], // 栏目列表
      select_category: [0], // 选中栏目
      module_arr: [] // 模型列表
    }
  },
  created() {
    if (this.isEdit) {
      const catid = this.$route.params && this.$route.params.catid
      this.fetchData(catid)
    } else {
      this.postForm = Object.assign({}, defaultForm)
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
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.catname}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑栏目'
      document.title = `${title} - ${this.postForm.catname}`
    },
    // 提交表单信息
    async submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const form = Object.assign({}, this.postForm, { moduleid: this.postForm.ids })
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
            createCategory(this.postForm).then(data => {
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
          this.category_arr.unshift({ id: 0, catname: '作为一级栏目', parentid: '0' })
        }
      })
    },
    // 获取模型列表
    fetchModuleList() {
      fetchModuleList().then(data => {
        this.$set(this.postForm, 'moduleid', data.items[0].ids)
        this.module_arr = data.items
      })
    },
    getCheckedNodes() {
      console.log(this.$refs.category)
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

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
