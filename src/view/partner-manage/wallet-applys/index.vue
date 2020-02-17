<template lang="html">
  <div class="partner-walletapplys-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="id">
          <Input type="text" v-model="listConf.searchParams.id" placeholder="提现 ID" ></Input>
        </Form-item>
        <Form-item prop="user_id">
          <Input type="text" v-model="listConf.searchParams.user_id" placeholder="UID" ></Input>
        </Form-item>
        <Form-item prop="user_name">
          <Input type="text" v-model="listConf.searchParams.user_name" placeholder="用户名称" ></Input>
        </Form-item>
        <Form-item prop="user_phone">
          <Input type="text" v-model="listConf.searchParams.user_phone" placeholder="手机号" ></Input>
        </Form-item>
        <Form-item prop="status" style="width: 150px;">
          <Select v-model="listConf.searchParams.status" placeholder="处理状态">
            <Option value="all" key="all">全部(处理状态)</Option>
            <Option :value="0" :key="0">未处理</Option>
            <Option :value="1" :key="1">已打款</Option>
            <Option :value="-1" :key="-1">已拒绝</Option>
          </Select>
        </Form-item>
        <Form-Item prop="created_at">
          <sm-field
            v-model="listConf.searchParams.created_at"
            :field="{type: 'datetimerange', placeholder: '提现时间'}"
            />
        </Form-item>
      </template>
      <template slot="formBtn" >
        <Button type="primary" @click="showApply"><Icon type="plus-round"></Icon>处理申请</Button>
      </template>
    </myTable>

    <Modal v-model="applyShow" :closable='false' :mask-closable=false :width="400">
      <h3 slot="header" style="color:#2D8CF0">处理</h3>
      <h3 style="color: #ffad33;margin-bottom: 10px;">{{ applyInfo }}</h3>
      <Form ref="applyForm" :model="applyForm" :label-width="100" label-position="right" :rules="applyValidate">
        <Form-item label="处理备注" prop="status_msg">
          <Input v-model="applyForm.status_msg" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入处理备注"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="warning" :loading="saveLoading" @click="error">拒绝</Button>
        <Button type="primary" :loading="saveLoading" @click="ok">确认已打款</Button>
      </div>
    </Modal>

    <!-- <Modal v-model="cardImageShow" :closable='false' :mask-closable=false :width="530">
      <h3 slot="header" style="color:#2D8CF0">收款账号</h3>
      <h6>{{ cardInfo }}</h6>
      <img :src="cardImage" style="width: 500px;margin: 20px auto;" />
      <div slot="footer">
        <Button type="text" @click="cardImageShow = false">关闭</Button>
      </div>
    </Modal> -->

    <Modal v-model="showDetail" :closable="true" :mask-closable=false :width="700">
      <h3 slot="header" style="color:#2D8CF0">提现详情</h3>
      <div v-if="detail.id">
        <Row >
          <Col span="6" class="row-label">UID：</Col>
          <Col span="18" class="row-content">{{ detail.user_id }}</Col>
        </Row>

        <template v-if="detail.user">
          <Row >
            <Col span="6" class="row-label">姓名：</Col>
            <Col span="18" class="row-content">{{ detail.user.name }}</Col>
          </Row>
          <Row >
            <Col span="6" class="row-label">手机号：</Col>
            <Col span="18" class="row-content">{{ detail.user.phone }}</Col>
          </Row>
        </template>

        <Row>
          <Col span="6" class="row-label">申请时间：</Col>
          <Col span="18" class="row-content">{{ detail.created_at }}</Col>
        </Row>

        <Row>
          <Col span="6" class="row-label">提现金额：</Col>
          <Col span="18" class="row-content">{{ detail.money }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">应扣税额：</Col>
          <Col span="18" class="row-content">{{ detail.charge_money }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">实际打款：</Col>
          <Col span="18" class="row-content">{{ detail.real_money }}</Col>
        </Row>
      </div>

      <br><br>
      <div v-if="detail.bank_card">
        <Row >
          <Col span="6" class="row-label">到账账户：</Col>
          <Col span="18" class="row-content">{{ detail.bank_card.bank_name }}</Col>
        </Row>
        <Row >
          <Col span="6" class="row-label">真实姓名：</Col>
          <Col span="18" class="row-content">{{ detail.bank_card.card_name }}</Col>
        </Row>
        <Row >
          <Col span="6" class="row-label">身份证号：</Col>
          <Col span="18" class="row-content">{{ detail.bank_card.id_card }}</Col>
        </Row>
        <Row >

          <Col v-if="detail.bank_card.type == 'bank'" span="6" class="row-label">银行卡号：</Col>
          <Col v-else-if="detail.bank_card.type == 'alipay'" span="6" class="row-label">支付宝账户：</Col>
          <Col v-else span="6" class="row-label">提现账户：</Col>
          <Col span="18" class="row-content">{{ detail.bank_card.bank_card }}</Col>
        </Row>
        <Row v-if="detail.bank_card.type == 'bank'">
          <Col span="6" class="row-label">分支行：</Col>
          <Col span="18" class="row-content">{{ detail.bank_card.bank_branch_name }}</Col>
        </Row>
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
      detail: {},
      showDetail: false,
      currentRow: {},
      categorys: [],
      listConf: {
        url: '/adminapi/partnerWalletApplys',
        searchParams: {
          id: '',
          user_id: '',
          user_name: '',
          user_phone: '',
          status: 'all',
          created_at: []
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 80, fixed: 'left'},
          {title: '提现 ID', align: 'center', width: 80, key: 'id'},
          {title: 'UID', align: 'center', width: 80, key: 'user_id'},
          {title: '用户名', align: 'center', width: 120, key: 'user_name', render: (h, params) => {
            return h('span', params.row.user != null ? params.row.user.name : '');
          }},
          {title: '手机号', align: 'center', width: 120, key: 'user_phone', render: (h, params) => {
            return h('span', params.row.user != null ? params.row.user.phone : '');
          }},
          {title: '可提现金额', align: 'center', width: 100, key: 'total_money', render: (h, params) => {
            return h('span', params.row.user != null ? params.row.user.money : '');
          }},
          {title: '提现金额', align: 'center', width: 100, key: 'money'},
          {title: '应扣税额', align: 'center', width: 100, key: 'charge_money'},
          {title: '实际打款', align: 'center', width: 100, key: 'real_money'},
          {title: '提现到账', align: 'center', width: 100, key: 'get_type_name'},
          // {title: '真实姓名', align: 'center', key: 'real_name'},
          // {title: '收款账号信息', align: 'center', key: 'bank_info', render: (h, params) => {
          //   var btn = [h('span', params.row.bank_info + "  ")];

          //   if (params.row.get_type != 'bank') {
          //     btn.push(h('Button', {
          //       props: {
          //         type: 'primary',
          //         size: 'small',
          //         icon: 'md-eye'
          //       },
          //       style: {
          //         marginRight: '5px',
          //         marginBottom: '5px'
          //       },
          //       on: {
          //         click: () => {
          //           this.cardImage = params.row.image;
          //           if (params.row.status == 0) {
          //             this.cardInfo = this.applyInfo = "扫码向 " + (params.row.user != null ? params.row.user.name : '未知') + " 付款 " + params.row.money + " 元";
          //           } else {
          //             this.cardInfo = "该申请已处理";
          //           }
          //           this.cardImageShow = true;
          //         }
          //       }
          //     }));
          //   }

          //   return h('div', btn);
          // }},
          {title: '处理状态', align: 'center', width: 100, key: 'status_name'},
          {title: '备注信息', align: 'center', width: 180, key: 'status_msg'},
          {title: '提现时间', align: 'center', width: 180, key: 'created_at'},
          {title: '操作',
            key: 'action',
            align: 'center',
            width: 80,
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
                    title: '查看详情',
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
              ])
            }
          }
        ]
      },
      applyShow: false,
      saveLoading: false,
      applyInfo: '',
      applyForm: {
        id: 0,
        status: 0,
        status_msg: ''
      },
      applyValidate: {
        status_msg: [
          { required: true, message: '请输入处理备注', trigger: 'blur' }
        ],
      },
      cardImageShow: false,
      cardImage: "",
      cardInfo: "",
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
    showApply () {
      if (!this.currentRow.id) {
        this.$Notice.error({
          title: '提示',
          desc: "请先选择一条记录"
        });
        return false;
      }

      if (this.currentRow.status != 0) {
        this.$Notice.error({
          title: '提示',
          desc: "当前申请已处理，请不要重复处理"
        });
        return false;
      }
      this.applyInfo = "正在处理 " + (this.currentRow.user != null ? this.currentRow.user.name : '未知') + " 的 " + this.currentRow.money + " 元提现申请";
      this.applyShow = true;
    },
    cancel: function () {
      this.applyShow = false;
      this.applyForm.status = 0;
      this.applyForm.status_msg = "";
      this.applyInfo = "";
    },
    ok () {
      this.applyForm.status = 1;
      this.applyOper();
    },
    error () {
      this.applyForm.status = -1;
      this.applyOper();
    },
    applyOper: function () {
      var _this = this;

      _this.$Modal.confirm({
        title: '提示',
        content: '确定要处理吗？',
        onOk: function () {
          _this.applyRequest()
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    applyRequest: function () {
      var _this = this;
      _this.$refs['applyForm'].validate((valid) => {
        if (valid) {
          _this.saveLoading = true;
          Util.ajax({
            url: '/adminapi/partnerWalletApplys/'+ _this.currentRow.id +'/applyOper',
            method: 'patch',
            data: {status: this.applyForm.status, status_msg: this.applyForm.status_msg},
            success: function(result) {
              _this.saveLoading = false;
              if (result.error == 0) {
                _this.$Notice.success({
                  title: '提示',
                  desc: "处理成功"
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