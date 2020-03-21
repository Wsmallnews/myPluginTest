<template lang="html">
  <div class="gift-logs-index">
    <Alert type="info" show-icon v-if="giftLog.id">
      <h4 >合计：共{{ giftLog.num }}个兑换码，当前已使用{{ giftLog.receive_num }}个，未使用{{ giftLog.num - giftLog.invalid_num - giftLog.receive_num }}个，已失效{{ giftLog.invalid_num }}个</h4>
      <span >备注：{{giftLog.remark}}</span>

    </Alert>

    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" :noSearch="true">
       <template slot="formBtn" >
        <Button type="primary" @click="exportData"><Icon type="plus-round"></Icon>导出兑换码</Button>
        <Button type="primary" @click="setInvalid"><Icon type="plus-round"></Icon>设为失效</Button>
      </template>
    </myTable>

    <Modal v-model="showDetail" :closable="true" :mask-closable=false width="90%">
      <userInfo :user="detail"></userInfo>
    </Modal>
  </div>
</template>

<script>
  import Util from '@/libs/util';
  import myTable from '@/view/includes/myTable';
  import userInfo from '@/view/user-manage/includes/userInfo'

  export default {
    components: {
      myTable,
      userInfo
    },
    data () {
      return {
        showDetail: false,
        detail: {},
        currentRow:{},
        giftLog: {},
        listConf: {
          url: "/adminapi/giftLogs/userGift/" + this.$route.params.gift_log_id,
          searchParams: {
          },
          item: [],
          columns: [
            {type: 'index', align: 'center', width:100, fixed: 'left'},
            {title: '兑换码', align: 'center', width: 150, key: 'gift_code'},
            {title: '使用状态', align: 'center', width: 100, key: 'status_name'},
            {title: '兑换人', align: 'center', minWidth: 180, key: 'receive_name', render:(h, params)=>{
              return params.row.receive ? h('span', params.row.receive.name + '-' + params.row.receive.phone) : h('span', '');
            }},
            {title: '兑换时间', align: 'center', width: 150, key: 'received_at'},
            {title: '失效时间', align: 'center', width: 150, key: 'invalid_at', render: (h, params) => {
              return params.row.invalid_at == null ? h('span', '未失效') : h('span', params.row.invalid_at);
            }},
            {title: '操作',
              key: 'action',
              align: 'center',
              width: 80,
              fixed: 'right',
              render: (h, params) => {
                let btn = [];
                if (params.row.received_at != null) {
                  btn.push(
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small',
                        icon: 'md-eye'
                      },
                      domProps: {
                        title: '查看用户信息',
                      },
                      style: {
                        marginRight: '5px',
                        marginBottom: '5px'
                      },
                      on: {
                        click: () => {
                          this.detail = params.row.receive;
                          this.showDetail = true;
                        }
                      }
                    }),
                  );
                }
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
      setInvalid () {
        var _this = this;
        if (!this.currentRow.id) {
          this.$Notice.error({
            title: '提示',
            desc: "请先选择一条记录"
          });
          return false;
        }

        if (this.currentRow.invalid_at != null) {
          this.$Notice.error({
            title: '提示',
            desc: "当前记录已失效，不需要重复设置"
          });
          return false;
        }

        _this.$Modal.confirm({
          title: '提示',
          content: '确定要将记录设为失效吗？',
          onOk: function () {
            Util.ajax({
              url: '/adminapi/giftLogs/'+ _this.currentRow.id +'/invalidUserLog',
              method: 'patch',
              success: function(result) {
                if (result.error == 0) {
                  _this.$Notice.success({
                    title: '提示',
                    desc: "处理成功"
                  });
                  _this.$refs.listTable.listLoad();
                } else {
                  _this.$Notice.error({
                    title: '提示',
                    desc: result.info
                  });
                }
              }
            })
          },
          onCancel: function () {
            _this.$Notice.error({ title: '提示', desc: '操作取消' })
          }
        })
      },
      exportData () {
        this.$refs.listTable.exportCsv({
          isAll: true,
          columnsCB: function (item, index, columns) {
            return index > 0 && index < 6;
          },
          dataCB: function (item, index, data) {
            item.receive_name = item.receive ? item.receive.name + '-' + item.receive.phone : '';
            item.invalid_at = item.invalid_at == null ? '未失效' : item.invalid_at;
            return item;
          },
        });
      }
    },
    created: function () {
      var _this = this;

      if (_this.$route.params.gift_log_id != undefined) {
        Util.ajax({
          url: '/adminapi/giftLogs/' + _this.$route.params.gift_log_id,
          method: 'get',
          success: function(result) {
            if (result.error == 0) {
              _this.giftLog = result.result
              
            } else {
              _this.$Notice.error({
                title: '提示',
                desc: result.info
              })
            }
          }
        })
      }
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
