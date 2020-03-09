<template lang="html">
  <div class="partners-statics">
    <Row v-if="statics.user_total != undefined">
      <Col span="8" >
        <div class="col-div" style="background-color: #2db7f5">
          <div class="title">注册用户数</div>
          <div class="first">{{ statics.user_total }}</div>
        </div>
      </Col>
      <Col span="8">
        <div class="col-div" style="background-color: #ff9900">
          <div class="title">普通用户数</div>
          <div class="first">{{ statics.normal_total }}</div>
        </div>
      </Col>
      <Col span="8">
        <div class="col-div" style="background-color: #2d8cf0">
          <div class="title">VIP 用户数</div>
          <div class="first">{{ statics.vip_total }}</div>
          <div class="second">月 VIP 用户数:{{ statics.vip_year_total }}</div>
          <div class="second">年 VIP 用户数:{{ statics.vip_month_total }}</div>
        </div>
      </Col>
    </Row>

    <div>
      <RadioGroup v-model="type" type="button" style="margin-right: 10px;">
        <Radio label="new">新增人数</Radio>
        <Radio label="total">累计人数</Radio>
      </RadioGroup>

      <div style="margin-top: 20px;">
        <RadioGroup v-model="searchMode" type="button" style="margin-right: 10px;">
          <Radio label="fast">快捷</Radio>
          <Radio label="date">精确</Radio>
        </RadioGroup>
        <Select  v-if="searchMode == 'fast'" v-model="fastType" style="width: 120px;">
          <Option value="week">最近 7 天</Option>
          <Option value="two">最近 14 天</Option>
          <Option value="month">最近 30 天</Option>
        </Select>

        <sm-field
          v-else
          style="display: inline;width: 200px;"
          v-model="searchDate"
          :field="{type: 'daterange', placeholder: '查询时间', confirm: true, 'split-panels': true}"
          />
        
        <Button type="primary" icon="ios-search" @click="getUserSearch()" style="margin-left: 10px;">搜索</Button>
      </div>
    </div>
    <div ref="dom" class="charts chart-bar"></div>

    <myTable ref="listTable" :listConf="listConf" :no-search="true" >
    </myTable>
  </div>
</template>

<script>
import Util from '@/libs/util'
import myTable from '@/view/includes/myTable'
import echarts from "echarts";
import tdTheme from "@/components/charts/theme.json";
import { on, off, getDate } from "@/libs/tools";

echarts.registerTheme("tdTheme", tdTheme);

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
        url: '/adminapi/manageStatics/userList',
        searchParams: {
        },
        item: [],
        columns: [
          {title: '日期', align: 'center', minWidth: 100, key: 'date'},
          {title: '新增人数', align: 'center', minWidth: 100, key: 'new_user_num'},
          {title: '累计人数', align: 'center', minWidth: 100, key: 'all_total_user'},
          {title: '新增月 VIP 数', align: 'center', minWidth: 100, key: 'new_vip_month_user_num'},
          {title: '新增年 VIP 数', align: 'center', minWidth: 100, key: 'new_vip_year_user_num'},
          {title: '累计 VIP 数', align: 'center', minWidth: 100, key: 'all_vip_total_user'},
        ]
      }
    }
  },
  methods: {
    resize() {
      this.dom.resize()
    },
    getStatics () {
      var _this = this;
      Util.ajax({
        url: '/adminapi/manageStatics/userManage',
        method: 'get',
        success: function (result) {
          if (result.error == 0) {
            _this.statics = result.result;
          } else {
            _this.$Notice.error({title: '提示', desc: result.info})
          }
        }
      })
    },
    getSearchDate () {
      if (this.searchMode == 'fast') {
        var date = this.getDate(this.fastType);
      } else {
        var date = this.searchDate;
      }

      return date;
    },
    getUserSearch () {
      var _this = this;

      var date = this.getSearchDate();

      Util.ajax({
        url: '/adminapi/manageStatics/userSearch',
        method: 'get',
        data: {type: this.type, date: date},
        success: function (result) {
          if (result.error == 0) {
            var datas = result.result;
            var field = datas.field;
            var data = datas.data;
            _this.echarts(field, data);
          } else {
            _this.$Notice.error({title: '提示', desc: result.info})
          }
        }
      })
    },
    echarts(field, data) {
      let option = {
        xAxis: {
          type: 'category',
          data: field
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: data,
          type: 'line'
        }]
      };

      this.dom = echarts.init(this.$refs.dom, "tdTheme");
      this.dom.setOption(option);
      on(window, "resize", this.resize);
    },
    getDate (type) {
      var date = [];
      // 获取当前时间戳
      var currentTimestamp = (new Date()).valueOf() + "";
      currentTimestamp = parseInt(currentTimestamp.substring(0, 10))

      var yestoday = currentTimestamp - 86400;

      var endDate = getDate(yestoday, 'date');

      if (type == 'week') {
        var startTimestamp = yestoday - (86400 * 6)
        var startDate = getDate(startTimestamp, 'date')
      } else if (type == 'two') {
        var startTimestamp = yestoday - (86400 * 13)
        var startDate = getDate(startTimestamp, 'date')
      } else if (type == 'month') {
        var startTimestamp = yestoday - (86400 * 29)
        var startDate = getDate(startTimestamp, 'date')
      } else {
        var startTimestamp = yestoday - (86400 * 6)
        var startDate = getDate(startTimestamp, 'date')
      }
      date.push(startDate);
      date.push(endDate);
      
      return date;
    }
  },
  created: function () {
    var _this = this;
    this.searchDate = _this.getDate();
    _this.getStatics();

    this.getUserSearch();
  },
  mounted: function () {
    this.echarts();
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
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
