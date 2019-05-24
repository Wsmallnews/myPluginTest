<template lang="html">
  <div class="users-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索用户名" ></Input>
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
      categorys: [],
      listConf: {
        url: '/adminapi/users',
        searchParams: {
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '用户名', align: 'center', width: 200, key: 'name'},
          {title: '头像', align: 'center', key: 'cat_name',
            width: 180,
            render: (h, params) => {
              if (params.row.avatar != null && params.row.avatar != '') {
                return h('div', [
                  h('img', {
                    attrs: {
                      src: params.row.avatar
                    },
                    style: {
                      width: '50px',
                      height: '50px',
                      marginTop: '5px'
                    }
                  })
                ])
              }
            }},
          {title: '手机号', align: 'center', width: 200, key: 'phone'},
          {title: '余额', align: 'center', width: 200, key: 'money'},
          {title: '提现总金额', align: 'center', width: 200, key: 'money_cash_total'},
          {title: '添加时间', align: 'center', width: 200, key: 'created_at'},
          {title: '操作',
            key: 'action',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (h, params) => {
              let btn = [];

              btn.push(
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-cash'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/userManage/walletLogs/' + id)
                    }
                  }
                })
              )
              return h('div', btn)
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
