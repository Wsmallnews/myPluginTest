<template lang="html">
	<div class="business-add-edit">
    <sm-form ref="smForm" v-model="formValidate" :fields="formFields" @submit="handleSubmit">

    </sm-form>
	</div>
</template>

<script>
import Util from '@/libs/util'
import MyUpload from '@/view/includes/myUpload'
import Editor from '@/components/editor'

export default {
  components: {
    MyUpload,
    Editor
  },
  data() {
    return {
      uploadData: {
        file_type: 'activity'
      },
      formValidate: {
        id: 0,
        name: '',
        desc: '',
        image: '',
        tags: [],
        start_at: '',
        end_at: '',
        join_num: 0,
        join_end_at: '',
        teach_id: 0,
        coach_id: 0,
        wechat_qrcode: '',
        live_name: '',
        live_id: '',
        content: '',
        reminder: '',
        is_charge: 0,
        charge_money: 0,
        is_vip_charge: 0,
        vip_charge_money: 0,
        expire_day: 0,
        is_recommend: 0,
        sort_order: 50,
      },
      formFields: [
        {
          type: 'text',
          name: 'name',
          label: "薪商学名称",
          placeholder: "请输入薪商学名称",
          required: {
            message: '薪商学名称不能为空',
          }
        },
        {
          type: 'upload',
          name: 'image',
          label: "上传封面",
          width: "375px",
          height: "150px",
          noEdit: false,
          required: {
            message: '请上传封面',
          }
        },
        {
          type: "tags",
          name: 'tags',
          tags: [],
          required: {
            message: '请选择标签',
          }
        },
        {
          type: 'datetime',
          name: 'start_at',
          label: "薪商学开始时间",
          placeholder: "请选择开始时间",
          placement: "bottom-start",
          required: {
            message: '请选择开始时间',
          }
        },
        {
          type: 'datetime',
          name: 'end_at',
          label: "薪商学结束时间",
          placeholder: "请选择结束时间",
          placement: "bottom-start",
          required: {
            message: '请选择结束时间',
          }
        },
        // {
        //   type: 'number',
        //   name: 'join_num',
        //   label: "可报名人数",
        //   placeholder: "请输入可报名人数",
        //   rule: {
        //     required: true,
        //     message: '请输入可报名人数',
        //     min: 1,
        //     max: 1000,
        //     trigger: 'blur',
        //     type: 'number'
        //   }
        // },
        // {
        //   type: 'datetime',
        //   name: 'join_end_at',
        //   label: "报名截止时间",
        //   placeholder: "请选择报名截止时间",
        //   placement: "bottom-start",
        //   required: {
        //     message: '请选择报名截止时间',
        //   }
        // },
        {
          type: 'select',
          name: 'teach_id',
          label: "选择讲师",
          placeholder: "请选择讲师",
          options: [
          ],
          required: {
            type: 'number',
            min: 1,
            message: "请选择讲师"
          }
        },
        {
          type: 'select',
          name: 'coach_id',
          label: "选择辅导老师",
          placeholder: "请选择辅导老师",
          options: [
          ],
          required: {
            type: 'number',
            min: 1,
            message: "请选择辅导老师"
          }
        },
        {
          type: 'upload',
          name: 'wechat_qrcode',
          label: "微信二维码",
          width: "100px",
          height: "100px",
          noEdit: false,
          required: {
            message: '请上传辅导老师微信二维码',
          }
        },
        {
          type: 'text',
          name: 'live_name',
          label: "课时名称",
          placeholder: "请输入课时名称",
          required: {
            message: '课时名称不能为空',
          }
        },
        {
          type: 'text',
          name: 'live_id',
          label: "直播间 ID",
          placeholder: "请输入直播间 ID",
          required: {
            message: '直播间 ID 不能为空',
          }
        },

        {
          type: "group",
          name: 'group',
          label: '是否收费',
          children: [
            {
              type: "switch",
              name: 'is_charge',
              label: '是否收费',
            },
            {
              type: "number",
              name: 'charge_money',
              label: '费用',
              required: {
                message: '请输入费用'
              },
              showIf: 'is_charge',
            },
          ]
        },
        {
          type: "group",
          name: 'group',
          label: 'VIP 是否收费',
          children: [
            {
              type: "switch",
              name: 'is_vip_charge',
              label: '是否收费',
            },
            {
              type: "number",
              name: 'vip_charge_money',
              label: 'VIP费用',
              required: {
                message: '请输入VIP费用'
              },
              showIf: 'is_vip_charge',
            },
          ]
        },
        {
          type: 'number',
          name: 'expire_day',
          label: "购买后有效天数",
          placeholder: "请填写有效天数",
          placement: "bottom-start",
          required: {
            message: '请填写有效天数',
          }
        },
        {
          type: "switch",
          name: 'is_recommend',
          label: '是否推荐',
        },
        {
          type: "number",
          name: 'sort_order',
          label: '排序',
        },
        {
          type: 'textarea',
          name: 'desc',
          label: "商学描述",
          placeholder: "请输入商学描述",
        },
        {
          type: 'editor',
          name: 'content',
          label: "商学详情",
          required: {
            message: '详情不能为空',
          }
        },
        {
          type: 'editor',
          name: 'reminder',
          label: "温馨提示",
        },
      ]
    }
  },
  methods: {
    getTeachrs() {
      // 获取所有老师
      var _this = this;
      Util.ajax({
        url: '/adminapi/users/indexTeachAll',
        method: 'get',
        success: function(result) {
          if (result.error == 0) {
            var teach = []
            for (let te of result.result) {
              teach.push({value: te.id, label: te.name})
            }
            // 获取二位数组的下标
            let key_teach = Util.getArrayKey('teach_id', _this.formFields, 'name');
            _this.formFields[key_teach]['options'] = teach;

            let key_coach = Util.getArrayKey('coach_id', _this.formFields, 'name');

            _this.formFields[key_coach]['options'] = teach;

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
            // 获取二位数组的下标
            let key = Util.getArrayKey('tags', _this.formFields, 'name');

            _this.formFields[key]['tags'] = result.result;
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
    handleSubmit(vals) {
      var _this = this
      var values = Util.extend(this.formValidate, vals)
      var url = '/adminapi/business'
      var method = 'post'
      if (values.id) {
        url = url + '/' + values.id;
        var method = 'patch'
      }
      Util.ajax({
        url: url,
        method: method,
        data: values,
        success: function(result) {
          if (result.error == 0) {
            _this.$Notice.success({
              title: '提示',
              desc: '保存成功'
            })
            _this.$router.push('/businessManage/index')
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    }
  },
  mounted: function() {

  },
  created() {
    var _this = this

    _this.getTags();
    _this.getTeachrs();

    if (_this.$route.params.id != undefined) {
      Util.ajax({
        url: '/adminapi/business/' + _this.$route.params.id,
        method: 'get',
        success: function(result) {
          if (result.error == 0) {
            var info = result.result
            for (var i in _this.formValidate) {
              if (i == 'tags') {
                _this.formValidate[i] = info['tag_arr']
              } else {
                _this.formValidate[i] = info[i]
              }
            }
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="css">
#map {
  width: 600px;
  height: 400px;
}
</style>
