<template>
  <div class="adpositions-add-edit">
    <Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
      <Alert show-icon>
        填写说明
        <template slot="desc">
          请不要随意添加广告位，添加的广告位不可用
        </template>
      </Alert>
      <FormItem label="广告位名称" prop="name">
        <Input v-model="formValidate.name" placeholder="请填写广告位名称"></Input>
      </FormItem>
      <FormItem label="广告位标识" prop="code">
        <Input v-model="formValidate.code" placeholder="请填写广告位标识"></Input>
      </FormItem>
      <FormItem label="描述" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder=""></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click.native="handleSubmit('formValidate')">提交</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>

import Util from '@/libs/util'
import myUpload from '@/view/includes/myUpload'

export default {
  components: {
    myUpload
  },
  data() {
    return {
      formValidate: {
        id: 0,
        name: '',
        code: '',
        desc: '',
      },
      ruleValidate: {
        name: [
          { required: true, message: '请填写广告位名称', trigger: 'blur' }
        ],
      },
      categorys: [],
    }
  },
  methods: {
    handleSubmit(name) {
      var _this = this

      _this.$refs[name].validate((valid) => {
        if (valid) {
          // 添加
          var method = 'post'
          var url = '/adminapi/adPositions'
          if (_this.formValidate.id) { // 编辑
            method = 'patch'
            var url = '/adminapi/adPositions/' + _this.formValidate.id
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
                _this.$router.push('/adManage/adPositions/index')
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
    }
  },
  created() {
    var _this = this

    if (_this.$route.params.id != undefined) {
      Util.ajax({
        url: '/adminapi/adPositions/' + _this.$route.params.id,
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
</style>
