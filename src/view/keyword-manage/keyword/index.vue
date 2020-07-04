<template lang="html">
  <div class="tags-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" :is-hand-start="true">
      <!-- <template slot="formItem" >
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索关键词" ></Input>
        </Form-item>
      </template> -->
      <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/keywordManage/keyword/add/'})"><Icon type="plus-round"></Icon>热搜词添加</Button>
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
        url: '/adminapi/keyword/all',
        searchParams: {
          name: '',
          type: ''
        },
        item: [],
        columns: [
          { type: 'index', align: 'center', width: 100, fixed: 'left' },
          { title: '关键词', align: 'center', key: 'name' },
          { title: '搜索次数', align: 'center', key: 'count' },
          { title: '排序', align: 'center', key: 'sort' },
          { title: '添加时间', align: 'center', width: 180, key: 'created_at' },
          { title: '操作',
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
                    title: '编辑'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/keywordManage/keyword/edit/' + id)
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
                    title: '删除'
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
  watch: {
    '$route' (to, from) {
      this.setType()
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
          _this.keywordDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    keywordDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/keyword/' + id,
        method: 'DELETE',
        data: { type: this.listConf.searchParams.type },
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
    this.$nextTick(() => {
      this.$refs.listTable.listInit()
    })
  },
  mounted: function () {

  }
}
</script>

<style lang="css">
</style>
