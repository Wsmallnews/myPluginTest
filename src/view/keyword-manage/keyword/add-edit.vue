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
  data () {
    return {
      type: '',
      formValidate: {
        id: 0,
        name: '',
        sort: 0
      },
      formFields: [
        {
          type: 'text',
          name: 'name',
          label: '热搜词',
          placeholder: '请输入热搜词',
          required: {
            message: '热搜词不能为空'
          }
        },
        {
          type: 'number',
          name: 'sort',
          label: '排序'
        }
      ]
    }
  },
  methods: {
    handleSubmit (vals) {
      var _this = this
      var values = Util.extend(this.formValidate, vals)
      var url = '/adminapi/keyword'
      var method = 'post'
      if (values.id) {
        url = url + '/' + values.id
        var method = 'patch'
      }
      Util.ajax({
        url: url,
        method: method,
        data: Util.extend(values, { type: this.type }),
        success: function (result) {
          if (result.error == 0) {
            _this.$Notice.success({
              title: '提示',
              desc: '保存成功'
            })

            _this.$router.push('/keywordManage/keyword/index')
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
  mounted: function () {
  },
  created () {
    var _this = this
    if (_this.$route.params.id != undefined) {
      Util.ajax({
        url: '/adminapi/keyword/' + _this.$route.params.id,
        method: 'get',
        data: {},
        success: function (result) {
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
