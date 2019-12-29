<template lang="html">
  <div class="coupon-types-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索优惠券名" ></Input>
        </Form-item>
      </template>
      <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/couponManage/add' })"><Icon type="plus-round"></Icon>优惠券添加</Button>
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
      teachers: [],
      tags: [],
      listConf: {
        url: '/adminapi/couponTypes',
        searchParams: {
          name: '',
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '优惠券名称', align: 'center', width: 200, key: 'name'},
          {title: '领取类型', align: 'center', width: 100, key: 'get_type_name'},
          {title: '类型', align: 'center', width: 120, key: 'type_name'},
          {title: '适用类型', align: 'center', width: 100, key: 'apply_type_name'},
          {title: '金额', align: 'center', width: 120, key: 'money'},
          {title: '满足金额', align: 'center', width: 120, key: 'full_money'},
          {title: '发放数量', align: 'center', width: 120, key: 'send_num'},
          {title: '已发放数量', align: 'center', width: 120, key: 'sended_num'},
          {title: '开始发放时间', align: 'center', width: 120, key: 'start_send_at'},
          {title: '结束发放时间', align: 'center', width: 120, key: 'end_send_at'},
          {title: '有效天数', align: 'center', width: 100, key: 'expire_days'},
          {title: '添加时间', align: 'center', width: 180, key: 'created_at'},
          {title: '操作',
            key: 'action',
            align: 'center',
            width: 170,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-list-box'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/couponManage/coupons/' + id)
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
                      this.jumpPage('/couponManage/edit/' + id)
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
          _this.couponTypeDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    couponTypeDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/couponTypes/' + id,
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
    }
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
