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

    <Modal v-model="assignShow" :closable='false' :mask-closable=false :width="400">
      <h3 slot="header" style="color:#2D8CF0">派单</h3>
      <Form ref="assignForm" :model="assignForm" :label-width="100" label-position="right" :rules="assignValidate">
        <Form-item label="选择业务员" prop="type">
          <RadioGroup v-model="assignForm.type">
            <Radio label="auto">自动分配</Radio>
            <Radio label="choose">手动选择</Radio>
          </RadioGroup>
        </Form-item>

        <Form-item label="选择业务员" prop="salesman_id">
          <Select v-model="assignForm.salesman_id" :disabled="assignForm.type == 'auto'" >
            <Option v-for="item in salesmans" :disabled="!item.is_bind_wechat" :value="item.id" :key="item.id">{{ item.name }}-{{item.is_bind_wechat_name}}-{{item.distance_for}}</Option>
          </Select>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" :loading="saveLoading" @click="assign">派单</Button>
      </div>
    </Modal>

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
          <Col span="18" class="row-content">{{ orderDetail.user != null ? orderDetail.user.name : '' }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">业务员昵称：</Col>
          <Col span="18" class="row-content">{{ orderDetail.salesman != null ? orderDetail.salesman.name : '' }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">订单类型：</Col>
          <Col span="18" class="row-content">{{ orderDetail.type_name }}</Col>
        </Row>
        <Row v-if="orderDetail.type == 'server'">
          <Col span="6" class="row-label">服务内容：</Col>
          <Col span="18" class="row-content">{{ orderDetail.server_content }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">图片：</Col>
          <Col span="18" class="row-content">
            <img class="detail-images" v-for="item in orderDetail.images_arr" :src="item" @click="showBigImg(item)" />
          </Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">收货信息：</Col>
          <Col span="18" class="row-content">
            {{ "收货人：" + orderDetail.consignee + "-手机号：" + orderDetail.phone}}<br/>
            {{ "省市区：" + orderDetail.province + " " + orderDetail.city + " " + orderDetail.district + (orderDetail.postcode != null ? " " + orderDetail.postcode : '')}}<br/>
            {{ "详细地址：" + orderDetail.address}}
          </Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">预约时间：</Col>
          <Col span="18" class="row-content">{{ orderDetail.apply_date }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">用户备注：</Col>
          <Col span="18" class="row-content">{{ orderDetail.desc }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">预约时间：</Col>
          <Col span="18" class="row-content">{{ orderDetail.apply_date }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">接单时间：</Col>
          <Col span="18" class="row-content">{{ orderDetail.ongoing_at }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">订单总金额：</Col>
          <Col span="18" class="row-content">{{ orderDetail.total_money }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">回收内容：</Col>
          <Col span="18" class="row-content">
            <div v-for="item in orderDetail.recover_content_arr">
              <template v-if="item.name">{{ item.name }}</template>
              <template v-if="item.value">&nbsp;&nbsp; {{ item.value }}</template>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">业务员备注：</Col>
          <Col span="18" class="row-content">{{ orderDetail.salesman_note }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">收货时间：</Col>
          <Col span="18" class="row-content">{{ orderDetail.geted_at }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">完成时间：</Col>
          <Col span="18" class="row-content">{{ orderDetail.finished_at }}</Col>
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
        salesmans: [],
        assignShow: false,
        assignForm: {
          id: 0,
          type: 'auto',
          salesman_id: 0
        },
        assignValidate: {
          // salesman_id: [
          //   { required: true, type: 'number', message: '请选择业务员', min: 1, trigger: 'change' }
          // ],
        },
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
            {title: '订单号', align: 'center', width: 150, key: 'order_sn'},
            {title: '用户名', align: 'center', width: 120, key: 'user_name', render:(h, params)=>{
              return params.row.user ? h('span', params.row.user.name) : h('span', '');
            }},
            {title: '接收员名', align: 'center', width: 120, key: 'salesman_name', render:(h, params)=>{
              return params.row.salesman ? h('span', params.row.salesman.name) : h('span', '');
            }},
            {title: '类型', align: 'center', width: 100, key: 'type_name'},
            {title: '家政服务内容', align: 'center', width: 120, key: 'server_content_s', render: (h, params) => {
              return params.row.type == 'server' ? h('span', params.row.server_content) : h('span', '');
            }},
            {title: '订单状态', align: 'center', width: 100, key: 'order_status_name'},
            {title: '订单金额', align: 'center', width: 100, key: 'total_money'},
            {title: '接单时间', align: 'center', width: 180, key: 'ongoing_at'},
            {title: '收货时间', align: 'center', width: 180, key: 'geted_at'},
            {title: '完成时间', align: 'center', width: 180, key: 'finished_at'},
            {title: '手机号', align: 'center', width: 120, key: 'phone'},
            {title: '收货人', align: 'center', width: 120, key: 'consignee'},
            {title: '地址', align: 'center', width: 250, key: 'region', render:(h, params)=>{
              return h('span', params.row.province + "-" + params.row.city + "-" + params.row.area);
            }},
            {title: '坐标', align: 'center', width: 150, key: 'lat_lng', render:(h, params)=>{
              return h('span', params.row.lat + "-" + params.row.lng);
            }},
            {title: '详细地址', align: 'center', width: 250, key: 'address'},
            {title: '预约时间', align: 'center', width: 180, key: 'apply_date'},
            {title: '添加时间', align: 'center', width: 180, key: 'created_at'},
            {title: '操作',
              key: 'action',
              align: 'right',
              width: 120,
              fixed: 'right',
              render: (h, params) => {
                let btn = [];

                if (params.row.order_status == 'geted') {
                  btn.push(
                    h('Button', {
                      props: {
                        type: 'warning',
                        size: 'small',
                      },
                      style: {
                        marginRight: '5px',
                        marginBottom: '5px'
                      },
                      on: {
                        click: () => {
                          var id = params.row.id
                          this.finishedConf(id, params.row)
                        }
                      }
                    }, '打款')
                  )
                }

                if (params.row.order_status == 'waitting') {
                  btn.push(
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small',
                      },
                      style: {
                        marginRight: '5px',
                        marginBottom: '5px'
                      },
                      on: {
                        click: () => {
                          var id = params.row.id;

                          // 获取业务员
                          this.getSalesmans(params.row);

                          this.assignForm.id = id;
                          this.assignShow = true;
                        }
                      }
                    }, '派单')
                  )
                }
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
      finishedConf: function (id, order) {
        var _this = this
        _this.$Modal.confirm({
          title: '提示',
          content: '确定完成订单吗？会将订单金额(' + order.total_money + ')直接打入用户余额!',
          onOk: function () {
            _this.finished(id)
          },
          onCancel: function () {
            _this.$Notice.error({ title: '提示', desc: '操作取消' })
          }
        })
      },
      finished (id) {
        var _this = this
        Util.ajax({
          url: '/adminapi/orders/' + id + '/finished',
          method: 'patch',
          success: function (result) {
            if (result.error == 0) {
              _this.$Notice.success({ title: '提示', desc: '操作成功' })
              _this.$refs.listTable.listLoad()
            } else {
              _this.$Notice.error({ title: '提示', desc: result.info })
            }
          }
        })
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
      getSalesmans (order) { // 获取业务员列表
        var _this = this;
        Util.ajax({
          url: '/adminapi/salesmans/all',
          method: 'get',
          data: {lat: order.lat, lng: order.lng},
          success: function(result) {
            if (result.error == 0) {
              _this.salesmans = result.result;
            } else {
              _this.$Notice.error({
                title: '提示',
                desc: result.info
              });
            }
          }
        })
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
