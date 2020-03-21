<template lang="html">
  <div class="user-info">
    <h3 slot="header" style="color:#2D8CF0">用户详情</h3>
    <div v-if="detail.id">
      <h3 slot="header" style="color:#2D8CF0">系统信息</h3>
      <Row >
        <Col span="6" class="row-label">UID：</Col>
        <Col span="18" class="row-content">{{ detail.id }}</Col>
      </Row>
      <Row >
        <Col span="6" class="row-label">姓名：</Col>
        <Col span="18" class="row-content">{{ detail.name }}</Col>
      </Row>
      <Row >
        <Col span="6" class="row-label">手机号：</Col>
        <Col span="18" class="row-content">{{ detail.phone }}</Col>
      </Row>
      <Row v-if="detail.is_vip">
        <Col span="6" class="row-label">VIP 到期时间：</Col>
        <Col span="18" class="row-content">{{ detail.vip_expired_at }}</Col>
      </Row>

      <Row>
        <Col span="6" class="row-label">是否讲师：</Col>
        <Col span="18" class="row-content">
          {{ detail.is_teach_name }}
          
        </Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">是否合伙人：</Col>
        <Col v-if="detail.is_partner" span="18" class="row-content">{{ detail.partner_type_name }}</Col>
        <Col v-else span="18" class="row-content">否</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">注册时间：</Col>
        <Col span="18" class="row-content">{{ detail.created_at }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">最近登录时间：</Col>
        <Col span="18" class="row-content">{{ detail.last_login_at }}</Col>
      </Row>
    </div>

    <div v-if="detail.id">
      <h3 slot="header" style="color:#2D8CF0">个人信息</h3>
      <Row v-if="detail.avatar">
        <Col span="6" class="row-label">头像：</Col>
        <Col span="18" class="row-content">
          <img class="detail-images" style="width: 100px;height: 100px;border-radius: 50%;" :src="detail.avatar" @click="showBigImg(detail.avatar)" />
        </Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">性别：</Col>
        <Col span="18" class="row-content">{{ detail.sex_name }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">生日：</Col>
        <Col span="18" class="row-content">{{ detail.birth }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">所在地：</Col>
        <Col span="18" class="row-content">{{ detail.province }} {{ detail.city }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">工作年限：</Col>
        <Col span="18" class="row-content">{{ detail.work }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">行业：</Col>
        <Col span="18" class="row-content">{{ detail.industry }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">职务：</Col>
        <Col span="18" class="row-content">{{ detail.job }}</Col>
      </Row>
      <!-- <Row>
        <Col span="6" class="row-label">提升技能：</Col>
        <Col span="18" class="row-content">{{ detail.skill }}</Col>
      </Row> -->
      <Row>
        <Col span="6" class="row-label">自我介绍：</Col>
        <Col span="18" class="row-content">{{ detail.intro }}</Col>
      </Row>
    </div>

    <div v-if="!getMoreIng && moreDetail.id">
      <h3 slot="header" style="color:#2D8CF0">互动信息</h3>
      <Row>
        <Col span="6" class="row-label">分享次数：</Col>
        <Col span="18" class="row-content">{{ moreDetail.share_num }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">留言次数：</Col>
        <Col span="18" class="row-content">{{ moreDetail.comment_num }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">留言精选次数：</Col>
        <Col span="18" class="row-content">{{ moreDetail.comment_quality_num }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">留言删除次数：</Col>
        <Col span="18" class="row-content">{{ moreDetail.comment_delete_num }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">登录次数：</Col>
        <Col span="18" class="row-content">{{ moreDetail.login_num }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">累计登录时长：</Col>
        <Col span="18" class="row-content">{{ moreDetail.login_time_for }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">学习次数：</Col>
        <Col span="18" class="row-content">{{ moreDetail.study_num }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">获得优惠券金额：</Col>
        <Col span="18" class="row-content">{{ moreDetail.coupon_money }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">已使用优惠券金额：</Col>
        <Col span="18" class="row-content">{{ moreDetail.use_coupon_money }}</Col>
      </Row>
    </div>

    <div v-if="!getMoreIng && moreDetail.id">
      <h3 slot="header" style="color:#2D8CF0">付费信息</h3>
      <Row>
        <Col span="6" class="row-label">付费总金额：</Col>
        <Col span="18" class="row-content">{{ moreDetail.total_money }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">付费次数：</Col>
        <Col span="18" class="row-content">{{ moreDetail.pay_num }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">首次付费时间：</Col>
        <Col span="18" class="row-content">{{ moreDetail.first_payed_at }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">最近一次付费时间：</Col>
        <Col span="18" class="row-content">{{ moreDetail.last_payed_at }}</Col>
      </Row>
      <Row>
        <Col span="6" class="row-label">付费明细：</Col>
      </Row>
      <Row v-if="moreDetail.orders">
        <Col span="24" class="row-content">
          <Table
            :highlight-row="true"
            :stripe="true"
            :columns="orderColumns"
            :data="moreDetail.orders"
            >
          </Table>
        </Col>
      </Row>
    </div>

    <Modal v-model="bigImgShow" :closable="true" :mask-closable="true" :footer-hide="true" width="700">
      <img :src="bigImg" style="width: 670px;margin-top: 30px;" alt="">
    </Modal>
  </div>
</template>

<script>
import Util from '@/libs/util'

export default {
  props: {
    user: {
      default: {}
    },
  },
  data () {
    return {
      moreDetail: {},
      getMoreIng: false,
      bigImgShow: false,
      bigImg: '',
      orderColumns: [
        {title: '订单号', align: 'center', width: 120, key: 'order_sn'},
        {title: '流水号', align: 'center', width: 150, key: 'transaction_id'},
        {title: '类型', align: 'center', width: 150, key: 'type_name'},
        {title: '名称', align: 'center', width: 150, key: 'subject'},
        {title: '订单总金额', align: 'center', width: 80, key: 'total_money'},
        {title: '支付金额', align: 'center', width: 80, key: 'wechat_fee'},
        {title: '支付时间', align: 'center', width: 150, key: 'payed_at'},
      ],
    }
  },
  computed: {
    detail () {
      return this.user;
    }
  },
  watch: {
    user (val) {
      if (val.id) {
        this.getMoreDetail(this.user.id);
      }
    }
  },
  methods: {
    showBigImg (src) {
      this.bigImg = src;
      this.bigImgShow = true;
    },
    getMoreDetail (user_id) {
      var _this = this;
      _this.getMoreIng = true;
      Util.ajax({
        url: '/adminapi/userStatics/' + user_id,
        method: 'get',
        success: function (result) {
          _this.getMoreIng = false;
          if (result.error == 0) {
            _this.moreDetail = result.result;
          } else {
            _this.$Notice.error({title: '提示', desc: result.info})
          }
        }
      })
    },
  },
  created: function () {
    var _this = this
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
</style>
