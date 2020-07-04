<template lang="html">
  <div class="partners-statics">

    <div ref="chart" class="charts chart-bar"></div>
    <myTable ref="listTable" :listConf="listConf" :no-search="true" >
    </myTable>
  </div>
</template>

<script>
import Util from '@/libs/util'
import myTable from '@/view/includes/myTable'
import echarts from 'echarts'
import tdTheme from '@/components/charts/theme.json'
import { on, off, getDate } from '@/libs/tools'

echarts.registerTheme('tdTheme', tdTheme)

export default {
  components: {
    myTable
  },
  data () {
    return {
      dom: null,
      statics: [],
      type: 'new',
      searchMode: 'fast',
      fastType: 'week',
      searchDate: [],
      listConf: {
        url: '/adminapi/keyword/all',
        searchParams: {
          name: '',
          type: ''
        },
        item: [],
        columns: [
          { type: 'index', align: 'center', width: 100, fixed: 'left' },
          { title: '关键词', align: 'center', key: 'name' },
          { title: '搜索次数', align: 'center', key: 'count' },
          { title: '排序', align: 'center', key: 'sort' },
          { title: '添加时间', align: 'center', width: 180, key: 'created_at' }
        ]
      }
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    getStatics () {
      var _this = this
      Util.ajax({
        url: '/adminapi/keyword/all?page=1&page_size=10',
        method: 'get',
        success: function (result) {
          if (result.error == 0) {
            var field = []
            var data = []
            result.result.data.forEach(obj => {
              field.push(obj.name)
              data.push(obj.count)
              _this.echarts(field, data)
            })
          } else {
            _this.$Notice.error({ title: '提示', desc: result.info })
          }
        }
      })
    },

    echarts (field, data) {
      let option = {
        tooltip: { // 提示信息
          trigger: 'axis', // axis轴对称
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: field
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: data,
          type: 'bar',
          barWidth: '30%'
        }]
      }

      this.chart = echarts.init(this.$refs.chart, 'tdTheme')
      this.chart.setOption(option)
      on(window, 'resize', this.resize)
    }

  },
  created: function () {
    var _this = this
    _this.getStatics()

    // this.getConsultSearch()
  },
  mounted: function () {
    this.echarts()
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>

<style scoped>
.ivu-row {
  padding: 10px;
}
.row-label {
  text-align: right;
  padding-right: 10px;
}

.row-content {
  text-align: left;
  padding-left: 10px;
}
.detail-images {
  width: 80px;
  height: 80px;
  margin-right: 10px;
}

.title {
  font-size: 14px;
  text-align: center;
}

.first {
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  height: 60px;
  line-height: 60px;
}

.second {
  font-size: 14px;
  text-align: center;
  height: 25px;
  line-height: 25px;
}

.col-div {
  margin: 10px;
  border-radius: 5px;
  padding: 10px;
  color: #ffffff;
}

.charts {
  height: 300px;
}

.second {
  font-size: 14px;
  text-align: left;
  margin-left: 30px;
}
</style>
