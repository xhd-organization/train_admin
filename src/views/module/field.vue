<template>
  <div class="app-container">
    <el-table :key="tableKey" v-loading="listLoading" :data="field_arr" fit highlight-current-row style="width: 100%;">
      <el-table-column label="排序" prop="listorder" align="center" width="50">
        <template slot-scope="scope" align="center">
          <span><el-input v-model="scope.row.listorder" name="listorder" class="input-text-c" /></span>
        </template>
      </el-table-column>
      <el-table-column label="字段名" prop="name" align="center" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="别名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字段类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.data_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统字段" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.names }}</span>
        </template>
      </el-table-column>
      <el-table-column label="必填" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.require }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="is_admin" label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button type="primary" size="small" @click="fieldEdit(row)">
            禁用
          </el-button>
          <el-button size="mini" type="danger" @click="deleteBtn(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchModuleField } from '@/api/module'

import { mapGetters } from 'vuex'

export default {
  name: 'FieldModule',
  data() {
    return {
      field_arr: [],
      tableKey: 0,
      is_admin: false,
      listLoading: true
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.getModuleField(this.$route.params.moduleid)
    if (this.roles.includes('admin')) {
      this.is_admin = true
    }
  },
  methods: {
    getModuleField(moduleid) {
      fetchModuleField({ moduleid }).then(data => {
        this.field_arr = data
        this.listLoading = false
      })
    }
  }
}
</script>

<style>
  .el-input__inner{
    padding: 0;
    text-align: center;
  }
</style>
