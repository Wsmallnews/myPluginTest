<template lang="html">
  <div class="tags-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" :is-hand-start="true">
      <template slot="formItem" >
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索标签名" ></Input>
        </Form-item>
      </template>
      <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/tagManage/add/' + listConf.searchParams.type })"><Icon type="plus-round"></Icon>标签添加</Button>
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
        url: '/adminapi/tags',
        searchParams: {
          name: '',
          type: ''
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '标签名', align: 'center', key: 'name'},
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
                      this.jumpPage('/tagManage/edit/' + this.listConf.searchParams.type + '/' + id)
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
  watch: {
    '$route' (to, from) {
      this.setType();
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
          _this.tagDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    tagDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/tags/' + id,
        method: 'DELETE',
        data: {type: this.listConf.searchParams.type},
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
    setType () {
      var routeName = this.$route.name;
      console.log(this.$route.name)
      if (routeName == 'classroommanage-tags-index') {
        this.listConf.searchParams.type = 'classroom';
      } else if (routeName == 'soundmanage-tags-index') {
        this.listConf.searchParams.type = 'sound';
      } else if (routeName == 'businessmanage-tags-index') {
        this.listConf.searchParams.type = 'business';
      } else {
        this.$Notice.error({title: '提示', desc: '参数错误'})
        return false;
      }

      this.$nextTick(() => {
        this.$refs.listTable.listInit();
      })
    }
  },
  created: function () {
    var _this = this

    this.setType();
  },
  mounted: function () {

  }
}
</script>

<style lang="css">
</style>
