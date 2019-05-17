<template lang="html">
	<div class="ads-add-edit">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
      <Form-item label="广告位置" prop="position_id">
        <Select v-model="formValidate.position_id">
          <Option v-for="item in adPositions" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </Form-item>
      <Form-item label="广告标题" prop="name">
        <Input v-model="formValidate.name" placeholder="广告标题"></Input>
      </Form-item>
      <Form-item label="图片" prop="image" required>
				<myUpload ref="adImg" :data="uploadData" :defaultImgs="formValidate.image"></myUpload>
      </Form-item>
      <Form-item label="广告有效时间" prop="dateRange">
        <Date-Picker :value="formValidate.dateRange" @on-change="dateHandle" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placement="right-start" placeholder="广告有效时间" ></Date-Picker>
        <span class="form-hints">广告的显示时间范围</span>
      </Form-item>
      <Form-item label="广告链接" prop="link">
        <Input v-model="formValidate.link" placeholder="广告链接"></Input>
        <span class="form-hints">网页跳转链接</span>
      </Form-item>
      <Form-item label="app 链接" prop="link_app">
        <Input v-model="formValidate.link_app" placeholder="app 链接"></Input>
        <span class="form-hints">app 跳转链接标识</span>
      </Form-item>
      <Form-item label="小程序链接" prop="link_mini">
        <Input v-model="formValidate.link_mini" placeholder="小程序链接"></Input>
        <span class="form-hints">小程序跳转链接</span>
      </Form-item>
      <Form-Item label="状态" prop="status">
        <i-switch v-model="formValidate.status" :true-value="1" :false-value="0"></i-switch>
      </Form-Item>
      <Form-Item label="排序" prop="sort_order">
        <Input v-model="formValidate.sort_order" placeholder="数字越大，优先级越高"></Input>
      </Form-Item>
      <Form-item>
        <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </Form-item>
		</Form>
	</div>
</template>

<script>
import Util from '@/libs/util'
import MyUpload from '@/view/includes/myUpload'

export default {
  components: {
    MyUpload
  },
  data() {
    return {
      adPositions: [],
      uploadData: {
        file_type: 'ads'
      },
      formValidate: {
        id: 0,
        position_id: 0,
        name: "",
        image: "",
        link: "",
        link_app: "",
        link_mini: "",
        dateRange: [],
        status: 0,
        sort_order: 50,
      },
      ruleValidate: {
        position_id: [
          { required: true, type: 'number', message: '请选择广告位置', min: 1, trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入广告标题', trigger: 'blur' }
        ],
        dateRange: [
          { required: true, type: 'array', min: 1, message: '请选择广告时间', trigger: 'change' }
        ],
        image: [
          { required: false } // 提交的时候验证， 这样只是为了保留 * 号
        ]
      }
    }
  },
  methods: {
    dateHandle:function(range){
      this.formValidate.dateRange[0] = range[0];
      this.formValidate.dateRange[1] = range[1];
    },
    handleSubmit(name) {
      var _this = this

      _this.$refs[name].validate((valid) => {
        if (valid) {
          var method = 'post'
          var url = '/adminapi/ads'
          if (_this.formValidate.id) { // 编辑
            method = 'patch'
            var url = '/adminapi/ads/' + _this.formValidate.id
          }

          // 获取文章图片
          _this.formValidate.image = _this.$refs.adImg.imgList();
          if (_this.formValidate.image == '') {
            _this.$Notice.error({
              title: '提示',
              desc: '请上传广告图片'
            })
            return false;
          }

          Util.ajax({
            url: url,
            method: method,
            data: _this.formValidate,
            success: function(result) {
              if (result.error == 0) {
                _this.$Notice.success({
                  title: '提示',
                  desc: '保存成功'
                })
                _this.$router.push('/adManage/ads/index')
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
    },
    handleReset(name) { // 表单数据重置, name ,表单数据
      var _this = this
      _this.$refs[name].resetFields()
    }
  },
  mounted: function() {},
  created() {
    var _this = this
    // 获取所有广告位
    Util.ajax({
      url: "/adminapi/adPositions/all",
      method: 'get',
      success: function(result){
        if (result.error == 0) {
          _this.adPositions = result.result;
        }
      }
    });

    if (_this.$route.params.id != undefined) {
      Util.ajax({
        url: '/adminapi/ads/' + _this.$route.params.id,
        method: 'get',
        success: function(result) {
          if (result.error == 0) {
            var info = result.result
            for (var i in _this.formValidate) {
              if (i == 'dateRange') {
                  _this.formValidate.dateRange[0] = info.start_at;
                  _this.formValidate.dateRange[1] = info.end_at;
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

</style>
