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
      type: '',
      formValidate: {
        id: 0,
        name: ''
      },
      formFields: [
        {
          type: 'text',
          name: 'name',
          label: "标签名称",
          placeholder: "请输入标签名称",
          required: {
            message: '标签名称不能为空',
          }
        }
      ]
    }
  },
  methods: {
    handleSubmit(vals) {
      var _this = this
      var values = Util.extend(this.formValidate, vals)
      var url = '/adminapi/tags'
      var method = 'post'
      if (values.id) {
        url = url + '/' + values.id;
        var method = 'patch'
      }
      Util.ajax({
        url: url,
        method: method,
        data: Util.extend(values, {type: this.type}),
        success: function(result) {
          if (result.error == 0) {
            _this.$Notice.success({
              title: '提示',
              desc: '保存成功'
            })

            var url = '';
            if (_this.type == 'business') {
              url = '/businessManage/tags/business';
            } else if (_this.type == 'classroom') {
              url = '/classroomManage/tags/classroom';
            } else if (_this.type == 'sound') {
              url = '/soundManage/tags/sound';
            } else {
              url = '/home'
            }

            _this.$router.push(url)
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
    this.type = _this.$route.params.type
    if (this.type == undefined || this.type == '') {
      this.$Notice.error({title: '提示', desc: '参数错误'})
      return false;
    }
    if (_this.$route.params.id != undefined) {
      Util.ajax({
        url: '/adminapi/tags/' + _this.$route.params.id,
        method: 'get',
        data: {type: this.type},
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
