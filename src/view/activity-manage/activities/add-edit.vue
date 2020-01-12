<template lang="html">
	<div class="activities-add-edit">
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
        live_id: '',
        start_at: '',
        end_at: '',
        offline_join_num: 0,
        online_join_num: 0,
        offline_join_end_at: '',
        online_join_end_at: '',
        address: '',
        content: '',
        // flow_path: '',
        is_offline_charge: 0,
        offline_money: 0,
        is_online_charge: 0,
        online_money: 0,
        is_vip_offline_charge: 0,
        vip_offline_money: 0,
        is_vip_online_charge: 0,
        vip_online_money: 0,
        is_recommend: 0,
        sort_order: 50,
      },
      formFields: [
        {
          type: 'text',
          name: 'name',
          label: "活动名称",
          placeholder: "请输入活动名称",
          required: {
            message: '活动名称不能为空',
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
          type: 'text',
          name: 'live_id',
          label: "直播间 ID",
          placeholder: "请输入直播间 ID",
          required: {
            message: '直播间 ID 不能为空',
          }
        },
        {
          type: 'datetime',
          name: 'start_at',
          label: "活动开始时间",
          placeholder: "请选择开始时间",
          placement: "bottom-start",
          required: {
            message: '请选择开始时间',
          }
        },
        {
          type: 'datetime',
          name: 'end_at',
          label: "活动结束时间",
          placeholder: "请选择结束时间",
          placement: "bottom-start",
          required: {
            message: '请选择结束时间',
          }
        },
        {
          type: 'number',
          name: 'offline_join_num',
          label: "线下可报名人数",
          placeholder: "请输入线下可报名人数",
          rule: {
            required: true,
            message: '请输入线下可报名人数',
            min: 1,
            max: 1000,
            trigger: 'blur',
            type: 'number'
          }
        },
        {
          type: 'datetime',
          name: 'offline_join_end_at',
          label: "线下报名截止时间",
          placeholder: "请选择线下报名截止时间",
          placement: "bottom-start",
          required: {
            message: '请选择线下报名截止时间',
          }
        },
        {
          type: 'number',
          name: 'online_join_num',
          label: "线上可报名人数",
          placeholder: "请输入线上可报名人数",
          rule: {
            required: true,
            message: '请输入线上可报名人数',
            min: 1,
            max: 1000,
            trigger: 'blur',
            type: 'number'
          }
        },
        {
          type: 'datetime',
          name: 'online_join_end_at',
          label: "线上报名截止时间",
          placeholder: "请选择线上报名截止时间",
          placement: "bottom-start",
          required: {
            message: '请选择线上报名截止时间',
          }
        },
        {
          type: 'textarea',
          name: 'address',
          label: "活动地址",
          placeholder: "请输入活动地址",
          required: {
            message: '请输入活动地址'
          }
        },
        {
          type: 'textarea',
          name: 'desc',
          label: "活动描述",
          placeholder: "请输入活动描述",
        },
        {
          type: "group",
          name: 'group',
          label: '线下费用',
          children: [
            {
              type: "switch",
              name: 'is_offline_charge',
              label: '是否收费',
            },
            {
              type: "number",
              name: 'offline_money',
              label: '线下费用',
              required: {
                message: '请输入线下费用'
              },
              showIf: 'is_offline_charge',
            },
          ]
        },
        {
          type: "group",
          name: 'group',
          label: '线上费用',
          children: [
            {
              type: "switch",
              name: 'is_online_charge',
              label: '是否收费',
            },
            {
              type: "number",
              name: 'online_money',
              label: '线上费用',
              required: {
                message: '请输入线上费用'
              },
              showIf: 'is_online_charge',
            },
          ]
        },
        {
          type: "group",
          name: 'group',
          label: 'VIP 线下费用',
          children: [
            {
              type: "switch",
              name: 'is_vip_offline_charge',
              label: '是否收费',
            },
            {
              type: "number",
              name: 'vip_offline_money',
              label: 'VIP 线下费用',
              required: {
                message: '请输入 VIP 线下费用'
              },
              showIf: 'is_vip_offline_charge',
            },
          ]
        },
        {
          type: "group",
          name: 'group',
          label: 'VIP 线上费用',
          children: [
            {
              type: "switch",
              name: 'is_vip_online_charge',
              label: '是否收费',
            },
            {
              type: "number",
              name: 'vip_online_money',
              label: 'VIP 线上费用',
              required: {
                message: '请输入 VIP 线上费用'
              },
              showIf: 'is_vip_online_charge',
            },
          ]
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
          type: 'editor',
          name: 'content',
          label: "活动详情",
          required: {
            message: '详情不能为空',
          }
        },
        // {
        //   type: 'editor',
        //   name: 'flow_path',
        //   label: "活动流程",
        // },
      ]
    }
  },
  methods: {
    handleSubmit(vals) {
      var _this = this
      var values = Util.extend(this.formValidate, vals)
      var url = '/adminapi/activities'
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
            _this.$router.push('/activityManage/index')
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
    if (_this.$route.params.id != undefined) {
      Util.ajax({
        url: '/adminapi/activities/' + _this.$route.params.id,
        method: 'get',
        success: function(result) {
          if (result.error == 0) {
            var info = result.result
            for (var i in _this.formValidate) {
              _this.formValidate[i] = info[i]
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
