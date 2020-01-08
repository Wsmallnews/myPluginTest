<template lang="html">
  <div class="admin-logs-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
      <template slot="formItem">
        <Form-item prop="order_sn">
          <Input type="text" v-model="listConf.searchParams.order_sn" placeholder="搜索订单号"></Input>
        </Form-item>
        <Form-item prop="user_name">
          <Input type="text" v-model="listConf.searchParams.user_name" placeholder="搜索用户名"></Input>
        </Form-item>
        <Form-item prop="type">
          <Select v-model="listConf.searchParams.type" placeholder="搜索订单类型">
            <Option v-for="item in typeAll" :value="item.value" :key="item.value">{{ item.name }}</Option>
          </Select>
        </Form-item>
        <Form-item prop="order_status">
          <Select v-model="listConf.searchParams.order_status" placeholder="搜索订单状态">
            <Option v-for="item in orderStatusAll" :value="item.value" :key="item.value">{{ item.name }}</Option>
          </Select>
        </Form-item>
      </template>
    </myTable>

    <Modal v-model="orderDetailShow" :closable="true" :mask-closable=false :width="700">
      <h3 slot="header" style="color:#2D8CF0">订单详情</h3>
      <div v-if="orderDetail.order_sn">
        <Row >
          <Col span="6" class="row-label">订单状态：</Col>
          <Col span="18" class="row-content">{{ orderDetail.order_status_name }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">订单号：</Col>
          <Col span="18" class="row-content">{{ orderDetail.order_sn }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">用户昵称：</Col>
          <Col span="18" class="row-content">
            {{ orderDetail.user != null ? orderDetail.user.name + '-' + orderDetail.user.phone  : '' }}
          </Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">订单类型：</Col>
          <Col span="18" class="row-content">{{ orderDetail.type_name }}</Col>
        </Row>
        <Row v-if="orderDetail.image">
          <Col span="6" class="row-label">图片：</Col>
          <Col span="18" class="row-content">
            <img class="detail-images" :src="orderDetail.image" @click="showBigImg(orderDetail.image)" />
          </Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">订单总金额：</Col>
          <Col span="18" class="row-content">{{ orderDetail.total_money }}</Col>
        </Row>

        <Row>
          <Col span="6" class="row-label">支付总金额：</Col>
          <Col span="18" class="row-content">{{ orderDetail.wechat_fee }}</Col>
        </Row>

        <Row>
          <Col span="6" class="row-label">优惠总金额：</Col>
          <Col span="18" class="row-content">{{ orderDetail.discount_fee }}</Col>
        </Row>


        <Row>
          <Col span="6" class="row-label">支付时间：</Col>
          <Col span="18" class="row-content">{{ orderDetail.payed_at }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">创建时间：</Col>
          <Col span="18" class="row-content">{{ orderDetail.created_at }}</Col>
        </Row>
      </div>
    </Modal>

    <Modal v-model="bigImgShow" :closable="true" :mask-closable="true" :footer-hide="true" width="700">
      <img :src="bigImg" style="width: 670px;margin-top: 30px;" alt="">
    </Modal>
  </div>
</template>

<script>
  import Util from '@/libs/util';
  import myTable from '@/view/includes/myTable';

  export default {
    components: {
      myTable
    },
    data () {
      return {
        currentRow:{},
        typeAll: [],
        orderStatusAll: [],
        saveLoading: false,
        orderDetailShow: false,
        orderDetail: {},
        bigImg: '',
        bigImgShow: false,
        listConf: {
          url: "/adminapi/orders",
          searchParams: {
            order_sn: "",
            user_name: "",
            type: "",
            order_status: ""
          },
          rowClass: [
            {name: 'order_status',value: 'geted', type: 'warning'}
          ],
          item: [],
          columns: [
            {type: 'index', align: 'center', width:100, fixed: 'left'},
            {title: '订单号', align: 'center', width: 170, key: 'order_sn'},
            {title: 'UID', align: 'center', width: 80, key: 'user_id'},
            {title: '用户名', align: 'center', width: 120, key: 'user_name', render:(h, params)=>{
              return params.row.user ? h('span', params.row.user.name) : h('span', '');
            }},
            {title: '手机号', align: 'center', width: 120, key: 'user_phone', render:(h, params)=>{
              return params.row.user ? h('span', params.row.user.phone) : h('span', '');
            }},
            {title: '是否 VIP', align: 'center', width: 120, key: 'user_vip', render:(h, params)=>{
              return params.row.user ? h('span', (params.row.user.is_vip_name)) : h('span', '');
            }},
            {title: '类型', align: 'center', width: 100, key: 'type_name'},
            {title: '订单内容', align: 'center', width: 150, key: 'subject'},
            {title: '订单状态', align: 'center', width: 100, key: 'order_status_name'},
            {title: '订单总金额', align: 'center', width: 100, key: 'total_money'},
            {title: '支付总金额', align: 'center', width: 100, key: 'wechat_fee'},
            {title: '优惠总金额', align: 'center', width: 100, key: 'discount_fee'},
            {title: '支付时间', align: 'center', width: 180, key: 'pay_at'},
            {title: '添加时间', align: 'center', width: 180, key: 'created_at'},
            {title: '操作',
              key: 'action',
              align: 'center',
              width: 80,
              fixed: 'right',
              render: (h, params) => {
                let btn = [];
                btn.push(
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'md-eye'
                    },
                    style: {
                      marginRight: '5px',
                      marginBottom: '5px'
                    },
                    on: {
                      click: () => {
                        this.orderDetail = params.row;
                        this.orderDetailShow = true;
                      }
                    }
                  })
                );

                return h('div', btn)
              }
            }
          ]
        }
      }
    },
    methods: {
      selectRow: function(index){
        this.currentRow = index;
      },
      searchReset: function (originParams) {
        this.listConf.searchParams = Util.extend(this.listConf.searchParams, originParams);
      },
      jumpPage: function (path) {
        this.$router.push(path);
      },
      cancel: function () {
        this.assignShow = false;
        this.assignForm.salesman_id = 0;
      },
      assign () {
        var _this = this;
        _this.$refs['assignForm'].validate((valid) => {
          if (valid) {

            if (this.assignForm.type == 'choose' && this.assignForm.salesman_id == 0) {
              _this.$Notice.error({
                title: '提示',
                desc: "请选择业务员"
              });
              return false
            }
            _this.saveLoading = true;
            Util.ajax({
              url: '/adminapi/orders/'+ _this.assignForm.id +'/assign',
              method: 'patch',
              data: {salesman_id: this.assignForm.salesman_id, type: this.assignForm.type},
              success: function(result) {
                _this.saveLoading = false;
                if (result.error == 0) {
                  _this.$Notice.success({
                    title: '提示',
                    desc: "指派成功"
                  });
                  _this.cancel();
                  _this.$refs.listTable.listLoad();
                } else {
                  _this.$Notice.error({
                    title: '提示',
                    desc: result.info
                  });
                }
              }
            })
          }
        });
      },
      showBigImg (src) {
        this.bigImg = src;
        this.bigImgShow = true;
      }
    },
    created: function () {
      var _this = this;
      Util.ajax({
        url: "/adminapi/orders/typeAll",
        method: 'get',
        success: function(result){
          if (result.error == 0) {
            _this.typeAll = result.result;
          }
        }
      });

      Util.ajax({
        url: "/adminapi/orders/orderStatusAll",
        method: 'get',
        success: function(result){
          if (result.error == 0) {
            _this.orderStatusAll = result.result;
          }
        }
      });
    },
    mounted: function (){
    },
  }
</script>

<style lang="css">
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
