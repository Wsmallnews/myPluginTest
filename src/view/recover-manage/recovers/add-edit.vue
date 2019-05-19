<template lang="html">
	<div class="recovers-add-edit">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
			<Form-item label="类目内容名称" prop="name">
        <Input v-model="formValidate.name" placeholder="类目内容名称"></Input>
      </Form-item>

      <Form-item label="所属类目" prop="cat_id">
        <Select v-model="formValidate.cat_id">
          <Option v-for="item in catList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </Form-item>

      <FormItem label="指导价" prop="market_price">
        <InputNumber v-model="formValidate.market_price" placeholder="市场指导价"></InputNumber>
      </FormItem>

      <FormItem label="单位" prop="unit">
        <Input v-model="formValidate.unit" style="width: 100px;" placeholder="指导价单位 (斤)"></Input>
      </FormItem>

      <Form-item label="内容" prop="content">
        <editor ref="editor" :value="formValidate.content" :cache="false" @on-change="handleChange"/>
      </Form-item>

      <Form-item label="描述" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="描述"></Input>
      </Form-item>

      <Form-Item label="状态" prop="status">
        <i-switch v-model="formValidate.status" :true-value="1" :false-value="0"></i-switch>
      </Form-Item>

      <FormItem label="排序" prop="sort_order">
        <Input v-model="formValidate.sort_order" placeholder="数字越大，优先级越高"></Input>
      </FormItem>

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
        file_type: 'recovers'
      },
      formValidate: {
        id: 0,
        name: "",
        cat_id: 0,
        market_price: 0,
        unit: "",
        content: "",
        text: "",
        desc: "",
        status: 0,
        sort_order: 50
      },
      ruleValidate: {
        name: [
          { required: true, message: '类目内容名称', trigger: 'blur' }
        ],
        cat_id: [
          { required: true, type: 'number', message: '请选择所属类目', min: 1, trigger: 'change' }
        ],
        market_price: [
          { required: true, message: '请输入市场指导价', type: 'number', min: 0.01, trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '指导价单位', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入类目内容', trigger: 'blur' }
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
          var url = '/adminapi/recovers'
          if (_this.formValidate.id) { // 编辑
            method = 'patch'
            var url = '/adminapi/recovers/' + _this.formValidate.id
          }

          // 获取类容
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
                _this.$router.push('/recoverManage/recovers/index')
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
        url: '/adminapi/recovers/' + _this.$route.params.id,
        method: 'get',
        success: function(result) {
          if (result.error == 0) {
            var info = result.result
            for (var i in _this.formValidate) {
              _this.formValidate[i] = info[i]
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
      url: '/adminapi/recoverCats/all',
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

</style>
