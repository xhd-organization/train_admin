<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建模型
      </el-button>
    </div>
  </div>
</template>

<script>
import { fetchModuleList } from '@/api/module'
export default {
  mounted() {
    fetchModuleList()
  },
  methods: {
    // 添加模型
    handleCreate() {
      this.$router.push('/module/create')
    }
  }
}
</script>
