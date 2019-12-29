<template lang="html">
  <div class="activities-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索活动名" ></Input>
        </Form-item>
      </template>
      <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/activityManage/add' })"><Icon type="plus-round"></Icon>活动添加</Button>
      </template>
    </myTable>
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
      currentRow: {},
      listConf: {
        url: '/adminapi/activities',
        searchParams: {
          name: '',
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '活动名称', align: 'center', width: 200, key: 'name'},
          {title: '状态', align: 'center', width: 100, key: 'status_name'},
          {title: '签到码', align: 'center', width: 100, key: 'sign_code'},
          {title: '开始时间', align: 'center', width: 100, key: 'start_at'},
          {title: '结束时间', align: 'center', width: 100, key: 'end_at'},
          {title: '线下可报名人数', align: 'center', width: 120, key: 'offline_join_num'},
          {title: '线下已报名人数', align: 'center', width: 120, key: 'offline_joined_num'},
          {title: '线上可报名人数', align: 'center', width: 100, key: 'online_join_num'},
          {title: '线上已报名人数', align: 'center', width: 100, key: 'online_joined_num'},
          {title: '线下报名截止时间', align: 'center', width: 120, key: 'offline_join_end_at'},
          {title: '线上报名截止时间', align: 'center', width: 120, key: 'online_join_end_at'},
          {title: '线下费用', align: 'center', minWidth: 150, key: 'offline_charge', render: (h, params) => {
            var text = '';
            if (params.row.is_offline_charge) {
              text = params.row.offline_money;
            } else {
              text = '免费'
            }
            return h('span', text);
          }},
          {title: '线上费用', align: 'center', minWidth: 150, key: 'online_charge', render: (h, params) => {
            var text = '';
            if (params.row.is_online_charge) {
              text = params.row.online_money;
            } else {
              text = '免费'
            }
            return h('span', text);
          }},
          {title: 'VIP 线下费用', align: 'center', minWidth: 150, key: 'vip_offline_charge', render: (h, params) => {
            var text = '';
            if (params.row.is_vip_offline_charge) {
              text = params.row.vip_offline_money;
            } else {
              text = '免费'
            }
            return h('span', text);
          }},
          {title: 'VIP 线上费用', align: 'center', minWidth: 150, key: 'online_charge', render: (h, params) => {
            var text = '';
            if (params.row.is_vip_online_charge) {
              text = params.row.vip_online_money;
            } else {
              text = '免费'
            }
            return h('span', text);
          }},
          {title: '浏览量', align: 'center', width: 100, key: 'view_num'},
          { title: '推荐',
            key: 'is_recommend',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    value: params.row.is_recommend,
                    size: 'large',
                    'true-value': 1,
                    'false-value': 0
                  },
                  on: {
                    'on-change': (is_recommend) => {
                      var _this = this
                      var id = params.row.id
                      _this.setRecommend(id, is_recommend)
                    }
                  }
                })
              ])
            }
          },
          {title: '排序', align: 'center', width: 80, key: 'sort_order'},
          {title: '添加时间', align: 'center', width: 180, key: 'created_at'},
          {title: '操作',
            key: 'action',
            align: 'center',
            width: 150,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-contacts'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/activityManage/user/' + id)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-brush'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/activityManage/edit/' + id)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'md-close'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.deleteConf(id)
                    }
                  }
                })
              ])
            }
          }
        ]
      },
      deleteId: 0
    }
  },
  methods: {
    selectRow: function (index) {
      this.currentRow = index
    },
    searchReset: function (originParams) {
      this.listConf.searchParams = Util.extend(this.listConf.searchParams, originParams)
    },
    jumpPage: function (path) {
      this.$router.push(path)
    },
    deleteConf: function (id) {
      var _this = this
      _this.$Modal.confirm({
        title: '提示',
        content: '确定删除吗？删除之后不可恢复!',
        onOk: function () {
          _this.activityDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    activityDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/activities/' + id,
        method: 'DELETE',
        success: function (result) {
          if (result.error == 0) {
            _this.$Notice.success({ title: '提示', desc: '删除成功' })
            _this.$refs.listTable.listLoad()
          } else {
            _this.$Notice.error({ title: '提示', desc: result.info })
          }
        }
      })
    },
    setStatus (id, status) {
      var _this = this

      Util.ajax({
        url: '/adminapi/activities/' + id + '/setStatus',
        method: 'patch',
        data: {status: status},
        success: function (result) {
          if (result.error == 0) {
            _this.$Notice.success({title: '提示', desc: '操作成功'})
            _this.$refs.listTable.listLoad()
          } else {
            _this.$Notice.error({title: '提示', desc: result.info})
          }
        }
      })
    },
    setRecommend (id, is_recommend) {
      var _this = this

      Util.ajax({
        url: '/adminapi/activities/' + id + '/setRecommend',
        method: 'patch',
        data: {is_recommend: is_recommend},
        success: function (result) {
          if (result.error == 0) {
            _this.$Notice.success({title: '提示', desc: '操作成功'})
            _this.$refs.listTable.listLoad()
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

<style lang="css">
</style>
