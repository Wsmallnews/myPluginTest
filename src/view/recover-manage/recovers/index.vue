<template lang="html">
  <div class="recovers-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索类目名称" ></Input>
        </Form-item>
      </template>
      <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/recoverManage/recovers/add' })"><Icon type="plus-round"></Icon>类目内容添加</Button>
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
        url: '/adminapi/recovers',
        searchParams: {
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '名称', align: 'center', width: 200, key: 'name'},
          {title: '分类', key: 'cat_name',
            width: 150,
            render: (h, params) => {
              if (params.row.recover_cat != null) {
                return h('span', params.row.recover_cat.name)
              }
            }},
          {title: '描述', align: 'center', minWidth: 150, key: 'desc'},
          {title: '排序', align: 'center', width: 80, key: 'sort_order'},
          { title: '状态',
            key: 'status',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    value: params.row.status,
                    size: 'large',
                    'true-value': 1,
                    'false-value': 0
                  },
                  on: {
                    'on-change': (status) => {
                      var _this = this
                      var id = params.row.id
                      _this.setStatus(id, status)
                    }
                  }
                })
              ])
            }},
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
                    icon: 'md-brush'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/recoverManage/recovers/edit/' + id)
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
          _this.recoverDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    recoverDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/recovers/' + id,
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
        url: '/adminapi/recovers/' + id + '/setStatus',
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
