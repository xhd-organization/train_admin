<template>
  <div class="app-container">
    内容
  </div>
</template>
<script>
import { fetchContentList } from '@/api/content'
export default {
  name: 'Content',
  data() {
    return {
      list: [], // 列表数据
      id: this.$route.meta.id,
      moduleid: this.$route.meta.moduleid
    }
  },
  created() {
    console.log(this.$route)
    this.fetchContentList()
  },
  methods: {
    // 获取内容信息列表
    fetchContentList() {
      fetchContentList({ id: this.id, moduleid: this.moduleid }).then(data => {
        this.list = data
        console.log(data)
      })
    }
  }
}
</script>
