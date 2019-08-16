<template>
  <el-table :data="feedback" style="width: 100%;padding-top: 15px;">
    <el-table-column label="反馈内容" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.description }}
      </template>
    </el-table-column>
    <el-table-column label="时间" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.createTime | formatTime }}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.type | statusFilter">
          {{ row.type }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { formatTime } from '@/utils'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '2': 'danger'
      }
      return statusMap[status]
    },
    formatTime(time) {
      return formatTime(time, null, false)
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  props: {
    feedback: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      list: null
    }
  }
}
</script>

<style type="text/css">
  .el-table .cell{
    white-space: nowrap
  }
</style>
