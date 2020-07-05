<template lang="html">
  <div class="users-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="id">
          <Input type="text" v-model="listConf.searchParams.id" placeholder="搜索UID" ></Input>
        </Form-item>
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索导师姓名" ></Input>
        </Form-item>
        <Form-item prop="phone">
          <Input type="text" v-model="listConf.searchParams.phone" placeholder="搜索手机号" ></Input>
        </Form-item>
        <Form-item prop="status">
          <Select style="width:200px" v-model="listConf.searchParams.status" placeholder="导师状态">
            <Option label="全部" value="all" ></Option>
            <Option label="已启用" value="1" ></Option>
            <Option label="已禁用" value="0" ></Option>
          </Select>
        </Form-item>
      </template>

       <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/tutorManage/add' })"><Icon type="plus-round"></Icon>添加导师</Button>
      </template>
    </myTable>

    <Modal v-model="showDetail" :closable="true" :mask-closable=false :width="700">
      <Menu mode="horizontal" theme="light" active-name="info" @on-select="getItem">
        <MenuItem name="info" >导师信息</MenuItem>
        <MenuItem name="tutor_cat" >可咨询方向</MenuItem>
        <MenuItem name="tutor_comment" >学员评价</MenuItem>
      </Menu>

      <div style="height: 20px;"></div>

      <div v-if="menuActivity == 'tutor_cat'">
        <tutor-cat :item-id="detail.id" :item="detail">

        </tutor-cat>
      </div>
      <div v-else-if="menuActivity == 'tutor_comment'">
        <tutor-comment :item-id="detail.id" :item="detail">

        </tutor-comment>
      </div>

      <div v-if="menuActivity == 'info'">
        <div v-if="detail.id">
          <Row >
            <Col span="6" class="row-label">导师ID：</Col>
            <Col span="18" class="row-content">{{ detail.id }}</Col>
          </Row>
          <Row v-if="detail.avatar">
            <Col span="6" class="row-label">导师照片：</Col>
            <Col span="18" class="row-content">
              <img class="detail-images" style="width: 100px;height: 100px;border-radius: 50%;" :src="detail.avatar" @click="showBigImg(detail.avatar)" />
            </Col>
          </Row>
          <Row >
            <Col span="6" class="row-label">导师姓名：</Col>
            <Col span="18" class="row-content">{{ detail.name }}</Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">一句话描述：</Col>
            <Col span="18" class="row-content">{{ detail.desc }}</Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">简介：</Col>
            <Col span="18" class="row-content content-detail" v-html="detail.intro"></Col>
          </Row>
        </div>
      </div>
    </Modal>

    <Modal v-model="bigImgShow" :closable="true" :mask-closable="true" :footer-hide="true" width="700">
      <img :src="bigImg" style="width: 670px;margin-top: 30px;" alt="">
    </Modal>
  </div>
</template>

<script>
import Util from '@/libs/util'
import myTable from '@/view/includes/myTable'
import TutorCat from '@/view/includes/custom/tutor/tutor-cat'
import TutorComment from '@/view/includes/custom/tutor/tutor-comment'

export default {
  components: {
    myTable,
    TutorCat,
    TutorComment
  },
  data () {
    return {
      menuActivity: 'info',
      detail: {},
      showDetail: false,
      bigImgShow: false,
      bigImg: '',
      currentRow: {},
      categorys: [],
      listConf: {
        url: '/adminapi/tutors',
        searchParams: {
          id: '',
          name: '',
          phone: '',
          partner_type: 0,
          partner_start: '',
          partner_end: ''
        },
        item: [],
        columns: [
          { type: 'index', align: 'center', width: 100, fixed: 'left' },
          { title: 'UID', align: 'center', width: 80, key: 'id' },
          { title: '用户名', align: 'center', width: 120, key: 'name' },
          { title: '头像',
            align: 'center',
            key: 'avatar',
            width: 80,
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
            } },
          { title: '手机号',
            align: 'center',
            width: 120,
            key: 'user_phone',
            render: (h, params) => {
              return params.row.user ? h('span', params.row.user.phone) : h('span', '')
            } },
          { title: '性别',
            align: 'center',
            width: 120,
            key: 'sex_name',
            render: (h, params) => {
              return params.row.user ? h('span', params.row.user.sex_name) : h('span', '')
            } },
          { title: '合计咨询次数', align: 'center', width: 120, key: 'consult_num' },
          { title: '合计收益', align: 'center', width: 100, key: 'consult_total_money' },
          { title: '可提现收益',
            align: 'center',
            width: 100,
            key: 'money',
            render: (h, params) => {
              return params.row.user ? h('span', params.row.user.money) : h('span', 0)
            } },
          { title: '学员评分', align: 'center', width: 100, key: 'grade' },
          { title: '创建时间', align: 'center', width: 160, key: 'created_at' },
          { title: '是否推荐',
            align: 'center',
            width: 160,
            key: 'recommend',
            render: (h, params) => {
              return params.row.recommend === 1 ? h('span', '是') : h('span', '否')
            } },
          { title: '是否导师',
            align: 'center',
            width: 100,
            key: 'status',
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    value: params.row.status,
                    size: 'large',
                    'true-value': 1,
                    'false-value': 0,
                    'before-change': () => {
                      return new Promise((resolve) => {
                        var _this = this
                        var msg = params.row.status ? '确定禁用该导师吗？' : '确定启用该导师吗？'
                        _this.$Modal.confirm({
                          title: '提示',
                          content: msg,
                          onOk: function () {
                            resolve()
                          },
                          onCancel: function () {
                            _this.$Notice.error({ title: '提示', desc: '操作取消' })
                          }
                        })
                      })
                    }
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
            } },
          { title: '操作',
            key: 'action',
            align: 'center',
            width: 120,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-eye'
                  },
                  domProps: {
                    title: '查看详情'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.detail = params.row
                      this.showDetail = true
                    }
                  }
                }),
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
                      this.jumpPage('/tutorManage/edit/' + id)
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
    setStatus (id, status) {
      var _this = this

      Util.ajax({
        url: '/adminapi/tutors/' + id + '/setStatus',
        method: 'patch',
        data: { status: status },
        success: function (result) {
          if (result.error == 0) {
            _this.$Notice.success({ title: '提示', desc: '操作成功' })
            _this.$refs.listTable.listLoad()
          } else {
            _this.$Notice.error({ title: '提示', desc: result.info })
          }
        }
      })
    },
    getItem (code) {
      this.menuActivity = code
    }
  },
  created: function () {
    var _this = this
  },
  mounted: function () {
  }
}
</script>

<style scoped>
.ivu-row {
  padding: 10px;
}
.row-label {
  text-align: right;
  padding-right: 10px;
}

.row-content {
  text-align: left;
  padding-left: 10px;
}
.detail-images {
  width: 80px;
  height: 80px;
  margin-right: 10px;
}
</style>
