<template lang="html">
  <div class="users-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="id">
          <Input type="text" v-model="listConf.searchParams.id" placeholder="搜索UID" ></Input>
        </Form-item>
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索用户名" ></Input>
        </Form-item>
        <Form-item prop="phone">
          <Input type="text" v-model="listConf.searchParams.phone" placeholder="搜索手机号" ></Input>
        </Form-item>
        <Form-item prop="partner_type">
          <Select style="width:200px" v-model="listConf.searchParams.partner_type" placeholder="合伙人类型">
            <Option label="全部(合伙人类型)" value="0" ></Option>
            <Option label="初级合伙人" value="1" ></Option>
            <Option label="中级合伙人" value="2" ></Option>
            <Option label="高级合伙人" value="3" ></Option>
          </Select>
        </Form-item>
        <Form-item prop="partner_start">
          <sm-field
            v-model="listConf.searchParams.partner_start"
            :field="{type: 'datetime', placeholder: '请输入成为合伙人开始时间' }"
            >
          </sm-field>
        </Form-item>
        <Form-item prop="partner_end">
          <sm-field
            v-model="listConf.searchParams.partner_end"
            :field="{type: 'datetime', placeholder: '请输入成为合伙人结束时间' }"
            >
          </sm-field>
        </Form-item>
      </template>

       <template slot="formBtn" >
        <Button type="primary" @click="showApply"><Icon type="plus-round"></Icon>设置合伙人类型</Button>
      </template>
    </myTable>

    <Modal v-model="applyShow" :closable='false' :mask-closable=false :width="400">
      <h3 slot="header" style="color:#2D8CF0">设置合伙人</h3>
      <h3 style="color: #ffad33;margin-bottom: 10px;">{{ applyInfo }}</h3>
      <Form ref="applyForm" :model="applyForm" :label-width="100" label-position="right" :rules="applyValidate">
        <Form-item label="处理备注" prop="partner_type">
          <RadioGroup v-model="applyForm.partner_type">
            <Radio :label="1">初级合伙人(粉丝消费提成6%)</Radio>
            <Radio :label="2">中级合伙人(粉丝消费提成8%)</Radio>
            <Radio :label="3">高级合伙人(粉丝消费提成10%)</Radio>
          </RadioGroup>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" :loading="saveLoading" @click="setPartnerType">确定</Button>
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
      applyShow: false,
      saveLoading: false,
      applyInfo: '',
      applyForm: {
        id: 0,
        partner_type: 0,
      },
      applyValidate: {
        partner_type: [
          { required: true, type: 'number', min: 1, message: '请选择合伙人类型', trigger: 'change' }
        ],
      },

      detail: {},
      moreDetail: {},
      getMoreIng: false,
      showDetail: false,
      bigImgShow: false,
      bigImg: '',
      currentRow: {},
      categorys: [],
      listConf: {
        url: '/adminapi/partners',
        searchParams: {
          id: '',
          name: '',
          phone: '',
          partner_type: 0,
          partner_start: '',
          partner_end: '',
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: 'UID', align: 'center', width: 80, key: 'id'},
          {title: '用户名', align: 'center', width: 120, key: 'name'},
          {title: '手机号', align: 'center', width: 120, key: 'phone'},
          {title: '性别', align: 'center', width: 80, key: 'sex_name'},
          {title: '合伙人类型', align: 'center', width: 100, key: 'partner_type_name'},
          {title: '当前粉丝量', align: 'center', width: 100, key: 'partner_fans_num'},
          {title: '粉丝总收益', align: 'center', width: 100, key: 'partner_fans_money'},
          {title: '粉丝升VIP数量', align: 'center', width: 100, key: 'partner_become_vip_num'},
          {title: '平台奖励总收益', align: 'center', width: 100, key: 'partner_flat_money'},
          {title: '合计收益', align: 'center', width: 100, key: 'partner_money_total'},
          {title: '可提现收益', align: 'center', width: 100, key: 'partner_money'},
          {title: '可提现收益', align: 'center', width: 100, key: 'partner_money'},
          {title: '加入合伙人时间', align: 'center', width: 200, key: 'partner_at'},
          {title: '操作',
            key: 'action',
            align: 'center',
            width: 120,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                // h('Button', {
                //   props: {
                //     type: 'primary',
                //     size: 'small',
                //     icon: 'md-eye'
                //   },
                //   domProps: {
                //     title: '查看详情',
                //   },
                //   style: {
                //     marginRight: '5px',
                //     marginBottom: '5px'
                //   },
                //   on: {
                //     click: () => {
                //       this.detail = params.row;
                //       this.showDetail = true;

                //       this.getMoreDetail(this.detail.id);
                //     }
                //   }
                // }),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-cash'
                  },
                  domProps: {
                    title: '查看钱包记录',
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/partnerManage/walletLogs/' + id)
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
    showApply () {
      if (!this.currentRow.id) {
        this.$Notice.error({
          title: '提示',
          desc: "请先选择一条记录"
        });
        return false;
      }

      this.applyForm.id = this.currentRow.id;
      this.applyInfo = "正在处理用户：" + this.currentRow.name + " - " + this.currentRow.phone;
      this.applyShow = true;
    },
    cancel: function () {
      this.applyShow = false;
      this.applyForm.id = 0;
      this.applyForm.partner_type = 0;
      this.applyInfo = "";
    },
    setPartnerType () {
      var _this = this;
      _this.$refs['applyForm'].validate((valid) => {
        if (valid) {
          _this.saveLoading = true;
          Util.ajax({
            url: '/adminapi/partners/' + this.applyForm.id + '/setPartnerType',
            method: 'patch',
            data: {partner_type: this.applyForm.partner_type},
            success: function (result) {
              if (result.error == 0) {
                _this.$Notice.success({title: '提示', desc: '操作成功'})
                _this.cancel();
                _this.$refs.listTable.listLoad()
              } else {
                _this.$Notice.error({title: '提示', desc: result.info})
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
