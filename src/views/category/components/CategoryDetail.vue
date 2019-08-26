<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-width="100px">
      <el-form-item label="catid:" class="postInfo-container-item" prop="id">
        <el-input v-model="postForm.id" />
      </el-form-item>
      <el-form-item label="模型名称:" class="postInfo-container-item" prop="title">
        <el-input v-model="postForm.title" />
      </el-form-item>
      <el-form-item label="模型表名:" class="postInfo-container-item" prop="name">
        <el-input v-model="postForm.name" />
      </el-form-item>
      <el-form-item label="使用字段:" class="postInfo-container-item">
        <el-col :span="11">
          <el-input v-model="postForm.listfields" />
        </el-col>
        <el-col :span="11">
          例:id,title,url,imgUrl *表示所有的字段
        </el-col>
      </el-form-item>
      <el-form-item label="模型简介:" class="postInfo-container-item">
        <el-input v-model="postForm.description" type="textarea" />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="新建表字段:" class="postInfo-container-item">
        <el-radio-group v-model="postForm.emptytable">
          <el-radio label="1">空表字段</el-radio>
          <el-radio label="0">普通数据列表字段</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm">保存</el-button>
        <el-button @click="cancelForm">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createModule, fetchModuleDetail, updateModule } from '@/api/module'

const defaultForm = {
  listfields: '*',
  emptytable: '0',
  name: '',
  title: '', // 模型名称
  id: undefined
}

export default {
  name: 'ModuleDetail',
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
        name: { required: true, message: '请输入模型表名', trigger: 'blur' },
        names: { required: true, message: '请输入模型名称', trigger: 'blur' },
        tableName: { required: true, message: '请输入模型表名', trigger: 'blur' },
        title: [{ validator: validateRequire }]
      },
      tempRoute: {}
    }
  },
  created() {
    if (this.isEdit) {
      const moduleid = this.$route.params && this.$route.params.moduleid
      this.fetchData(moduleid)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    fetchData(moduleid) {
      fetchModuleDetail({ moduleid }).then(data => {
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
      const title = '编辑模型'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.names}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑模型'
      document.title = `${title} - ${this.postForm.names}`
    },
    async submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const form = Object.assign({}, this.postForm, { moduleid: this.postForm.ids })
          if (this.isEdit) {
            updateModule(form).then(data => {
              this.$notify({
                title: '成功',
                message: '更新模型成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.cancelForm()
            })
          } else {
            createModule(this.postForm).then(data => {
              this.$notify({
                title: '成功',
                message: '创建模型成功',
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
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
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
