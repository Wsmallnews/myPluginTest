<template>
  <div class="question">
    <div class="btns">
      <Button type="primary" @click="tutorCatAdd"><Icon type="md-paper-plane" />添加咨询方向</Button>
    </div>

    <div style="height: 20px;"></div>

    <div class="tutor-cat-list" v-if="list.length">
      <div class="tutor-cat-content" v-for="(item, index) in list" :key="index">
        <div class="key-value"><div class="cat-key">咨询方向：</div><div class="cat-value">{{ item.name }}</div></div>
        <div class="key-value"><div class="cat-key">所属模块：</div><div class="cat-value">{{ item.type_name }}</div></div>
        <div class="key-value">
          <div class="cat-key">咨询方式：</div>
          <div class="cat-value">
            <div v-if="item.is_mode_phone">
              <div><strong>电话咨询</strong></div>
              <div class="key-value"><div class="cat-key">单次咨询时长：</div><div class="cat-value">{{ item.mode_phone.time }} 分钟</div></div>
              <div class="key-value"><div class="cat-key">普通咨询费用：</div><div class="cat-value">{{ item.mode_phone.price }} 元/人</div></div>
              <div class="key-value"><div class="cat-key">VIP咨询费用：</div><div class="cat-value">{{ item.mode_phone.vip_price }} 元/人</div></div>
            </div>
            <div v-if="item.is_mode_video">
              <div><strong>视频咨询</strong></div>
              <div class="key-value"><div class="cat-key">单次咨询时长：</div><div class="cat-value">{{ item.mode_video.time }} 分钟</div></div>
              <div class="key-value"><div class="cat-key">普通咨询费用：</div><div class="cat-value">{{ item.mode_video.price }} 元/人</div></div>
              <div class="key-value"><div class="cat-key">VIP咨询费用：</div><div class="cat-value">{{ item.mode_video.vip_price }} 元/人</div></div>
            </div>
            <div v-if="item.is_mode_offline">
              <div><strong>线下咨询</strong></div>
              <div class="key-value"><div class="cat-key">单次咨询时长：</div><div class="cat-value">{{ item.mode_offline.time }} 分钟</div></div>
              <div class="key-value"><div class="cat-key">普通咨询费用：</div><div class="cat-value">{{ item.mode_offline.price }} 元/人</div></div>
              <div class="key-value"><div class="cat-key">VIP咨询费用：</div><div class="cat-value">{{ item.mode_offline.vip_price }} 元/人</div></div>
              <div class="key-value"><div class="cat-key">线下咨询城市：</div><div class="cat-value">{{ item.mode_offline.city }}</div></div>
            </div>
          </div>
        </div>
        <div class="key-value"><div class="cat-key">是否需要上传简历：</div><div class="cat-value">{{ item.resume_name }}</div></div>
        <div class="tutor-cat-oper">
          <Icon type="md-brush" class="oper-icon" title="删除" @click="tutorCatEdit(item)" />
          <Icon type="md-trash" class="oper-icon" title="编辑" @click="tutorCatsDelete(item)" />
        </div>
      </div>
    </div>

    <Modal v-model="showAddEdit" :closable="true" :mask-closable="false" :footer-hide="true" :width="700" :height="400" :styles="{top: '20px'}">
      <h3 slot="header" style="color:#2D8CF0" v-if="formValidate.id">编辑咨询方向</h3>
      <h3 slot="header" style="color:#2D8CF0" v-else>添加咨询方向</h3>

      <Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <Form-item label="咨询方向" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入咨询方向"></Input>
        </Form-item>
        <Form-item label="所属模块" prop="type">
          <Select v-model="formValidate.type">
            <Option value="job" key="job">职业咨询</Option>
            <Option value="psychology" key="psychology">心理咨询</Option>
            <Option value="policy" key="policy">决策咨询</Option>
          </Select>
        </Form-item>

        <Form-Item label="咨询方式" prop="">
          <Form-item label="电话咨询" prop="is_mode_phone">
            <i-switch v-model="formValidate.is_mode_phone" :true-value="1" :false-value="0"></i-switch>
          </Form-item>
          <Form-item label="单次咨询时长" prop="mode_phone.time">
            <Input-Number v-model="formValidate.mode_phone.time" placeholder="请输入单次咨询时长 单位：分钟"></Input-Number>
          </Form-item>
          <Form-item label="普通咨询费用" prop="mode_phone.price">
            <Input-Number v-model="formValidate.mode_phone.price" placeholder="请设置普通费用 单位：元/人"></Input-Number>
          </Form-item>
          <Form-item label="VIP咨询费用" prop="mode_phone.vip_price">
            <Input-Number v-model="formValidate.mode_phone.vip_price" placeholder="请设置VIP费用 单位：元/人"></Input-Number>
          </Form-item>

          <div style="margin-bottom: 20px;border-bottom: 1px solid #ccc;"></div>

          <Form-item label="视频咨询" prop="is_mode_video">
            <i-switch v-model="formValidate.is_mode_video" :true-value="1" :false-value="0"></i-switch>
          </Form-item>
          <Form-item label="单次咨询时长" prop="mode_video.time">
            <Input-Number v-model="formValidate.mode_video.time" placeholder="请输入单次咨询时长 单位：分钟"></Input-Number>
          </Form-item>
          <Form-item label="普通咨询费用" prop="mode_video.price">
            <Input-Number v-model="formValidate.mode_video.price" placeholder="请设置普通费用 单位：元/人"></Input-Number>
          </Form-item>
          <Form-item label="VIP咨询费用" prop="mode_video.vip_price">
            <Input-Number v-model="formValidate.mode_video.vip_price" placeholder="请设置VIP费用 单位：元/人"></Input-Number>
          </Form-item>

          <div style="margin-bottom: 20px;border-bottom: 1px solid #ccc;"></div>

          <Form-item label="线下咨询" prop="is_mode_offline">
            <i-switch v-model="formValidate.is_mode_offline" :true-value="1" :false-value="0"></i-switch>
          </Form-item>
          <Form-item label="单次咨询时长" prop="mode_offline.time">
            <Input-Number v-model="formValidate.mode_offline.time" placeholder="请输入单次咨询时长 单位：分钟"></Input-Number>
          </Form-item>
          <Form-item label="普通咨询费用" prop="mode_offline.price">
            <Input-Number v-model="formValidate.mode_offline.price" placeholder="请设置普通费用 单位：元/人"></Input-Number>
          </Form-item>
          <Form-item label="VIP咨询费用" prop="mode_offline.vip_price">
            <Input-Number v-model="formValidate.mode_offline.vip_price" placeholder="请设置VIP费用 单位：元/人"></Input-Number>
          </Form-item>
          <Form-item label="线下咨询城市" prop="mode_offline.city">
            <Input v-model="formValidate.mode_offline.city" placeholder="请输入支持线下咨询的城市"></Input>
          </Form-item>
        </Form-Item>

        <Form-Item label="是否需要简历" prop="is_resume">
          <i-switch v-model="formValidate.is_resume" :true-value="1" :false-value="0"></i-switch>
        </Form-Item>
        <Form-item>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </Form-item>
      </Form>
    </Modal>

  </div>
</template>

<script>
import Util from '@/libs/util'

export default {
  name: 'tutorCat',
  props: {
    itemId: {
      default: 0
    },
    item: {
      default: {}
    }
  },
  data () {
    return {
      list: [],
      showAddEdit: false,
      question_answer: '', // 临时存储正确答案
      formValidate: {
        id: 0,
        user_id: this.itemId,
        name: '',
        type: 'job',
        is_mode_phone: 0,
        mode_phone: {
          time: 0,
          price: 0,
          vip_price: 0
        },
        is_mode_video: 0,
        mode_video: {
          time: 0,
          price: 0,
          vip_price: 0
        },
        is_mode_offline: 0,
        mode_offline: {
          time: 0,
          price: 0,
          vip_price: 0,
          city: ''
        },
        is_resume: 0
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入咨询方向', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择所属模块', trigger: 'change' }
        ]
      },
      backupForm: {}
    }
  },
  watch: {
    itemId (value) {
      if (value) {
        this.getList()
      }
    }
  },
  computed: {
    isEdit () {
      return !!this.formValidate.id
    }
  },
  methods: {
    getList () {
      var _this = this

      Util.ajax({
        url: 'adminapi/tutorCats',
        method: 'get',
        data: { user_id: this.itemId },
        success: function (result) {
          if (result.error == 0) {
            _this.list = result.result
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
    tutorCatsDelete (item) {
      var _this = this

      _this.$Modal.confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk: function () {
          Util.ajax({
            url: 'adminapi/tutorCats/' + item.id,
            method: 'delete',
            success: function (result) {
              if (result.error == 0) {
                _this.$Notice.success({
                  title: '提示',
                  desc: '删除成功'
                })
                _this.getList() // 重新刷新课程资料列表
              } else {
                _this.$Notice.error({
                  title: '提示',
                  desc: result.info
                })
              }
            }
          })
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    tutorCatAdd () {
      this.formValidate = JSON.parse(JSON.stringify(this.backupForm))
      this.showAddEdit = true
    },
    tutorCatEdit (item) {
      var _this = this

      for (var i in _this.formValidate) {
        _this.formValidate[i] = item[i]
      }

      this.showAddEdit = true
    },
    handleSubmit (name) {
      var _this = this

      _this.$refs[name].validate((valid) => {
        if (valid) {
          var values = this.formValidate

          var count = 0
          if (values.is_mode_phone) {
            if (!values.mode_phone.time || !values.mode_phone.price || !values.mode_phone.vip_price) {
              _this.$Notice.error({
                title: '提示',
                desc: '电话咨询信息填写不完整'
              })
              return false
            }
          } else {
            count++
          }
          if (values.is_mode_video) {
            if (!values.mode_video.time || !values.mode_video.price || !values.mode_video.vip_price) {
              _this.$Notice.error({
                title: '提示',
                desc: '视频咨询信息填写不完整'
              })
              return false
            }
          } else {
            count++
          }
          if (values.is_mode_offline) {
            if (!values.mode_offline.time || !values.mode_offline.price ||
                !values.mode_offline.vip_price || !values.mode_offline.city) {
              _this.$Notice.error({
                title: '提示',
                desc: '线下咨询信息填写不完整'
              })
              return false
            }
          } else {
            count++
          }

          if (count == 3) {
            _this.$Notice.error({
              title: '提示',
              desc: '请至少选择一个咨询方式'
            })
            return false
          }

          var url = '/adminapi/tutorCats'
          var method = 'post'
          if (values.id) {
            url = url + '/' + values.id
            var method = 'patch'
          }
          Util.ajax({
            url: url,
            method: method,
            data: values,
            success: function (result) {
              if (result.error == 0) {
                _this.$Notice.success({
                  title: '提示',
                  desc: '保存成功'
                })
                _this.showAddEdit = false // 关闭弹窗
                _this.getList()
              } else {
                _this.$Notice.error({
                  title: '提示',
                  desc: result.info
                })
              }
            }
          })
        } else {
          _this.$Notice.error({
            title: '提示',
            desc: '信息填写不完整'
          })
        }
      })
    }
  },
  created () {
    if (this.itemId) {
      this.getList()
    }
  },
  mounted () {
    // 为编辑完再添加的时候 重新初始化 formValidate 做准备
    this.backupForm = JSON.parse(JSON.stringify(this.formValidate))
  }
}

</script>

<style scoped>
.tutor-cat-list {
  background-color: #FFFFFF;
  padding: 10px;
  margin-bottom: 20px;
}

.file-icon {
  width: 35px;
  height: 35px;
}

.tutor-cat-content {
  padding: 15px 10px;
  position: relative;
}

.tutor-cat-oper {
  width: 50px;
  position: absolute;
  right: 0;
  top: 10px;
}

.oper-icon {
  font-size: 18px;
  padding-left: 5px;
  color: #cccccc;
}

.key-value {
  height: 30px;
  line-height: 30px;
  clear: both;
}

.cat-key {
  float: left;
}

.cat-value {
  float: left;
}
</style>

<style>

.ivu-modal-body {
  /* display: inline-block; */
  /* height: 500px; */
  overflow: auto;
}

.ivu-col-span-3 {
  width: auto;
}

.ivu-form-item .ivu-form-item {
  margin-bottom: 24px;
}
</style>
