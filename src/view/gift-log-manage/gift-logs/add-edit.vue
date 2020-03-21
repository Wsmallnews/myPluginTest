<template lang="html">
  <div class="sounds-add-edit">
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
        type: 'classroom',
        item_id: 0,
        num: 0,
        remark: '',
      },
      formFields: [
        {
          type: 'radio',
          name: 'type',
          label: "兑换类型",
          placeholder: "请选择兑换类型",
          required: {
            message: '请选择兑换类型',
          },
          radios: [
            {label: "新课堂", value: 'classroom'},
            {label: "薪商学", value: 'business'},
          ]
        },
        {
          type: 'select',
          name: 'item_id',
          filed_type: 'classroom',
          label: "选择薪课堂",
          placeholder: "请选择薪课堂",
          options: [
          ],
          showFun: function (field, vals) {
            return vals.type == 'classroom';
          },
          required: {
            type: 'number',
            min: 1,
            message: "请选择薪课堂"
          }
        },
        {
          type: 'select',
          name: 'item_id',
          filed_type: 'business',
          label: "选择薪商学",
          placeholder: "请选择薪商学",
          options: [
          ],
          showFun: function (field, vals) {
            return vals.type == 'business';
          },
          required: {
            type: 'number',
            min: 1,
            message: "请选择薪商学"
          }
        },
        
        {
          type: "number",
          name: 'num',
          label: '兑换码数量',
          placeholder: '请输入兑换码数量',
          required: {
            min: 1,
            max: 99999,
          }
        },
        {
          type: "textarea",
          name: 'remark',
          label: '备注',
          placeholder: '请输入备注',
          required: {
            message: '请输入备注',
          },
        },
      ]
    }
  },
  methods: {
    getClassrooms() {
      // 获取所有课堂
      var _this = this;
      Util.ajax({
        url: '/adminapi/classrooms/all',
        method: 'get',
        success: function(result) {
          if (result.error == 0) {
            var classrooms = []
            for (let classroom of result.result) {
              classrooms.push({value: classroom.id, label: classroom.name})
            }
            // 获取二位数组的下标
            let key = Util.getArrayKey('classroom', _this.formFields, 'filed_type');
            _this.formFields[key]['options'] = classrooms;
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
    getBusiness() {
      // 获取所有商学
      var _this = this;
      Util.ajax({
        url: '/adminapi/business/all',
        method: 'get',
        success: function(result) {
          if (result.error == 0) {
            var businesss = []
            for (let business of result.result) {
              businesss.push({value: business.id, label: business.name})
            }
            // 获取二位数组的下标
            let key = Util.getArrayKey('business', _this.formFields, 'filed_type');
            _this.formFields[key]['options'] = businesss;
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
      var url = '/adminapi/giftLogs'
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
            _this.$router.push('/giftLogManage/index')
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

    _this.getClassrooms();
    _this.getBusiness();
  }
}
</script>

<style lang="css">
#map {
  width: 600px;
  height: 400px;
}
</style>
