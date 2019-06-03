<template lang="html">
  <div class="admins-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
      <template slot="formItem" >
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索业务员名" ></Input>
        </Form-item>
      </template>
      <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/salesmanManage/salesmans/add' })"><Icon type="plus-round"></Icon>业务员添加</Button>
        <Button type="primary" @click="getInvite"><Icon type="plus-round"></Icon>绑定链接</Button>
      </template>
    </myTable>

    <Modal v-model="inviteShow" :closable="true" :mask-closable="true" :footer-hide="true" width="700">
      <h3 slot="header" style="color:#2D8CF0">订单详情</h3>
      <h3>复制下面链接，发送给刚添加的业务员，绑定微信</h3>
      <br>
      <strong>{{ inviteUrl }}</strong>
    </Modal>
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
      inviteShow: false,
      inviteUrl: '',
      listConf: {
        url: '/adminapi/salesmans',
        searchParams: {
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '名称', align: 'center', key: 'name'},
          {title: '头像',
            align: 'center',
            key: 'name',
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
          {title: '手机', align: 'center', key: 'phone'},
          {title: '是否绑定微信', align: 'center', key: 'is_bind_wechat_name'},
          {title: '添加时间', align: 'center', key: 'created_at'},
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
                    icon: 'md-brush'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/salesmanManage/salesmans/edit/' + id)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'ios-build'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/salesmanManage/salesmans/resetPassword/' + id)
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
          _this.salesmanDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    salesmanDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/salesmans/' + id,
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
    getInvite () {
      var _this = this

      if (this.inviteUrl != '') {
        this.inviteShow = true;
        return true;
      }

      Util.ajax({
        url: '/adminapi/salesmans/invite',
        method: 'get',
        success: function (result) {
          if (result.error == 0) {
            _this.inviteUrl = result.result.url;
            _this.inviteShow = true;
          } else {
            _this.$Notice.error({ title: '提示', desc: result.info })
          }
        }
      })
    }
  },
  created: function () {

  },
  mounted: function () {
  }
}
</script>

<style lang="css">
</style>
