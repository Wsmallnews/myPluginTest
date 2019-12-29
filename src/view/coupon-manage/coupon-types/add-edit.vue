<template lang="html">
  <div class="coupons-add-edit">
    <sm-form ref="smForm" v-model="formValidate" :fields="formFields" @submit="handleSubmit">

    </sm-form>
	</div>
</template>

<script>
import Util from '@/libs/util'

export default {
  data() {
    return {
      formValidate: {
        id: 0,
        name: '',
        get_type: 'normal',
        type: 'full_cut',
        apply_type: [],
        money: 0,
        full_money: 0,
        send_num: 0,
        start_send_at: '',
        end_send_at: '',
        expire_days: 0,
      },
      formFields: [
        {
          type: 'text',
          name: 'name',
          label: "优惠券名称",
          placeholder: "请输入优惠券名称",
          required: {
            message: '优惠券名称不能为空',
          }
        },
        {
          type: 'radio',
          name: 'get_type',
          label: "领取类型",
          required: {
            message: '请选择领取类型',
          },
          radios: [
            {label: "普通类型", value: 'normal'},
          ]
        },
        {
          type: 'radio',
          name: 'type',
          label: "类型",
          required: {
            message: '请选择优惠券类型',
          },
          radios: [
            {label: "满减", value: 'full_cut'},
          ]
        },
        {
          type: 'checkbox',
          name: 'apply_type',
          label: "适用类型",
          required: {
            message: '请选择适用类型',
          },
          checkboxs: [
            {label: "薪活动", value: 'activity'},
            {label: "薪商学", value: 'business'},
            {label: "薪课堂", value: 'classroom'},
          ]
        },
        {
          type: 'number',
          name: 'money',
          label: "优惠券金额",
          placeholder: "请输入优惠券金额",
          required: {
            message: "优惠券金额不能为空"
          }
        },
        {
          type: 'number',
          name: 'full_money',
          label: "满足金额",
          placeholder: "请输入优惠券满足金额",
          required: {
            message: "优惠券满足金额不能为空"
          }
        },
        {
          type: 'number',
          name: 'send_num',
          label: "发放数量",
          placeholder: "请输入发放数量",
          required: {
            min: 1,
            message: "发放数量不能为空"
          }
        },
        {
          type: 'datetime',
          name: 'start_send_at',
          label: "开始发放时间",
          placeholder: "请选择开始发放时间",
          placement: "bottom-start",
          required: {
            message: '请选择开始发放时间',
          }
        },
        {
          type: 'datetime',
          name: 'end_send_at',
          label: "结束发放时间",
          placeholder: "请选择结束发放时间",
          placement: "bottom-start",
          required: {
            message: '请选择结束发放时间',
          }
        },
        {
          type: 'number',
          name: 'expire_days',
          label: "有效天数",
          placeholder: "请输入有效天数",
          required: {
            min: 1,
            message: "有效天数不能为空"
          }
        },
      ]
    }
  },
  methods: {
    handleSubmit(vals) {
      var _this = this
      var values = Util.extend(this.formValidate, vals)
      var url = '/adminapi/couponTypes'
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
            _this.$router.push('/couponManage/index')
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
        url: '/adminapi/couponTypes/' + _this.$route.params.id,
        method: 'get',
        success: function(result) {
          if (result.error == 0) {
            var info = result.result
            for (var i in _this.formValidate) {
              if (i == 'apply_type') {
                _this.formValidate[i] = info['apply_type_arr']
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
