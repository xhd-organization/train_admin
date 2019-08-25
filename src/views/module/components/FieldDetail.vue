<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="170px">
      <el-form-item label="字段类型" prop="type">
        <el-select v-model="form.type" placeholder="字段类型" :disabled="isEdit">
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
        </el-select>
      </el-form-item>
      <el-form-item label="字段名" prop="field">
        <el-input v-model="form.field" />
      </el-form-item>
      <el-form-item label="字段别名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item v-if="!setup_filter(form.type)" label="字段相关设置">
        <el-row v-if="form.type === 'title'" :gutter="20" type="flex" justify="start">
          <el-col :span="4" class="align">是否使用标题样式标题样式</el-col>
          <el-col :span="3">
            <el-radio-group v-model="form.setup['style']">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row v-if="form.type === 'title' || form.type === 'text' || form.type === 'number'" :gutter="20" type="flex" justify="start">
          <el-col :span="4" class="align">文本框长度</el-col>
          <el-col :span="3"><el-input v-model="form.setup['size']" /></el-col>
        </el-row>
        <el-row v-if="form.type === 'number'" :gutter="20" type="flex" justify="start">
          <el-col :span="4" class="align">是否包括负数</el-col>
          <el-col :span="2"><el-checkbox v-model="form.setup['numbertype']" label="1" checked>不包括负数</el-checkbox></el-col>
        </el-row>
        <el-row v-if="form.type === 'number'" :gutter="20" type="flex" justify="start">
          <el-col :span="4" class="align">小数位数</el-col>
          <el-col :span="4">
            <el-select v-model="form.setup['decimaldigits']">
              <el-option value="0" label="0" selected />
              <el-option value="1" label="1" />
              <el-option value="2" label="2" />
              <el-option value="3" label="3" />
              <el-option value="4" label="4" />
              <el-option value="5" label="5" />
            </el-select>
          </el-col>
          <el-col v-if="form.setup['fieldtype'] === 'tinyint' || form.setup['fieldtype'] === 'smallint' || form.setup['fieldtype'] === 'mediumint' || form.setup['fieldtype'] === 'int'" :span="4" class="align"><el-checkbox v-model="form.setup['numbertype']" label="1" checked>不包括负数</el-checkbox></el-col>
        </el-row>
        <el-row v-if="form.type === 'typeid'" :gutter="20" type="flex" justify="start">
          <el-col :span="4" class="align">选项类型</el-col>
          <el-col :span="8">
            <el-radio-group v-model="form.setup['inputtype']">
              <el-radio label="checkbox">复选框</el-radio>
              <el-radio label="select">下拉列表框</el-radio>
              <el-radio label="radio">单选框</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row v-if="form.type === 'typeid' || form.type === 'select' || form.type === 'textarea'" :gutter="20" type="flex" justify="start">
          <el-col :span="4" class="align">字段类型</el-col>
          <el-col :span="4">
            <el-select v-model="form.setup['fieldtype']" placeholder="字段类型">
              <el-option v-if="form.type === 'typeid' || form.type === 'select' || form.type === 'radio' || form.type === 'checkbox'" value="varchar" label="字符 VARCHAR" />
              <el-option v-if="form.type === 'typeid' || form.type === 'select' || form.type === 'radio' || form.type === 'checkbox'" value="tinyint" label="整数 TINYINT(3)" />
              <el-option v-if="form.type === 'typeid' || form.type === 'select' || form.type === 'radio' || form.type === 'checkbox'" value="smallint" label="整数 SMALLINT(5)" />
              <el-option v-if="form.type === 'select' || form.type === 'radio' || form.type === 'checkbox'" value="mediumint" label="整数 MEDIUMINT(8)" />
              <el-option v-if="form.type === 'select' || form.type === 'radio' || form.type === 'checkbox'" value="int" label="整数 INT(10)" />
              <el-option v-if="form.type === 'textarea'" value="mediumtext" label="mediumtext" />
              <el-option v-if="form.type === 'textarea'" value="text" label="TEXT" />
            </el-select>
          </el-col>
          <el-col v-if="form.setup['fieldtype'] === 'tinyint' || form.setup['fieldtype'] === 'smallint' || form.setup['fieldtype'] === 'mediumint' || form.setup['fieldtype'] === 'int'" :span="4" class="align"><el-checkbox v-model="form.setup['numbertype']" label="1" checked>不包括负数</el-checkbox></el-col>
        </el-row>
        <el-row v-if="form.type === 'select' || form.type === 'radio' || form.type === 'checkbox'" :gutter="20" type="flex" justify="start">
          <el-col :span="4" class="align">选项列表</el-col>
          <el-col :span="8">
            <el-input v-model="form.setup['options']" type="textarea" placeholder="选项名称|值,选项名称|值" />
          </el-col>
        </el-row>
        <el-row v-if="form.type === 'select'" :gutter="20" type="flex" justify="start">
          <el-col :span="4" class="align">选项类型</el-col>
          <el-col :span="8">
            <el-radio-group v-model="form.setup['multiple']">
              <el-radio label="checkbox">复选框</el-radio>
              <el-radio label="select">下拉列表框</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row v-if="form.type === 'typeid' || form.type === 'radio' || form.type === 'checkbox'" :gutter="20" type="flex" justify="start">
          <el-col :span="4" class="align">{{ form.type === 'typeid' ? '复选框或单选框的宽度' : '宽度' }}</el-col>
          <el-col :span="3"><el-input v-model="form.setup['labelwidth']" /></el-col>
        </el-row>
        <el-row v-if="form.type === 'typeid'" :gutter="20" type="flex" justify="start">
          <el-col :span="4" class="align">顶级类别ID</el-col>
          <el-col :span="3"><el-input v-model="form.setup['default']" /></el-col>
        </el-row>
        <el-row v-if="form.type === 'text' || form.type === 'textarea' || form.type === 'editor' || form.type === 'select' || form.type === 'number'" :gutter="20" type="flex" justify="start">
          <el-col :span="4" class="align">默认值</el-col>
          <el-col :span="3"><el-input v-model="form.setup['default']" /></el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="字段class类名">
        <el-input v-model="form.classname" />
      </el-form-item>
      <el-form-item v-if="form.type === 'datetime'" label="时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item>
            <el-time-picker v-model="form.date2" placeholder="选择时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="验证规则">
        <el-select v-model="form.pattern" placeholder="验证规则类型">
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
      <el-form-item label="禁止设置字段值的会员组">
        <el-checkbox-group v-model="form.unpostgroup">
          <el-checkbox label="超级管理员" name="unpostgroup" />
          <el-checkbox label="普通管理员" name="unpostgroup" />
          <el-checkbox label="普通用户" name="unpostgroup" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="限制字符串长度范围">
        <el-col :span="1"><span>最小</span></el-col><el-col :span="4"><el-input v-model="form.minlength" /></el-col><el-col :span="1"><span>最大</span></el-col><el-col :span="4"><el-input v-model="form.maxlength" /></el-col><span>个字符</span>
      </el-form-item>
      <el-form-item label="是否必填">
        <el-radio-group v-model="form.required">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="验证失败错误说明">
        <el-input v-model="form.errormsg" />
      </el-form-item>
      <el-form-item label="字段说明">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">{{ isEdit ? '保存' : '提交' }}</el-button>
        <el-button :disabled="isEdit" @click="resetForm('form')">重置</el-button>
      </el-form-item>
      <el-input v-if="isEdit" v-model="form.oldfield" hidden />
    </el-form>
  </div>
</template>
<script>
import { fetchModuleFieldDetail, createModuleField, updateModuleField } from '@/api/module'
const filter_setup = ['catid', 'createtime', 'linkage']
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
        required: 0,
        name: '',
        setup: {},
        title: '',
        tip: '',
        pattern: '',
        unpostgroup: [],
        desc: '',
        errormsg: '',
        listorder: 0,
        type: '',
        status: 0
      },

      moduleid: this.$route.params.moduleid,
      fieldid: this.$route.params.fieldid,
      rules: {
        name: [
          { required: true, message: '请输入字段名', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        field: [
          { required: true, message: '请输入字段名', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
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
        unpostgroup: [
          { type: 'array', required: false, message: '', trigger: 'change' }
        ],
        desc: [
          { required: false, message: '请填写字段说明', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.fetchModuleField()
    }
  },
  methods: {
    // 获取字段信息
    fetchModuleField() {
      fetchModuleFieldDetail({ moduleid: this.moduleid, fieldid: this.fieldid }).then(data => {
        this.form = data
        this.oldfield = data.field
      })
    },
    // 添加字段
    createField() {
      createModuleField().then(data => {

      })
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
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    setup_filter(type) {
      if (filter_setup.indexOf(type) > -1) {
        return true
      }
      return false
    }
  }
}
</script>

<style type="scss" scoped>
  .line{ text-align: center;}
  .align{ text-align: center;}
  .el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
