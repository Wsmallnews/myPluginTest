<template lang="html">
  <div class="users-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" 
      @searchReset="searchReset" @on-selection-change="onSelectChange">
      <template slot="formItem" >
        <Button v-if="!searchShowMore" @click="searchShowMore = !searchShowMore" icon="md-apps" type="default" title="展开高级搜索" style="margin-right: 5px;">展开</Button>
        <Button v-else @click="searchShowMore = !searchShowMore" icon="md-apps" type="primary" title="隐藏高级搜索" style="margin-right: 5px;">隐藏</Button>

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

        <br v-if="searchShowMore" />
        <div v-if="searchShowMore">
          <!-- 性别 -->
            <Row>
              <Col span="3">性别</Col>
              <Col span="21">
                <sm-field
                  v-model="listConf.searchParams.sex"
                  :field="{type: 'radio', placeholder: '请选择性别', radios: [
                    {label: '全部', value: 'all'},
                    {label: '男', value: 1},
                    {label: '女', value: 2},
                    {label: '未知', value: 0},
                  ]}"
                  >
                </sm-field>
              </Col>
            </Row>
              
            <Row>
              <Col span="3" style="line-height: 32px;">地区</Col>
              <Col span="21">
                <Cascader style="width: 300px" :data="regionData" v-model="regionValue" change-on-select @on-change="regionChange"></Cascader>
              </Col>
            </Row>

            <Row>
              <Col span="3" style="line-height: 32px;">行业</Col>
              <Col span="21">
                <Input type="text" style="width: 300px" v-model="listConf.searchParams.industry" placeholder="请输入行业" ></Input>
              </Col>
            </Row>
            <Row>
              <Col span="3" style="line-height: 32px;">登录次数</Col>
              <Col span="21">
                <sm-field
                  v-model="listConf.searchParams.login_num"
                  :field="{type: 'radio', placeholder: '请选择登录次数', radios: [
                    {label: '全部', value: 'all'},
                    {label: '首次登录', value: '1'},
                    {label: '2-5次登录', value: '2-5'},
                    {label: '6-10次登录', value: '6-10'},
                    {label: '11-30次登录', value: '11-30'},
                    {label: '30次以上登录', value: '31-all'},
                  ]}"
                  >
                </sm-field>
              </Col>
            </Row>
            <Row>
              <Col span="3" style="line-height: 32px;">分享次数</Col>
              <Col span="21">
                <sm-field
                  v-model="listConf.searchParams.share_num"
                  :field="{type: 'radio', placeholder: '请选择分享次数', radios: [
                    {label: '全部', value: 'all'},
                    {label: '未分享', value: '0'},
                    {label: '首次分享', value: '1'},
                    {label: '2-5次分享', value: '2-5'},
                    {label: '6-10次分享', value: '6-10'},
                    {label: '11-30次分享', value: '11-30'},
                    {label: '30次以上分享', value: '31-all'},
                  ]}"
                  >
                </sm-field>
              </Col>
            </Row>
            <Row>
              <Col span="3" style="line-height: 32px;">留言次数</Col>
              <Col span="21">
                <sm-field
                  v-model="listConf.searchParams.comment_num"
                  :field="{type: 'radio', placeholder: '请选择留言次数', radios: [
                    {label: '全部', value: 'all'},
                    {label: '未留言', value: '0'},
                    {label: '首次留言', value: '1'},
                    {label: '2-5次留言', value: '2-5'},
                    {label: '6-10次留言', value: '6-10'},
                    {label: '11-30次留言', value: '11-30'},
                    {label: '30次以上留言', value: '31-all'},
                  ]}"
                  >
                </sm-field>
              </Col>
            </Row>
            <Row>
              <Col span="3" style="line-height: 32px;">付费次数</Col>
              <Col span="21">
                <sm-field
                  v-model="listConf.searchParams.pay_num"
                  :field="{type: 'radio', placeholder: '请选择付费次数', radios: [
                    {label: '全部', value: 'all'},
                    {label: '未付费', value: '0'},
                    {label: '首次付费', value: '1'},
                    {label: '2-5次付费', value: '2-5'},
                    {label: '6-10次付费', value: '6-10'},
                    {label: '11-30次付费', value: '11-30'},
                    {label: '30次以上付费', value: '31-all'},
                  ]}"
                  >
                </sm-field>
              </Col>
            </Row>
            <Row>
              <Col span="3" style="line-height: 32px;">VIP</Col>
              <Col span="21">
                <sm-field
                  v-model="listConf.searchParams.vip"
                  :field="{type: 'radio', placeholder: '请选择 VIP 类型', radios: [
                    {label: '全部', value: 'all'},
                    {label: '月 VIP', value: 'month'},
                    {label: '年 VIP', value: 'year'},
                    {label: '7 天内到期', value: 'seven'},
                    {label: '已到期', value: 'old'},
                  ]}"
                  >
                </sm-field>
              </Col>
            </Row>
        </div>
      </template>

      <template slot="formBtn">
        <Button type="primary" @click="sendSms()"><Icon type="md-paper-plane" />发送短信</Button>
        <Button type="primary" @click="sendVIP()">赠送VIP</Button>
      </template>
    </myTable>

    <Modal v-model="sendShow" :closable='false' :mask-closable=false :width="400">
      <h3 slot="header" style="color:#2D8CF0">处理</h3>
      <h3 style="color: #ffad33;margin-bottom: 10px;">{{ currentSendInfo }}</h3>
      <Form ref="sendForm" :model="sendForm" :label-width="100" label-position="right" :rules="sendValidate">
        <Form-item label="阿里云模板 ID" prop="template_id">
          <Input v-model="sendForm.template_id" type="text" placeholder="阿里云模板 ID"></Input>
        </Form-item>
        <Form-item label="请输入模板内容" prop="content">
          <Input v-model="sendForm.content" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="阿里云模板变量格式：{title:标题}"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" :loading="saveLoading" @click="ok">发送</Button>
      </div>
    </Modal>

    <Modal v-model="sendVIPShow" :closable='false' :mask-closable=false :width="400">
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
    </Modal>


    <Modal v-model="showDetail" :closable="true" :mask-closable=false :width="1000">
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
          <Col span="6" class="row-label">是否合伙人：</Col>
          <Col v-if="detail.is_partner" span="18" class="row-content">{{ detail.partner_type_name }}</Col>
          <Col v-else span="18" class="row-content">否</Col>
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
        <!-- <Row>
          <Col span="6" class="row-label">提升技能：</Col>
          <Col span="18" class="row-content">{{ detail.skill }}</Col>
        </Row> -->
        <Row>
          <Col span="6" class="row-label">自我介绍：</Col>
          <Col span="18" class="row-content">{{ detail.intro }}</Col>
        </Row>
      </div>

      <div v-if="!getMoreIng && moreDetail.id">
        <h3 slot="header" style="color:#2D8CF0">互动信息</h3>
        <Row>
          <Col span="6" class="row-label">分享次数：</Col>
          <Col span="18" class="row-content">{{ moreDetail.share_num }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">留言次数：</Col>
          <Col span="18" class="row-content">{{ moreDetail.comment_num }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">留言精选次数：</Col>
          <Col span="18" class="row-content">{{ moreDetail.comment_quality_num }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">留言删除次数：</Col>
          <Col span="18" class="row-content">{{ moreDetail.comment_delete_num }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">登录次数：</Col>
          <Col span="18" class="row-content">{{ moreDetail.login_num }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">累计登录时长：</Col>
          <Col span="18" class="row-content">{{ moreDetail.login_time_for }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">学习次数：</Col>
          <Col span="18" class="row-content">{{ moreDetail.study_num }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">获得优惠券金额：</Col>
          <Col span="18" class="row-content">{{ moreDetail.coupon_money }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">已使用优惠券金额：</Col>
          <Col span="18" class="row-content">{{ moreDetail.use_coupon_money }}</Col>
        </Row>
      </div>

      <div v-if="!getMoreIng && moreDetail.id">
        <h3 slot="header" style="color:#2D8CF0">付费信息</h3>
        <Row>
          <Col span="6" class="row-label">付费总金额：</Col>
          <Col span="18" class="row-content">{{ moreDetail.total_money }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">付费次数：</Col>
          <Col span="18" class="row-content">{{ moreDetail.pay_num }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">首次付费时间：</Col>
          <Col span="18" class="row-content">{{ moreDetail.first_payed_at }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">最近一次付费时间：</Col>
          <Col span="18" class="row-content">{{ moreDetail.last_payed_at }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">付费明细：</Col>
        </Row>
        <Row v-if="moreDetail.orders">
          <Col span="24" class="row-content">
            <Table
              :highlight-row="true"
              :stripe="true"
              :columns="orderColumns"
              :data="moreDetail.orders"
              >
            </Table>
          </Col>
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
      currentSendInfo: '',
      currentSelect: [],
      currentSelectUserName: [],
      sendShow: false,
      sendVIPShow:false,
      vipOptions:[{
        id:1,
        name:'1年'
      },
      {
        id:2,
        name:'2年'
      },
      {
        id:3,
        name:'3年'
      },
      {
        id:4,
        name:'4年'
      },
      {
        id:5,
        name:'5年'
      }],
      saveLoading: false,
      sendInfo: '',
      sendForm: {
        template_id: '',
        content: '',
        years:1
      },
      sendValidate: {
        template_id: [
          { required: true, message: '请输入阿里云模板 ID', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入模板内容', trigger: 'blur' }
        ],
      },
      regionValue: [],
      regionData: [],
      orderColumns: [
        {title: '订单号', align: 'center', width: 120, key: 'order_sn'},
        {title: '流水号', align: 'center', width: 150, key: 'transaction_id'},
        {title: '类型', align: 'center', width: 150, key: 'type_name'},
        {title: '名称', align: 'center', width: 150, key: 'subject'},
        {title: '订单总金额', align: 'center', width: 80, key: 'total_money'},
        {title: '支付金额', align: 'center', width: 80, key: 'wechat_fee'},
        {title: '支付时间', align: 'center', width: 150, key: 'payed_at'},
      ],
      searchShowMore: false,
      detail: {},
      moreDetail: {},
      getMoreIng: false,
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
          created_end: '',
          sex: 'all',
          region: [],
          industry: '',
          login_num: 'all',
          share_num: 'all',
          comment_num: 'all',
          pay_num: 'all',
          vip: 'all'
        },
        item: [],
        columns: [
          {type: 'selection', align: 'center', width: 50, fixed: 'left'},
          {type: 'index', align: 'center', width: 50, fixed: 'left'},
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
          {title: 'VIP类型', align: 'center', width: 80, key: 'vip_type_name'},
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
          {title: '是否合伙人', align: 'center', width: 100, key: 'is_partner', render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.is_partner,
                  size: 'large',
                  'true-value': 1,
                  'false-value': 0,
                  'before-change': () => {
                    return new Promise((resolve) => {
                      var _this = this
                      var msg = params.row.is_partner ? '确定取消该用户合伙人身份吗？' : '确定将该用户设置为合伙人吗？默认为初级合伙人'
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
                    _this.setPartner(id, status)
                  },
                }
              })
            ])
          }},
          {title: '禁用状态', align: 'center', width: 100, key: 'is_invalid', render: (h, params) => {
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

                      this.getMoreDetail(this.detail.id);
                    }
                  }
                }),
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
    setPartner (id, status) {
      var _this = this

      Util.ajax({
        url: '/adminapi/users/' + id + '/setPartner',
        method: 'patch',
        data: {is_partner: status},
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
    },
    getMoreDetail (user_id) {
      var _this = this;
      _this.getMoreIng = true;
      Util.ajax({
        url: '/adminapi/userStatics/' + user_id,
        method: 'get',
        success: function (result) {
          _this.getMoreIng = false;
          if (result.error == 0) {
            _this.moreDetail = result.result;
          } else {
            _this.$Notice.error({title: '提示', desc: result.info})
          }
        }
      })
    },
    getCascader () {
      var _this = this;
      Util.ajax({
        url: "/adminapi/getCascader",
        method: "get",
        success: function(result){
          if (result.error == 0) {
            _this.regionData = result.result;
          }else{
            _this.$Notice.error({title: '提示', desc: result.info})
          }
        }
      });
    },
    regionChange (value, selectedData) {
      var region = [];

      for (let data of selectedData) {
        region.push(data.short_name);
      }
      this.regionValue = value;
      this.listConf.searchParams.region = region;
    },
    onSelectChange (selection) {
      this.setSelect(selection);
    },
    setSelect(selection) {
      let currentSelect = [];
      let currentSelectUserName = [];
      for (let select of selection) {
        currentSelect.push(select.id);
        currentSelectUserName.push(select.name);
      }

      this.currentSelect = currentSelect;
      this.currentSelectUserName = currentSelectUserName;
    },
    sendSms () {
      var _this = this;
      if (!this.currentSelect.length) {
        _this.$Notice.error({title: '提示', desc: '请选择要发送的用户'})
        return false;
      }
      var names = this.currentSelectUserName.join(", ");
      this.currentSendInfo = '当前已选择:' + names + "；共 (" + this.currentSelect.length + ") 人";

      this.sendShow = true;
    },
    sendVIP () {
      var _this = this;
      if (!this.currentSelect.length) {
        _this.$Notice.error({title: '提示', desc: '请选择要赠送VIP的用户'})
        return false;
      }
      var names = this.currentSelectUserName.join(", ");
      this.currentSendInfo = '当前已选择:' + names + "；共 (" + this.currentSelect.length + ") 人";

      this.sendVIPShow = true;
    },
    processSendVIP(){
       var _this = this;
      _this.sendForm.id = this.currentSelect;

      _this.$Modal.confirm({
        title: '提示',
        content: '确定要处理吗？',
        onOk: function () {
          _this.$refs['sendForm'].validate((valid) => {
            if (valid) {
              _this.saveLoading = true;
              Util.ajax({
                url: '/adminapi/users/sendVIP',
                method: 'post',
                data: _this.sendForm,
                success: function (result) {
                  if (result.error == 0) {
                    _this.cancel();
                    _this.$Notice.success({title: '提示', desc: result.info})
                  } else {
                    _this.saveLoading = false;
                    _this.$Notice.error({title: '提示', desc: result.info})
                  }
                }
              })
            } else {
              _this.$Notice.error({title: '提示', desc: "信息填写不完整"})
            }
          })
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    cancel: function () {
      this.sendShow = false;
      this.saveLoading = false;
    },
    cancelVIPSending:function(){
      this.sendVIPShow = false;
      this.saveLoading = false;
    },
    ok () {
      var _this = this;

      _this.sendForm.id = this.currentSelect;

      _this.$Modal.confirm({
        title: '提示',
        content: '确定要处理吗？',
        onOk: function () {
          _this.$refs['sendForm'].validate((valid) => {
            if (valid) {
              _this.saveLoading = true;
              Util.ajax({
                url: '/adminapi/users/sendSms',
                method: 'post',
                data: _this.sendForm,
                success: function (result) {
                  if (result.error == 0) {
                    _this.cancel();
                    _this.$Notice.success({title: '提示', desc: result.info})
                  } else {
                    _this.saveLoading = false;
                    _this.$Notice.error({title: '提示', desc: result.info})
                  }
                }
              })
            } else {
              _this.$Notice.error({title: '提示', desc: "信息填写不完整"})
            }
          })
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    applyOper: function () {
      
    },
  },
  created: function () {
    var _this = this

    this.getCascader();
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
