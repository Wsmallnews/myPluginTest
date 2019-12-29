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
        name: '',
        image: '',
        tags: [],
        author_id: 0,
        content: '',
        is_recommend: 0,
        sort_order: 50,
      },
      formFields: [
        {
          type: 'text',
          name: 'name',
          label: "薪声名称",
          placeholder: "请输入薪声名称",
          required: {
            message: '薪声名称不能为空',
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
          type: "tags",
          name: 'tags',
          tags: [],
          required: {
            message: '请选择标签',
          }
        },
        {
          type: 'select',
          name: 'author_id',
          label: "选择作者",
          placeholder: "请选择作者",
          options: [
          ],
          required: {
            type: 'number',
            min: 1,
            message: "请选择讲师"
          }
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
          label: "薪声详情",
          required: {
            message: '详情不能为空',
          }
        },
      ]
    }
  },
  methods: {
    getTeachrs() {
      // 获取所有老师
      var _this = this;
      Util.ajax({
        url: '/adminapi/users/indexTeachAll',
        method: 'get',
        success: function(result) {
          if (result.error == 0) {
            var teach = []
            for (let te of result.result) {
              teach.push({value: te.id, label: te.name})
            }
            // 获取二位数组的下标
            let key_teach = Util.getArrayKey('author_id', _this.formFields, 'name');
            _this.formFields[key_teach]['options'] = teach;
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
    getTags() {
      var _this = this;
      // 获取所有标签
      Util.ajax({
        url: '/adminapi/tags/all',
        method: 'get',
        data: {type: 'sound'},
        success: function(result) {
          if (result.error == 0) {
            // 获取二位数组的下标
            let key = Util.getArrayKey('tags', _this.formFields, 'name');

            _this.formFields[key]['tags'] = result.result;
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
      var url = '/adminapi/sounds'
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
            _this.$router.push('/soundManage/index')
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

    _this.getTags();
    _this.getTeachrs();

    if (_this.$route.params.id != undefined) {
      Util.ajax({
        url: '/adminapi/sounds/' + _this.$route.params.id,
        method: 'get',
        success: function(result) {
          if (result.error == 0) {
            var info = result.result
            for (var i in _this.formValidate) {
              if (i == 'tags') {
                _this.formValidate[i] = info['tag_arr']
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
