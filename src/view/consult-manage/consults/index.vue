<template lang="html">
  <div class="users-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow"
      @searchReset="searchReset">
      <template slot="formItem" >
        <Form-item prop="user_name">
          <Input type="text" v-model="listConf.searchParams.user_name" placeholder="咨询人姓名" ></Input>
        </Form-item>
        <Form-item prop="user_phone">
          <Input type="text" v-model="listConf.searchParams.user_phone" placeholder="咨询人手机号" ></Input>
        </Form-item>
        <Form-item prop="tutor_name">
          <Input type="text" v-model="listConf.searchParams.tutor_name" placeholder="导师姓名" ></Input>
        </Form-item>
        <Form-item prop="tutor_phone">
          <Input type="text" v-model="listConf.searchParams.tutor_phone" placeholder="导师手机号" ></Input>
        </Form-item>

        <Form-item prop="mode_type">
          <Select style="width:200px" v-model="listConf.searchParams.mode_type" placeholder="咨询方式">
            <Option label="全部(咨询方式)" value="all" ></Option>
            <Option label="电话咨询" value="mode_phone" ></Option>
            <Option label="视频咨询" value="mode_video" ></Option>
            <Option label="线下咨询" value="mode_offline" ></Option>
          </Select>
        </Form-item>

        <Form-item prop="status">
          <Select style="width:200px" v-model="listConf.searchParams.status" placeholder="咨询状态">
            <Option label="全部(咨询状态)" value="all" ></Option>
            <Option v-for="status in orderStatus" :label="status.name" :value="status.value" ></Option>
          </Select>
        </Form-item>

        <Form-Item prop="created_at">
          <sm-field
            v-model="listConf.searchParams.created_at"
            :field="{type: 'datetimerange', placeholder: '咨询时间'}"
            />
        </Form-item>
      </template>
    </myTable>

    <Modal v-model="showDetail" :closable="true" :mask-closable=false :width="700">
      <h3 style="color:#2D8CF0">咨询详情</h3>

      <div v-if="detail.id">
        <Row >
          <Col span="6" class="row-label">咨询ID：</Col>
          <Col span="18" class="row-content">{{ detail.id }}</Col>
        </Row>
        <Row >
          <Col span="6" class="row-label">咨询人姓名：</Col>
          <Col span="18" class="row-content">{{ detail.user ? detail.user.name : '' }}</Col>
        </Row>
        <Row >
          <Col span="6" class="row-label">咨询人手机号：</Col>
          <Col span="18" class="row-content">{{ detail.user ? detail.user.phone : '' }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">咨询方向：</Col>
          <Col span="18" class="row-content">{{ detail.tutor_cat_name }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">咨询方式：</Col>
          <Col span="18" class="row-content">{{ detail.mode_type }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">金额：</Col>
          <Col span="18" class="row-content">{{ detail.tutor_price * detail.quantity}}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">问题描述：</Col>
          <Col span="18" class="row-content">{{ detail.content }}</Col>
        </Row>
        <Row v-if="detail.resume_arr && detail.resume_arr.length">
          <Col span="6" class="row-label">学员简历：</Col>
          <Col span="18" class="row-content">
            <img v-for="img in detail.resume_arr" :src="img" style="width: 100px; padding: 0 5px;" @click="showBigImg(img)" />
          </Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">学员信息：</Col>
          <Col span="18" class="row-content">{{ detail.user_name }}-{{ detail.user_sex_name }}-{{ detail.phone }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">导师姓名：</Col>
          <Col span="18" class="row-content">{{ detail.tutor ? detail.tutor.name : '' }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">导师手机号：</Col>
          <Col span="18" class="row-content">{{ detail.tutor ? detail.tutor.phone : ''}}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">创建时间：</Col>
          <Col span="18" class="row-content">{{ detail.created_at }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">状态：</Col>
          <Col span="18" class="row-content">{{ detail.status_name }}</Col>
        </Row>
        <Row v-if="detail.deny_reason">
          <Col span="6" class="row-label">拒绝原因：</Col>
          <Col span="18" class="row-content">{{ detail.deny_reason }}</Col>
        </Row>
      </div>
    </Modal>

    <Modal v-model="bigImgShow" :closable="true" :mask-closable="true" :footer-hide="true" width="700">
      <img :src="bigImg" style="width: 670px;margin-top: 30px;" alt="">
    </Modal>

    <!-- <Modal v-model="sendVIPShow" :closable='false' :mask-closable=false :width="400">
      <h3 slot="header" style="color:#2D8CF0">处理</h3>
      <h3 style="color: #ffad33;margin-bottom: 10px;">{{ currentSendInfo }}</h3>
      <Form ref="sendForm" :model="sendForm" :label-width="100" label-position="right" :rules="sendValidate">
        <Form-item label="选择赠送时长" prop="user_id">
          <Select style="width:200px" v-model="sendForm.years" filterable clearable placeholder="VIP时长">
            <Option v-for="(item, index) in vipOptions" :key="index" :label="item.name" :value="item.id" ></Option>
          </Select>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelVIPSending">取消</Button>
        <Button type="primary" :loading="saveLoading" @click="processSendVIP">确定</Button>
      </div>
    </Modal> -->
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
      // currentSendInfo: '',
      // currentSelect: [],
      // currentSelectUserName: [],
      // saveLoading: false,
      // sendInfo: '',
      // sendForm: {
      //   template_id: '',
      //   content: '',
      //   years:1
      // },
      detail: {},
      showDetail: false,
      bigImgShow: false,
      bigImg: '',
      currentRow: {},
      orderStatus: [],
      listConf: {
        url: '/adminapi/consults',
        searchParams: {
          user_name: '',
          user_phone: '',
          tutor_name: '',
          tutor_phone: '',
          mode_type: 'all',
          status: 'all',
          created: []
        },
        item: [],
        columns: [
          { type: 'index', align: 'center', width: 50, fixed: 'left' },
          { title: 'ID', align: 'center', width: 120, key: 'id' },
          // {title: '订单ID', align: 'center', width: 120, key: 'order_sn', render: (h, params) => {
          //   if (params.row.order) {

          //   }
          // }},
          { title: '咨询人姓名',
            align: 'center',
            width: 120,
            key: 'user_name',
            render: (h, params) => {
              return params.row.user ? h('span', params.row.user.name) : h('span', '')
            } },
          { title: '咨询人手机号',
            align: 'center',
            width: 120,
            key: 'user_phone',
            render: (h, params) => {
              return params.row.user ? h('span', params.row.user.phone) : h('span', '')
            } },
          { title: '咨询方向', align: 'center', width: 120, key: 'tutor_cat_name' },
          { title: '总金额',
            align: 'center',
            width: 120,
            key: 'tutor_price',
            render: (h, params) => {
              return h('span', params.row.tutor_price * params.row.quantity)
            } },
          { title: '数量', align: 'center', width: 120, key: 'quantity' },
          { title: '导师姓名',
            align: 'center',
            width: 120,
            key: 'tutor_name',
            render: (h, params) => {
              return params.row.tutor ? h('span', params.row.tutor.name) : h('span', '')
            } },
          { title: '导师手机号',
            align: 'center',
            width: 120,
            key: 'tutor_phone',
            render: (h, params) => {
              return params.row.tutor ? h('span', params.row.tutor.phone) : h('span', '')
            } },
          { title: '咨询方式', align: 'center', width: 150, key: 'mode_type' },
          { title: '咨询状态', align: 'center', width: 130, key: 'status_name' },
          { title: '拒绝理由', align: 'center', width: 130, key: 'deny_reason' },
          { title: '创建时间', align: 'center', width: 200, key: 'created_at' },
          { title: '操作',
            key: 'action',
            align: 'center',
            width: 120,
            fixed: 'right',
            render: (h, params) => {
              var btn = []
              btn.push(h('Button', {
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
              })
              )

              if (params.row.status == 1 || params.row.status == 2) {
                btn.push(h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'md-redo'
                  },
                  domProps: {
                    title: '退款'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.refund(params.row)
                    }
                  }
                })
                )
              }
              return h('div', btn)
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
    showBigImg (src) {
      this.bigImg = src
      this.bigImgShow = true
    },
    refund (consult) {
      var _this = this

      _this.$Modal.confirm({
        title: '提示',
        content: '确定要退款吗？',
        onOk: function () {
          Util.ajax({
            url: '/adminapi/consults/' + consult.id + '/refund',
            method: 'patch',
            success: function (result) {
              if (result.error == 0) {
                _this.$refs.listTable.listLoad()
                _this.$Notice.success({ title: '提示', desc: result.info })
              } else {
                _this.$Notice.error({ title: '提示', desc: result.info })
              }
            }
          })
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    getOrderStatus () {
      var _this = this

      Util.ajax({
        url: '/adminapi/consults/orderStatus',
        method: 'get',
        success: function (result) {
          if (result.error == 0) {
            _this.orderStatus = result.result
          } else {
            _this.$Notice.error({ title: '提示', desc: result.info })
          }
        }
      })
    }
  },
  created: function () {
    var _this = this

    this.getOrderStatus()
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
