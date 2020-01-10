<template lang="html">
  <div class="coupon-types-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索优惠券名" ></Input>
        </Form-item>
      </template>
      <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/couponManage/add' })"><Icon type="plus-round"></Icon>优惠券添加</Button>
      </template>
    </myTable>

    <Modal v-model="sendShow" :closable='false' :mask-closable=false :width="600">
      <h3 slot="header" style="color:#2D8CF0">发送优惠券</h3>
      <h6 style="margin-bottom: 20px;">即将发送优惠券 “{{ sendInfo.name }}”</h6>

      <Row >
        <Col span="6" class="row-label">优惠券金额：</Col>
        <Col span="18" class="row-content">{{ sendInfo.money }}</Col>
      </Row>
      <Row >
        <Col span="6" class="row-label">可用场景：</Col>
        <Col span="18" class="row-content">{{ sendInfo.apply_type_name }}</Col>
      </Row>
      <Row >
        <Col span="6" class="row-label">有效天数：</Col>
        <Col span="18" class="row-content">{{ sendInfo.expire_days }}天</Col>
      </Row>
      <div style="height: 20px;"></div>
      <Form ref="sendForm" :model="sendForm" :label-width="100" label-position="right" :rules="sendValidate">
        <Form-item label="选择用户" prop="user_id">
          <Select style="width:200px" v-model="sendForm.user_id" filterable clearable placeholder="发放用户">
            <Option v-for="(user, index) in users" :key="index" :label="user.name + (user.phone != null ? ' - ' + user.phone : '')" :value="user.id" ></Option>
          </Select>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" :loading="saveLoading" @click="ok">发送</Button>
      </div>
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
      sendShow: false,
      saveLoading: false,
      sendInfo: {},
      sendForm: {
        id: 0,
        user_id: 0,
      },
      sendValidate: {
        user_id: [
          { required: true, type: 'number', min: 1, message: '请选择要发放的用户', trigger: 'change' }
        ],
      },
      users: [],

      currentRow: {},
      teachers: [],
      tags: [],
      listConf: {
        url: '/adminapi/couponTypes',
        searchParams: {
          name: '',
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '优惠券名称', align: 'center', width: 200, key: 'name'},
          {title: '领取类型', align: 'center', width: 100, key: 'get_type_name'},
          {title: '类型', align: 'center', width: 120, key: 'type_name'},
          {title: '适用类型', align: 'center', width: 100, key: 'apply_type_name'},
          {title: '金额', align: 'center', width: 120, key: 'money'},
          {title: '满足金额', align: 'center', width: 120, key: 'full_money'},
          {title: '发放数量', align: 'center', width: 120, key: 'send_num'},
          {title: '已发放数量', align: 'center', width: 120, key: 'sended_num'},
          {title: '开始发放时间', align: 'center', width: 120, key: 'start_send_at'},
          {title: '结束发放时间', align: 'center', width: 120, key: 'end_send_at'},
          {title: '有效天数', align: 'center', width: 100, key: 'expire_days'},
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
                      this.jumpPage('/couponManage/coupons/' + id)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-send'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.showSend(params.row);
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
                      this.jumpPage('/couponManage/edit/' + id)
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
          _this.couponTypeDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    couponTypeDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/couponTypes/' + id,
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
    getUsers() {
      // 获取所有老师
      var _this = this;
      Util.ajax({
        url: '/adminapi/users/all',
        method: 'get',
        success: function(result) {
          if (result.error == 0) {

            _this.users = result.result;
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
    showSend (item) {
      if (this.users.length <= 0) {
        this.getUsers();
      } 

      this.sendForm.id = item.id;
      this.sendInfo = item;
      this.sendShow = true;
    },
    cancel: function () {
      this.sendShow = false;
      this.sendForm.id = 0;
      this.sendForm.user_id = 0;
      this.sendInfo = {};
    },
    ok: function () {
      var _this = this;

      _this.$Modal.confirm({
        title: '提示',
        content: '确定要发送吗？',
        onOk: function () {
          _this.sendOper()
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    sendOper () {
      var _this = this;
      _this.$refs['sendForm'].validate((valid) => {
        if (valid) {
          _this.saveLoading = true;
          Util.ajax({
            url: '/adminapi/couponTypes/'+ _this.sendForm.id +'/sendCoupon',
            method: 'post',
            data: {user_id: this.sendForm.user_id},
            success: function(result) {
              _this.saveLoading = false;
              if (result.error == 0) {
                _this.$Notice.success({
                  title: '提示',
                  desc: "发送成功"
                });
                _this.cancel();
                _this.$refs.listTable.listLoad();
              } else {
                _this.$Notice.error({
                  title: '提示',
                  desc: result.info
                });
              }
            }
          })
        }
      });
    }
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