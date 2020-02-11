<template lang="html">
  <div class="partners-statics">
    <Row v-if="statics.total != undefined">
      <Col span="6" >
        <div class="col-div" style="background-color: #2db7f5">
          <div class="title">合计发放量</div>
          <div class="first">￥{{ statics.total.total_money }}</div>
          <div class="second">薪活动：￥{{ statics.total.activity_total_money }}</div>
          <div class="second">薪商学：￥{{ statics.total.business_total_money }}</div>
          <div class="second">薪课程：￥{{ statics.total.classroom_total_money }}</div>
        </div>
      </Col>
      <Col span="6">
        <div class="col-div" style="background-color: #ff9900">
          <div class="title">合计使用量</div>
          <div class="first">￥{{ statics.use_total.total_money }}</div>
          <div class="second">薪活动：￥{{ statics.use_total.activity_total_money }}</div>
          <div class="second">薪商学：￥{{ statics.use_total.business_total_money }}</div>
          <div class="second">薪课程：￥{{ statics.use_total.classroom_total_money }}</div>
        </div>
      </Col>
      <Col span="6">
        <div class="col-div" style="background-color: #2d8cf0">
          <div class="title">合计待使用量</div>
          <div class="first">￥{{ statics.unuse_total.total_money }}</div>
          <div class="second">薪活动：￥{{ statics.unuse_total.activity_total_money }}</div>
          <div class="second">薪商学：￥{{ statics.unuse_total.business_total_money }}</div>
          <div class="second">薪课程：￥{{ statics.unuse_total.classroom_total_money }}</div>
        </div>
      </Col>
      <Col span="6">
        <div class="col-div" style="background-color: #ed4014">
          <div class="title">已过期量</div>
          <div class="first">￥{{ statics.expired_total.total_money }}</div>
          <div class="second">薪活动：￥{{ statics.expired_total.activity_total_money }}</div>
          <div class="second">薪商学：￥{{ statics.expired_total.business_total_money }}</div>
          <div class="second">薪课程：￥{{ statics.expired_total.classroom_total_money }}</div>
        </div>
      </Col>
    </Row>

    <Row v-if="statics.use_percent != undefined">
      <Col span="12" >
        <div class="col-div" style="background-color: #2db7f5">
          <div class="title">合计使用率</div>
          <div class="first">{{ statics.use_percent.total_percent }}</div>
          <div class="second">薪活动使用率：{{ statics.use_percent.activity_total_percent }}</div>
          <div class="second">薪商学使用率：{{ statics.use_percent.business_total_percent }}</div>
          <div class="second">薪课堂使用率：{{ statics.use_percent.classroom_total_percent }}</div>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import Util from '@/libs/util'
import myTable from '@/view/includes/myTable'

export default {
  components: {
    myTable
  },
  data () {
    return {
      statics: []
    }
  },
  methods: {
    getStatics () {
      var _this = this;
      Util.ajax({
        url: '/adminapi/manageStatics/couponManage',
        method: 'get',
        success: function (result) {
          if (result.error == 0) {
            _this.statics = result.result;
          } else {
            _this.$Notice.error({title: '提示', desc: result.info})
          }
        }
      })
    }
  },
  created: function () {
    var _this = this
    _this.getStatics();
  },
  mounted: function () {
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
</style>
