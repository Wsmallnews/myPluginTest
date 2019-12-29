<template lang="html">
  <div class="coupons-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索用户名称" ></Input>
        </Form-item>
        <Form-item prop="phone">
          <Input type="text" v-model="listConf.searchParams.phone" placeholder="搜索手机号" ></Input>
        </Form-item>
        <Form-item prop="type">
          <Select style="width:200px" v-model="listConf.searchParams.type" clearable placeholder="状态">
            <Option label="待使用" value="useable" ></Option>
            <Option label="已使用" value="used" ></Option>
            <Option label="已失效" value="invalid" ></Option>
          </Select>
        </Form-item>
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
        url: '/adminapi/coupons',
        searchParams: {
          coupon_type_id: this.$route.params.coupon_type_id,
          name: '',
          phone: '',
          type: '',
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '用户名称', align: 'center', width: 120, key: 'user_name',
            render: (h, params) => {
              if (params.row.user != null) {
                return h('span', params.row.user.name)
              }
            }},
          {title: '手机号', align: 'center', width: 120, key: 'max_num',
            render: (h, params) => {
              if (params.row.user != null) {
                return h('span', params.row.user.phone)
              }
            }},
          {title: '优惠券名称', align: 'center', width: 200, key: 'coupon_name'},
          {title: '类型', align: 'center', width: 100, key: 'coupon_type_name'},
          {title: '适用类型', align: 'center', width: 100, key: 'apply_type_name'},
          {title: '金额', align: 'center', width: 80, key: 'money'},
          {title: '满足金额', align: 'center', width: 100, key: 'full_money'},
          {title: '使用状态', align: 'center', minWidth: 120, key: 'status_name'},
          {title: '过期时间', align: 'center', width: 180, key: 'expired_at'},
          {title: '领取时间', align: 'center', width: 180, key: 'created_at'},
          {title: '操作',
            key: 'action',
            align: 'center',
            width: 80,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
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
          _this.couponDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    couponDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/coupons/' + id,
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
