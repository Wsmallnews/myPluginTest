<template lang="html">
  <div class="classroom-contents-add-edit">
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
        classroom_id: 0,
        name: '',
        live_id: '',
        homework: '',
        start_at: '',
        end_at: '',
        is_teach_comment: 0,
        sort_order: 50,
      },
      formFields: [
        {
          type: 'text',
          name: 'name',
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
          type: 'textarea',
          name: 'homework',
          label: "课时作业",
          placeholder: "请输入课时作业",
          required: {
            message: '课时作业不能为空',
          }
        },
        {
          type: 'datetime',
          name: 'start_at',
          label: "开始时间",
          placeholder: "请选择开始时间",
          placement: "bottom-start",
          required: {
            message: '请选择开始时间',
          }
        },
        {
          type: 'datetime',
          name: 'end_at',
          label: "结束时间",
          placeholder: "请选择结束时间",
          placement: "bottom-start",
          required: {
            message: '请选择结束时间',
          }
        },
        {
          type: "switch",
          name: 'is_teach_comment',
          label: '开启讲师评价',
        },
        {
          type: "number",
          name: 'sort_order',
          label: '排序',
        }
      ]
    }
  },
  methods: {
    handleSubmit(vals) {
      var _this = this
      var values = Util.extend(this.formValidate, vals)
      var url = '/adminapi/classroomContents'
      var method = 'post'
      if (values.id) {
        url = url + '/' + values.id;
        var method = 'patch'
      }

      if (values.classroom_id == undefined || values.classroom_id == 0) {
        values.classroom_id = this.$route.params.classroom_id
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
            _this.$router.push('/classroomManage/classroomContents/' + _this.$route.params.classroom_id)
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
        url: '/adminapi/classroomContents/' + _this.$route.params.id,
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
