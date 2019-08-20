<template>
  <div class="app-container">
    <select id="type" v-model="type" name="type" class="required" minlength="1" :disabled="isEdit">
      <option value="">请选择字段类型</option>
      <option value="catid">栏目</option>
      <option value="title">标题</option>
      <option value="typeid">类别</option>
      <option value="text">单行文本</option>
      <option value="textarea">多行文本</option>
      <option value="editor">编辑器</option>
      <option value="select">下拉列表</option>
      <option value="radio">单选按钮</option>
      <option value="checkbox">复选框</option>
      <option value="image">单张图片</option>
      <option value="images">多张图片</option>
      <option value="file">单文件上传</option>
      <option value="files">多文件上传</option>
      <option value="number">数字</option>
      <option value="datetime">日期和时间</option>
      <option value="linkage">联动菜单</option>
      <option value="verify">验证码</option>
    </select>
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
      type: 'radio'
    }
  },
  methods: {
    fetchModuleField() {
      fetchModuleFieldDetail({ moduleid: this.moduleid, fieldid: this.fieldid }).then(data => {
        console.log(data)
      })
    }
  }
}
</script>
