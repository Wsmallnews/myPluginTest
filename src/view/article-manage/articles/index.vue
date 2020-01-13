<template lang="html">
  <div class="articles-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="title">
          <Input type="text" v-model="listConf.searchParams.title" placeholder="搜索文章名称" ></Input>
        </Form-item>

        <Form-item prop="cat_id">
          <Cascader :data="categorys" v-model="listConf.searchParams.cat_id" change-on-select></Cascader>
        </Form-item>
      </template>
      <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/articleManage/articles/add' })"><Icon type="plus-round"></Icon>文章添加</Button>
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
        url: '/adminapi/articles',
        searchParams: {
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '标题', align: 'center', key: 'title'},
          {title: '分类', key: 'cat_name',
            width: 120,
            render: (h, params) => {
              if (params.row.article_cat != null) {
                return h('span', params.row.article_cat.name)
              }
            }},
          {title: '标识类型', align: 'center', key: 'code_name'},
          {title: '浏览量', align: 'center', key: 'view_num'},
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
                  domProps: {
                    title: '编辑',
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/articleManage/articles/edit/' + id)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'md-close'
                  },
                  domProps: {
                    title: '删除',
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
          _this.articleDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    articleDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/articles/' + id,
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
        url: '/adminapi/articles/' + id + '/setStatus',
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

    Util.ajax({
      url: '/adminapi/articleCats/all',
      method: 'get',
      success: function (result) {
        if (result.error == 0) {
          _this.categorys = result.result
        } else {
          _this.$Notice.error({title: '提示', desc: result.info})
        }
      }
    })
  },
  mounted: function () {
  }
}
</script>

<style lang="css">
</style>
