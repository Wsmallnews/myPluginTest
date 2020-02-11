<template lang="html">
  <div class="partners-statics">
    <Row>
        <Col span="6" >
          <div class="col-div" style="background-color: #2db7f5">
            <div class="title">合伙人人数</div>
            <div class="first">{{ statics.partner_num.partner_num }}</div>
            <div class="second">初级合伙人：{{ statics.partner_num.partner_one_num }}</div>
            <div class="second">中级合伙人：{{ statics.partner_num.partner_two_num }}</div>
            <div class="second">高级合伙人：{{ statics.partner_num.partner_three_num }}</div>
          </div>
        </Col>
        <Col span="6">
          <div class="col-div" style="background-color: #ff9900">
            <div class="title">合伙人粉丝数</div>
            <div class="first">{{ statics.partner_fans_money.partner_fans_money }}</div>
            <div class="second">昨日新增：{{ statics.partner_fans_money.partner_yestoday_fans_money }}</div>
            <div class="second">7日新增：{{ statics.partner_fans_money.partner_seven_fans_money }}</div>
            <div class="second">30日新增：{{ statics.partner_fans_money.partner_month_fans_money }}</div>
          </div>
        </Col>
        <Col span="6">
          <div class="col-div" style="background-color: #2d8cf0">
            <div class="title">粉丝总收益(元)</div>
            <div class="first">{{ statics.partner_fans_num.partner_fans_num }}</div>
            <div class="second">昨日新增：{{ statics.partner_fans_num.partner_yestoday_fans_num }}</div>
            <div class="second">7日新增：{{ statics.partner_fans_num.partner_seven_fans_num }}</div>
            <div class="second">30日新增：{{ statics.partner_fans_num.partner_month_fans_num }}</div>
          </div>
        </Col>
        <Col span="6">
          <div class="col-div" style="background-color: #ed4014">
            <div class="title">粉丝升VIP人数</div>
            <div class="first">{{ statics.partner_become_vip_num.partner_become_vip_num }}</div>
            <div class="second">昨日新增：{{ statics.partner_become_vip_num.partner_yestoday_become_vip_num }}</div>
            <div class="second">7日新增：{{ statics.partner_become_vip_num.partner_seven_become_vip_num }}</div>
            <div class="second">30日新增：{{ statics.partner_become_vip_num.partner_month_become_vip_num }}</div>
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
        url: '/adminapi/partners/statics',
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
