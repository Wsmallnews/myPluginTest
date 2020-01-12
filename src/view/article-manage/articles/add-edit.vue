<template lang="html">
	<div class="articles-add-edit">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
			<Form-item label="标题" prop="title">
        <Input v-model="formValidate.title" placeholder="标题"></Input>
      </Form-item>

      <Form-item label="分类" prop="cat_id">
        <Cascader :data="catList" v-model="formValidate.cat_id" change-on-select></Cascader>
      </Form-item>

      <Form-item label="图片" prop="images">
        <MyUpload ref="images" :data="uploadData" :multiple="true" :defaultImgs="formValidate.images"></MyUpload>
      </Form-item>

      <Form-item label="内容" prop="content">
        <editor ref="editor" :value="formValidate.content" :cache="false" @on-change="handleChange"/>
      </Form-item>

      <Form-item label="摘要" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="摘要"></Input>
      </Form-item>

      <Form-item label="关键字" prop="keywords">
        <Input v-model="formValidate.keywords" placeholder="关键字"></Input>
      </Form-item>

      <Form-Item label="状态" prop="status">
        <i-switch v-model="formValidate.status" :true-value="1" :false-value="0"></i-switch>
      </Form-Item>

      <Form-item label="浏览量" prop="view_num">
        <InputNumber :min="1" v-model="formValidate.view_num" placeholder="浏览量"></InputNumber>
      </Form-item>

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
import Editor from '@/components/editor'

export default {
  components: {
    MyUpload,
    Editor
  },
  data() {
    return {
      catList: [],
      uploadData: {
        file_type: 'articles'
      },
      formValidate: {
        id: 0,
        title: "",
        cat_id: [],
        images: [],
        content: "",
        text: "",
        desc: "",
        keywords: "",
        status: 0,
        view_num: 0
      },
      ruleValidate: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        cat_id: [
          { required: true, type: 'array', min: 1, message: '请选择分类', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    handleChange (html, text) {
      this.formValidate.content = html;
    },
    handleSubmit(name) {
      var _this = this

      _this.$refs[name].validate((valid) => {
        if (valid) {
          var method = 'post'
          var url = '/adminapi/articles'
          if (_this.formValidate.id) { // 编辑
            method = 'patch'
            var url = '/adminapi/articles/' + _this.formValidate.id
          }

          // 获取文章图片
          _this.formValidate.images = _this.$refs.images.imgList()
          _this.formValidate.text = _this.$refs.editor.getText();

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
                _this.$router.push('/articleManage/articles/index')
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
    if (_this.$route.params.id != undefined) {
      Util.ajax({
        url: '/adminapi/articles/' + _this.$route.params.id,
        method: 'get',
        success: function(result) {
          if (result.error == 0) {
            var info = result.result
            for (var i in _this.formValidate) {
              if (i == 'images') {
                  _this.formValidate[i] = info['images_arr']
              } else if (i == 'cat_id') {
                  _this.formValidate[i] = info['cat_id_arr']
              } else {
                  _this.formValidate[i] = info[i]
              }
            }

            _this.$refs.editor.setHtml(_this.formValidate.content);
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    }

    Util.ajax({
      url: '/adminapi/articleCats',
      method: 'get',
      success: function(result){
        if (result.error == 0) {
          _this.catList = result.result;
        }
      }
    });
  }
}
</script>

<style lang="css">
.ivu-select-dropdown {
  z-index: 100000;
}
</style>
