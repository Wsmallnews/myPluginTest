<template lang="html">
  <div class="classrooms-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索课堂名" ></Input>
        </Form-item>

        <Form-item prop="teach_id">
          <Select style="width:200px" v-model="listConf.searchParams.teach_id" clearable placeholder="讲师">
            <Option v-for="(teacher, index) in teachers" :key="index" :label="teacher.name" :value="teacher.id" ></Option>
          </Select>
        </Form-item>
        <Form-item prop="tag">
          <Select style="width:200px" v-model="listConf.searchParams.tag" clearable placeholder="标签">
            <Option v-for="(tag, index) in tags" :label="tag.name" :key="index" :value="tag.name" ></Option>
          </Select>
        </Form-item>
      </template>
      <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/classroomManage/add' })"><Icon type="plus-round"></Icon>薪课堂添加</Button>
      </template>
    </myTable>

    <Modal v-model="showDetail" :closable="true" :mask-closable=false :width="700">
      <Menu mode="horizontal" theme="light" active-name="info" @on-select="getItem">
        <MenuItem name="info" >薪课堂信息</MenuItem>
        <MenuItem name="download" >薪课堂资料</MenuItem>
        <MenuItem name="question_practice" >练习题目</MenuItem>
        <MenuItem name="question_challenge" >挑战题目</MenuItem>
      </Menu>

      <div style="height: 20px;"></div>

      <div v-if="menuActivity == 'download'">
        <download type="classroom" :item-id="detail.id" :item="detail"></download>
      </div>

      <div >
        <Question ref="practice"
            v-if="menuActivity == 'question_practice'"
            type="classroom"
            do-type="practice"
            :item-id="detail.id" :item="detail">
        </Question>

        <Question ref="challenge"
            v-if="menuActivity == 'question_challenge'"
            type="classroom"
            do-type="challenge"
            :item-id="detail.id" :item="detail">
        </Question>
      </div>
      <div v-if="menuActivity == 'info'">
        <div v-if="detail.name">
          <Row >
            <Col span="6" class="row-label">薪课堂名称：</Col>
            <Col span="18" class="row-content">{{ detail.name }}</Col>
          </Row>
          <Row v-if="detail.image">
            <Col span="6" class="row-label">薪课堂图片：</Col>
            <Col span="18" class="row-content">
              <img class="detail-images" style="width: 125px;height: 50px;" :src="detail.image" @click="showBigImg(detail.image)" />
            </Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">标签：</Col>
            <Col span="18" class="row-content">
              <Tag
                  v-for="(item, ind) in detail.tag_arr"
                  :key="ind"
                  :checkable="false"
                  :checked="false"
                  type="border"
                  size="medium"
                  color="primary"
                  >
                  {{ item }}
                </Tag>
            </Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">报名人数：</Col>
            <Col span="18" class="row-content">
              可报名人数：{{ detail.join_num }} &nbsp;&nbsp; 已报名人数：{{ detail.joined_num }}
              <Button type="text" @click="jumpPage('/classroomManage/user/' + detail.id)">查看报名列表</Button>
            </Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">报名截止时间：</Col>
            <Col span="18" class="row-content">{{ detail.join_end_at }}</Col>
          </Row>

          <Row>
            <Col span="6" class="row-label">讲师：</Col>
            <Col span="18" class="row-content">
              <span v-if="detail.teach">
                {{ detail.teach.name }}({{detail.teach.phone}})
              </span>
            </Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">辅导老师：</Col>
            <Col span="18" class="row-content">
              <span v-if="detail.coach">
                {{ detail.coach.name }}({{detail.coach.phone}})
              </span>
            </Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">微信二维码：</Col>
            <Col span="18" class="row-content">
              <img class="detail-images" :src="detail.wechat_qrcode" @click="showBigImg(detail.wechat_qrcode)" />
            </Col>
          </Row>
          <!-- <Row>
            <Col span="6" class="row-label">直播间 ID：</Col>
            <Col span="18" class="row-content">{{ detail.live_id }}</Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">课时名称：</Col>
            <Col span="18" class="row-content">{{ detail.live_name }}</Col>
          </Row> -->
          <Row>
            <Col span="6" class="row-label">费用：</Col>
            <Col span="18" class="row-content">
              <span v-if="detail.is_charge">
                ￥{{ detail.charge_money }}
              </span>
              <span v-else>
                免费
              </span>
            </Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">VIP 费用：</Col>
            <Col span="18" class="row-content">
              <span v-if="detail.is_vip_charge">
                ￥{{ detail.vip_charge_money }}
              </span>
              <span v-else>
                免费
              </span>
            </Col>
          </Row>

          <Row>
            <Col span="6" class="row-label">浏览量：</Col>
            <Col span="18" class="row-content">{{ detail.view_num }}</Col>
          </Row>

          <Row>
            <Col span="6" class="row-label">推荐状态：</Col>
            <Col span="18" class="row-content">
              <span v-if="detail.is_recommend == 1">
                推荐
              </span>
              <span v-else>
                未推荐
              </span>
            </Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">创建时间：</Col>
            <Col span="18" class="row-content">{{ detail.created_at }}</Col>
          </Row>

          <Row>
            <Col span="6" class="row-label">详情：</Col>
            <Col span="18" class="row-content content-detail" v-html="detail.content"></Col>
          </Row>

          <Row>
            <Col span="6" class="row-label">温馨提醒：</Col>
            <Col span="18" class="row-content content-detail" v-html="detail.reminder"></Col>
          </Row>

          <hr v-if="detail.contents.length" style="color: #e8eaec" />

          <template v-for="(content, index) in detail.contents">
            <Row>
              <Col span="6" class="row-label">课时 {{ index + 1 }} 名称：</Col>
              <Col span="18" class="row-content">
                {{ content.name }} &nbsp;&nbsp; 评价讲师状态：{{ content.is_teach_comment ? '已开启' : '未开启' }}
              </Col>
            </Row>
            <Row>
              <Col span="6" class="row-label">课时 {{ index + 1 }} 直播间 ID：</Col>
              <Col span="18" class="row-content">{{ content.live_id }}</Col>
            </Row>
            <Row>
              <Col span="6" class="row-label">课时 {{ index + 1 }} 作业：</Col>
              <Col span="18" class="row-content">{{ content.homework }}</Col>
            </Row>
            <Row>
              <Col span="6" class="row-label">课时 {{ index + 1 }} 时间：</Col>
              <Col span="18" class="row-content">{{ content.start_at }} - {{ content.end_at }}</Col>
            </Row>

          </template>
        </div>

        <hr v-if="!getMoreIng && moreDetail.id" style="color: #e8eaec" />
        <div v-if="!getMoreIng && moreDetail.id">
          <h3 slot="header" style="color:#2D8CF0">报名统计</h3>
          <Row>
            <Col span="6" class="row-label">浏览人数：</Col>
            <Col span="18" class="row-content">{{ detail.view_num }}人</Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">报名人数：</Col>
            <Col span="18" class="row-content">{{ detail.joined_num }}人</Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">转化率：</Col>
            <Col v-if="detail.joined_num > 0" span="18" class="row-content">{{ ((detail.joined_num / detail.view_num) * 100).toFixed(2) }}%</Col>
            <Col v-else span="18" class="row-content">0%</Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">普通会员报名人数：</Col>
            <Col span="18" class="row-content">{{ detail.joined_num - detail.vip_joined_num }}人</Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">VIP报名人数：</Col>
            <Col span="18" class="row-content">{{ detail.vip_joined_num }}人</Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">普通会员报名费收入：</Col>
            <Col span="18" class="row-content">￥{{ moreDetail.money_total - moreDetail.vip_money_total }}</Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">VIP会员报名费收入：</Col>
            <Col span="18" class="row-content">￥{{ moreDetail.vip_money_total }}</Col>
          </Row>
          <Row>
            <Col span="6" class="row-label">合计报名费收入：</Col>
            <Col span="18" class="row-content">￥{{ moreDetail.money_total }}</Col>
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
import Download from '@/view/includes/custom/download'
import Question from '@/view/includes/custom/question'

export default {
  components: {
    myTable,
    Download,
    Question
  },
  data () {
    return {
      menuActivity: 'info',
      detail: {},
      moreDetail: {},
      getMoreIng: false,
      showDetail: false,
      bigImgShow: false,
      bigImg: '',
      currentRow: {},
      teachers: [],
      tags: [],
      listConf: {
        url: '/adminapi/classrooms',
        searchParams: {
          name: '',
          teach_id: 0,
          tag: ''
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '课堂名称', align: 'center', width: 200, key: 'name'},
          {title: '状态', align: 'center', width: 100, key: 'status_name'},
          {title: '标签', align: 'center', width: 100, key: 'tagstr', render: (h, params) => {
            return h('span', params.row.tag_arr.join(' '));
          }},
          {title: '讲师', align: 'center', width: 120, key: 'teach_name', render: (h, params) => {
            return h('span', params.row.teach != null ? params.row.teach.name : '');
          }},
          {title: '讲师手机号', align: 'center', width: 120, key: 'teach_phone', render: (h, params) => {
            return h('span', params.row.teach != null ? params.row.teach.phone : '');
          }},
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
            width: 240,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-contacts'
                  },
                  domProps: {
                    title: '查看报名用户',
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/classroomManage/user/' + id)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-list-box'
                  },
                  domProps: {
                    title: '查看课堂内容列表',
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/classroomManage/classroomContents/' + id)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-chatboxes'
                  },
                  domProps: {
                    title: '查看课堂讲师评论',
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/classroomManage/classroomTeachComments/' + id)
                    }
                  }
                }),
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
                    icon: 'md-copy'
                  },
                  domProps: {
                    title: '复制链接到剪贴板',
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click : () => {
                      this.doCopy(params.row.web_url);
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
                    title: '编辑',
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      var id = params.row.id
                      this.jumpPage('/classroomManage/edit/' + id)
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
          _this.classroomDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    classroomDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/classrooms/' + id,
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
        url: '/adminapi/classrooms/' + id + '/setStatus',
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
        url: '/adminapi/classrooms/' + id + '/setRecommend',
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
        data: {type: 'classroom'},
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
    showBigImg (src) {
      this.bigImg = src;
      this.bigImgShow = true;
    },
    getMoreDetail (id) {
      var _this = this;
      _this.getMoreIng = true;
      Util.ajax({
        url: '/adminapi/classrooms/more/' + id,
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
    doCopy: function (text) {
      var _this = this;
      this.$copyText(text).then(function (e) {
        _this.$Notice.success({title: '提示', desc: '复制成功'})
      }, function (e) {
        _this.$Notice.success({title: '提示', desc: '复制失败'})
      })
    },
    getItem(code) {
      this.menuActivity = code;
    }
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
