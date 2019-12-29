<template lang="html">
  <div class="classroom-contents-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" :noSearch="true">
      <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/classroomManage/classroomContents/add/' + $route.params.classroom_id })"><Icon type="plus-round"></Icon>课堂课时添加</Button>
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
        url: '/adminapi/classroomContents/',
        searchParams: {
          classroom_id: this.$route.params.classroom_id
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '内容名称', align: 'center', width: 200, key: 'name'},
          {title: '直播间 ID', align: 'center', width: 100, key: 'live_id'},
          {title: '开始时间', align: 'center', width: 120, key: 'start_at'},
          {title: '结束时间', align: 'center', width: 120, key: 'end_at'},
          {title: '评价讲师', align: 'center', width: 80, key: 'is_teach_comment_name'},
          {title: '排序', align: 'center', width: 80, key: 'sort_order'},
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
                      this.jumpPage('/classroomManage/classroomComments/' + this.$route.params.classroom_id + '/' + params.row.id)
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
                      this.jumpPage('/classroomManage/classroomContents/edit/' + this.$route.params.classroom_id + '/' + id)
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
          _this.classroomContentDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    classroomContentDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/classroomContents/' + id,
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
