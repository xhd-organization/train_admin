<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="demo-form" :disabled="isEdit">
      <el-form-item label="字段类型" prop="type">
        <el-select v-model="form.type" placeholder="字段类型">
          <el-option value="catid" label="栏目" />
          <el-option value="title" label="标题" />
          <el-option value="typeid" label="类别" />
          <el-option value="text" label="单行文本" />
          <el-option value="textarea" label="多行文本" />
          <el-option value="editor" label="编辑器" />
          <el-option value="select" label="下拉列表" />
          <el-option value="radio" label="单选按钮" />
          <el-option value="checkbox" label="复选框" />
          <el-option value="image" label="单张图片" />
          <el-option value="images" label="多张图片" />
          <el-option value="file" label="单文件上传" />
          <el-option value="files" label="多文件上传" />
          <el-option value="number" label="数字" />
          <el-option value="datetime" label="日期和时间" />
          <el-option value="linkage" label="联动菜单" />
          <el-option value="verify" label="验证码" />
        </el-select>
      </el-form-item>
      <el-form-item label="字段名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="字段别名" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item v-if="form.type" label="字段相关设置" prop="setup">
        <!-- <el-input v-model="form.title" /> -->
      </el-form-item>
      <el-form-item label="字段class类名" prop="classname">
        <el-input v-model="form.classname" />
      </el-form-item>
      <el-form-item label="时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker v-model="form.date2" placeholder="选择时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="验证规则" prop="rules">
        <el-select v-model="form.rules" placeholder="验证规则类型">
          <el-option value="pattern_email" label="电子邮件地址" />
          <el-option value="pattern_url" label="网址" />
          <el-option value="pattern_date" label="日期" />
          <el-option value="pattern_number" label="有效的数值" />
          <el-option value="pattern_digits" label="数字" />
          <el-option value="pattern_creditcard" label="信用卡号码" />
          <el-option value="pattern_equalTo" label="再次输入相同的值" />
          <el-option value="pattern_ip4" label="IP地址" />
          <el-option value="pattern_mobile" label="手机号码" />
          <el-option value="pattern_zipcode" label="邮编" />
          <el-option value="pattern_qq" label="QQ号码" />
          <el-option value="pattern_idcard" label="身份证号" />
          <el-option value="pattern_chinese" label="中文字符" />
          <el-option value="pattern_cn_username" label="中文英文和数字和下划线" />
          <el-option value="pattern_tel" label="电话号码" />
          <el-option value="pattern_english" label="英文" />
          <el-option value="pattern_en_num" label="英文和数字和下划线" />
          <el-option value="field_post" label="在前台投稿中显示" />
          <el-option value="field_unpost_group" label="禁止设置字段值的会员组" />
        </el-select>
      </el-form-item>
      <!--
      <el-form-item label="即时配送" prop="delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item> -->
      <el-form-item label="会员组" prop="group">
        <el-checkbox-group v-model="form.group">
          <el-checkbox label="超级管理员" name="group" />
          <el-checkbox label="普通管理员" name="group" />
          <el-checkbox label="普通用户" name="group" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="是否必填" prop="required">
        <el-radio-group v-model="form.required">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="验证失败错误说明" prop="errormsg">
        <el-input v-model="form.errormsg" />
      </el-form-item>
      <el-form-item label="字段说明" prop="desc">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { fetchModuleFieldDetail, createModuleField, updateModuleField } from '@/api/module'
export default {
  props: {
    isEdit: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      form: {
        required: '0',
        role: []
      },
      rules: {
        name: [
          { required: true, message: '请输入字段名', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入字段别名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个汉字', trigger: 'blur' }
        ],
        errormsg: [
          { required: false, message: '请输入失败错误信息', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个汉字', trigger: 'blur' }
        ],
        classname: [
          { required: false, message: '请输入英文和数字', trigger: 'blur' },
          { min: 2, max: 20, message: '英文和数字', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择字段类型', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: false, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: false, message: '请选择时间', trigger: 'change' }
        ],
        group: [
          { type: 'array', required: false, message: '请至少选择一个会员访问权限组', trigger: 'change' }
        ],
        desc: [
          { required: false, message: '请填写字段说明', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取字段信息
    fetchModuleField() {
      fetchModuleFieldDetail({ moduleid: this.moduleid, fieldid: this.fieldid }).then(data => {
        console.log(data)
      })
    },
    // 添加字段
    createField() {
      createModuleField().then(data => {})
    },
    // 更新字段
    updateField() {
      updateModuleField().then(data => {})
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createField(this.form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style type="scss" scoped>
  .line{ text-align: center;}
</style>
