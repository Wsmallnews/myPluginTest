<template lang="html">
  <div class="adpositions-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" :no-search="true">
      <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/adManage/adPositions/add' })"><Icon type="plus-round"></Icon>广告位添加</Button>
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
      currentRow:{},
      listConf: {
        url: "/adminapi/adPositions",
        searchParams: {
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width:100, fixed: 'left'},
          {title: '广告位名称', align: 'center', width: 150, key: 'name'},
          {title: '广告位标识', align: 'center', width: 150, key: 'code_name'},
          {title: '描述', align: 'left', minWidth: 150, key: 'desc'},
          {title: '添加时间', align: 'center', width: 200, key: 'created_at'},
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
                      this.jumpPage('/adManage/adPositions/edit/' + id)
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
    deleteConf: function (id) {
      var _this = this
      _this.$Modal.confirm({
        title: '提示',
        content: '确定删除吗？删除之后不可恢复!',
        onOk: function () {
          _this.adPositionDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    adPositionDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/adPositions/' + id,
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

  },
  mounted: function (){
  }
}
</script>

<style lang="css" >
button.add-btn {
  margin-bottom: 20px;
}
</style>
