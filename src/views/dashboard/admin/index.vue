<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <panel-group :wechat="num_info.wechat_num" :learn="num_info.learn_num" :download="num_info.download_num" :feedback="num_info.feedback_num" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <!--     <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row> -->

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table :feedback="feedback" />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="margin-bottom:30px;">
        <div class="version-box">
          <h3 v-if="version.length > 0" class="version-name">版本更新日志 版本号：{{ version[version_currentIndex].No }}<span>{{ (version_currentIndex + 1) + '/' + version.length }}</span></h3>
          <el-carousel indicator-position="none" :autoplay="false" :arrow="version.length > 1 ? 'hover' : 'never'" @change="shangeVersion">
            <el-carousel-item v-for="(item, index) in version" :key="index">
              <h4>更新时间: {{ item.create_time | parseTime }}</h4>
              <div class="version-desc" v-html="item.desc" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'

import { transactionList } from '@/api/remote-search'

import { parseTime } from '@/utils'

const lineChartData = {
  learn: {
    train: [100, 120, 161, 134, 105, 160, 165],
    preparing: [120, 82, 91, 154, 162, 140, 145]
  },
  wechat: [180, 160, 151, 106, 145, 150, 130],
  download: {
    train: [80, 100, 121, 104, 105, 90, 100],
    preparing: [120, 90, 100, 138, 142, 130, 130]
  },
  feedback: {
    preparing: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    // GithubCorner,
    PanelGroup,
    LineChart,
    // RaddarChart,
    // PieChart,
    // BarChart,
    TransactionTable
    // TodoList,
    // BoxCard
  },
  filters: {
    parseTime(time) {
      return parseTime(time)
    }
  },
  data() {
    return {
      num_info: {},
      version: [],
      version_currentIndex: 0,
      lineChartData: {},
      feedback: [] // 反馈数据
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      transactionList().then(data => {
        this.num_info.download_num = data.download_num
        this.num_info.feedback_num = data.feedback_num
        this.num_info.learn_num = data.learn_num
        this.num_info.wechat_num = data.wechat_num
        this.feedback = data.feedback_arr
        this.version = data.version || []
      })
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    shangeVersion(index) {
      this.version_currentIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.version-box{
  background: #fff;
  box-sizing: border-box;
  padding: 10px;
  .version-name {
    margin: 8px 0;
    color: #909399;
    font-size: 14px;
    font-weight: normal;
    padding: 10px 0;
    border-bottom: 1px solid #dfe6ec;
    span {
      float: right;
    }
  }
  h4{
    color: #8a6d3b;
    background-color: #fcf8e3;
    padding: 8px 5px;
    border-radius: 4px;
    margin: 5px 0;
    font-size: 14px;
    border-color: #faebcc;
  }
  .version-desc {
    color: #999;
    font-size: 12px;
    padding-top: 10px;
    p {
      margin: 2px 0;
    }
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
