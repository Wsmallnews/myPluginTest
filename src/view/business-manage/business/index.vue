<template lang="html">
  <div class="business-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索商学名" ></Input>
        </Form-item>

        <Form-item prop="teach_id">
          <Select style="width:200px" v-model="listConf.searchParams.teach_id" clearable placeholder="讲师">
            <Option v-for="teacher in teachers" :label="teacher.name" :value="teacher.id" ></Option>
          </Select>
        </Form-item>
        <Form-item prop="tag">
          <Select style="width:200px" v-model="listConf.searchParams.tag" clearable placeholder="标签">
            <Option v-for="tag in tags" :label="tag.name" :value="tag.name" ></Option>
          </Select>
        </Form-item>
      </template>
      <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/businessManage/add' })"><Icon type="plus-round"></Icon>薪商学添加</Button>
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
        url: '/adminapi/business',
        searchParams: {
          name: '',
          teach_id: 0,
          tag: ''
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '商学名称', align: 'center', width: 200, key: 'name'},
          {title: '状态', align: 'center', width: 100, key: 'status_name'},
          {title: '标签', align: 'center', width: 100, key: 'tagstr', render: (h, params) => {
            return h('span', params.row.tag_arr.join(' '));
          }},
          {title: '开始时间', align: 'center', width: 100, key: 'start_at'},
          {title: '结束时间', align: 'center', width: 100, key: 'end_at'},
          {title: '报名人数', align: 'center', width: 120, key: 'join_num'},
          {title: '已报名人数', align: 'center', width: 120, key: 'joined_num'},
          {title: '报名截止时间', align: 'center', width: 120, key: 'join_end_at'},
          {title: '费用', align: 'center', minWidth: 150, key: 'charge', render: (h, params) => {
            var text = '';
            if (params.row.is_charge) {
              text = params.row.charge_money;
            } else {
              text = '免费'
            }
            return h('span', text);
          }},
          {title: 'VIP 费用', align: 'center', minWidth: 150, key: 'vip_charge', render: (h, params) => {
            var text = '';
            if (params.row.is_vip_charge) {
              text = params.row.vip_charge_money;
            } else {
              text = '免费'
            }
            return h('span', text);
          }},
          {title: '浏览量', align: 'center', width: 100, key: 'view_num'},
          { title: '推荐',
            key: 'is_recommend',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    value: params.row.is_recommend,
                    size: 'large',
                    'true-value': 1,
                    'false-value': 0
                  },
                  on: {
                    'on-change': (is_recommend) => {
                      var _this = this
                      var id = params.row.id
                      _this.setRecommend(id, is_recommend)
                    }
                  }
                })
              ])
            }
          },
          {title: '排序', align: 'center', width: 80, key: 'sort_order'},
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
                    icon: 'md-list-box'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/businessManage/user/' + id)
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
                      this.jumpPage('/businessManage/edit/' + id)
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
          _this.businessDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    businessDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/business/' + id,
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
        url: '/adminapi/business/' + id + '/setStatus',
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
    setRecommend (id, is_recommend) {
      var _this = this

      Util.ajax({
        url: '/adminapi/business/' + id + '/setRecommend',
        method: 'patch',
        data: {is_recommend: is_recommend},
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
    getTeachers() {
      // 获取所有老师
      var _this = this;
      Util.ajax({
        url: '/adminapi/users/indexTeachAll',
        method: 'get',
        success: function(result) {
          if (result.error == 0) {

            _this.teachers = result.result;
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
    getTags() {
      var _this = this;
      // 获取所有标签
      Util.ajax({
        url: '/adminapi/tags/all',
        method: 'get',
        data: {type: 'business'},
        success: function(result) {
          if (result.error == 0) {
            _this.tags = result.result;
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
  },
  created: function () {
    var _this = this

    this.getTeachers();
    this.getTags();
  },
  mounted: function () {
  }
}
</script>

<style lang="css">
</style>
