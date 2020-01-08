<template lang="html">
  <div class="users-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索用户名" ></Input>
        </Form-item>
        <Form-item prop="phone">
          <Input type="text" v-model="listConf.searchParams.phone" placeholder="搜索手机号" ></Input>
        </Form-item>
        <Form-item prop="is_vip">
          <Select style="width:200px" v-model="listConf.searchParams.is_vip" placeholder="是否 VIP">
            <Option label="全部(是否 VIP)" value="all" ></Option>
            <Option label="VIP" value="1" ></Option>
            <Option label="非VIP" value="0" ></Option>
          </Select>
        </Form-item>
        <Form-item prop="is_teach">
          <Select style="width:200px" v-model="listConf.searchParams.is_teach" placeholder="是否讲师">
            <Option label="全部(是否讲师)" value="all" ></Option>
            <Option label="讲师" value="1" ></Option>
            <Option label="非讲师" value="0" ></Option>
          </Select>
        </Form-item>
        <Form-item prop="is_invalid">
          <Select style="width:200px" v-model="listConf.searchParams.is_invalid" placeholder="状态">
            <Option label="全部(状态)" value="all" ></Option>
            <Option label="正常" value="0" ></Option>
            <Option label="禁用" value="1" ></Option>
          </Select>
        </Form-item>
        <Form-item prop="created_start">
          <sm-field
            v-model="listConf.searchParams.created_start"
            :field="{type: 'datetime', placeholder: '请输入注册开始时间' }"
            >
          </sm-field>
        </Form-item>
        <Form-item prop="created_end">
          <sm-field
            v-model="listConf.searchParams.created_end"
            :field="{type: 'datetime', placeholder: '请输入注册结束时间' }"
            >
          </sm-field>
        </Form-item>
      </template>
    </myTable>

    <Modal v-model="showDetail" :closable="true" :mask-closable=false :width="700">
      <h3 slot="header" style="color:#2D8CF0">用户详情</h3>
      <div v-if="detail.id">
        <h3 slot="header" style="color:#2D8CF0">系统信息</h3>
        <Row >
          <Col span="6" class="row-label">UID：</Col>
          <Col span="18" class="row-content">{{ detail.id }}</Col>
        </Row>
        <Row >
          <Col span="6" class="row-label">姓名：</Col>
          <Col span="18" class="row-content">{{ detail.name }}</Col>
        </Row>
        <Row >
          <Col span="6" class="row-label">手机号：</Col>
          <Col span="18" class="row-content">{{ detail.phone }}</Col>
        </Row>
        <Row v-if="detail.is_vip">
          <Col span="6" class="row-label">VIP 到期时间：</Col>
          <Col span="18" class="row-content">{{ detail.vip_expired_at }}</Col>
        </Row>

        <Row>
          <Col span="6" class="row-label">是否讲师：</Col>
          <Col span="18" class="row-content">
            {{ detail.is_teach_name }}
            
          </Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">注册时间：</Col>
          <Col span="18" class="row-content">{{ detail.created_at }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">最近登录时间：</Col>
          <Col span="18" class="row-content">{{ detail.last_login_at }}</Col>
        </Row>
      </div>


      <div v-if="detail.id">
        <h3 slot="header" style="color:#2D8CF0">个人信息</h3>
        <Row v-if="detail.avatar">
          <Col span="6" class="row-label">头像：</Col>
          <Col span="18" class="row-content">
            <img class="detail-images" style="width: 100px;height: 100px;border-radius: 50%;" :src="detail.avatar" @click="showBigImg(detail.avatar)" />
          </Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">性别：</Col>
          <Col span="18" class="row-content">{{ detail.sex_name }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">生日：</Col>
          <Col span="18" class="row-content">{{ detail.birth }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">所在地：</Col>
          <Col span="18" class="row-content">{{ detail.province }} {{ detail.city }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">工作年限：</Col>
          <Col span="18" class="row-content">{{ detail.work }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">行业：</Col>
          <Col span="18" class="row-content">{{ detail.industry }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">职务：</Col>
          <Col span="18" class="row-content">{{ detail.job }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">提升技能：</Col>
          <Col span="18" class="row-content">{{ detail.skill }}</Col>
        </Row>
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

export default {
  components: {
    myTable
  },
  data () {
    return {
      detail: {},
      showDetail: false,
      bigImgShow: false,
      bigImg: '',
      currentRow: {},
      categorys: [],
      listConf: {
        url: '/adminapi/users',
        searchParams: {
          name: '',
          phone: '',
          is_vip: 'all',
          is_teach: 'all',
          is_invalid: 'all',
          created_start: '',
          created_end: ''
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: 'UID', align: 'center', width: 120, key: 'id'},
          {title: '用户名', align: 'center', width: 150, key: 'name'},
          {title: '头像', align: 'center', key: 'cat_name',
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
            }},
          {title: '手机号', align: 'center', width: 120, key: 'phone'},
          {title: '性别', align: 'center', width: 80, key: 'sex_name'},
          {title: 'VIP过期时间', align: 'center', width: 200, key: 'vip_expired', render: (h, params) => {
            if (params.row.is_vip) {
              return h('span', params.row.vip_expired_at);
            } else {
              return h('span', '非 VIP');
            }
          }},
          {title: '是否讲师', align: 'center', width: 100, key: 'is_teach', render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.is_teach,
                  size: 'large',
                  'true-value': 1,
                  'false-value': 0,
                  'before-change': () => {
                    return new Promise((resolve) => {
                      var _this = this
                      var msg = params.row.is_teach ? '确定取消该用户讲师身份吗？' : '确定将该用户设置为讲师吗？'
                      _this.$Modal.confirm({
                        title: '提示',
                        content: msg,
                        onOk: function () {
                          resolve();
                        },
                        onCancel: function () {
                          _this.$Notice.error({ title: '提示', desc: '操作取消' })
                        }
                      })
                    })
                  },
                },
                on: {
                  'on-change': (status) => {
                    var _this = this
                    var id = params.row.id
                    _this.setTeach(id, status)
                  },
                }
              })
            ])
          }},
          {title: '状态', align: 'center', width: 100, key: 'is_invalid', render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.is_invalid,
                  size: 'large',
                  'true-value': 1,
                  'false-value': 0,
                  'before-change': () => {
                    return new Promise((resolve) => {
                      var _this = this
                      var msg = params.row.is_invalid ? '确定取消禁用该用户吗？' : '确定禁用该用户吗？禁用后该用户将不能登录'
                      _this.$Modal.confirm({
                        title: '提示',
                        content: msg,
                        onOk: function () {
                          resolve();
                        },
                        onCancel: function () {
                          _this.$Notice.error({ title: '提示', desc: '操作取消' })
                        }
                      })
                    })
                  },
                },
                on: {
                  'on-change': (status) => {
                    var _this = this
                    var id = params.row.id
                    _this.setInvalid(id, status)
                  }
                }
              })
            ])
          }},
          {title: '余额', align: 'center', width: 130, key: 'money'},
          {title: '已提现金额', align: 'center', width: 130, key: 'money_cash_total'},
          {title: '注册时间', align: 'center', width: 200, key: 'created_at'},
          {title: '操作',
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
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.detail = params.row;
                      this.showDetail = true;
                    }
                  }
                }),
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
    setTeach (id, status) {
      var _this = this

      Util.ajax({
        url: '/adminapi/users/' + id + '/setTeach',
        method: 'patch',
        data: {is_teach: status},
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
    setInvalid (id, status) {
      var _this = this

      Util.ajax({
        url: '/adminapi/users/' + id + '/setInvalid',
        method: 'patch',
        data: {is_invalid: status},
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
    showBigImg (src) {
      this.bigImg = src;
      this.bigImgShow = true;
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
