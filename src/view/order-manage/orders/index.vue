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
            {title: '家政服务内容', align: 'center', width: 120, key: 'server_content'},
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
              width: 100,
              fixed: 'right',
              render: (h, params) => {
                let btn = [];

                if (params.row.order_status == 'geted') {
                  btn.push(
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small',
                        icon: 'md-settings'
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
                    })
                  )
                }
                // btn.push(
                //   h('Button', {
                //     props: {
                //       type: 'primary',
                //       size: 'small',
                //       icon: 'md-brush'
                //     },
                //     style: {
                //       marginRight: '5px',
                //       marginBottom: '5px'
                //     },
                //     on: {
                //       click: () => {
                //         var id = params.row.id
                //         this.jumpPage('/orderManage/orders/show/' + id)
                //       }
                //     }
                //   })
                // );

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
</style>
