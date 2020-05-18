<template lang="html">
  <div class="sounds-add-edit">
    <Menu mode="horizontal" theme="light" active-name="edit" @on-select="getItem">
      <MenuItem name="edit" >导师信息</MenuItem>
      <template v-if="$route.params.id">
        <MenuItem name="tutor_cat" >可咨询方向</MenuItem>
        <MenuItem name="tutor_comment" >学员评价</MenuItem>
      </template>
    </Menu>

    <div style="height: 20px;"></div>

    <sm-form v-if="menuActivity == 'edit'" ref="smForm" v-model="formValidate" :fields="formFields" @submit="handleSubmit">

    </sm-form>

    <div v-else-if="menuActivity == 'tutor_cat'">
      <tutor-cat :item-id="formValidate.id" :item="formValidate">

      </tutor-cat>
    </div>
    <div v-else-if="menuActivity == 'tutor_comment'">
      <tutor-comment :item-id="formValidate.id" :item="formValidate">

      </tutor-comment>
    </div>
	</div>
</template>

<script>
import Util from '@/libs/util'
import TutorCat from '@/view/includes/custom/tutor/tutor-cat'
import TutorComment from '@/view/includes/custom/tutor/tutor-comment'

export default {
  components: {
    TutorCat,
    TutorComment
  },
  data() {
    return {
      menuActivity: 'edit',
      formValidate: {
        id: 0,
        name: '',
        avatar: '',
        desc: '',
        intro: '',
      },
      formFields: [
        {
          type: 'select',
          name: 'id',
          label: "选择用户",
          placeholder: "请选择用户",
          disabled: false,
          options: [
          ],
          required: {
            type: 'number',
            min: 1,
            message: "请选择用户"
          }
        },
        {
          type: 'text',
          name: 'name',
          label: "导师姓名",
          placeholder: "请输入导师姓名",
          required: {
            message: '导师姓名不能为空',
          }
        },
        {
          type: 'upload',
          name: 'avatar',
          label: "导师照片",
          width: "100px",
          height: "100px",
          noEdit: false,
          required: {
            message: '请上传导师照片',
          }
        },
        {
          type: "textarea",
          name: 'desc',
          label: '个性签名',
          placeholder: '导师姓名下显示'
        },
        {
          type: 'editor',
          name: 'intro',
          label: "导师介绍",
        },
      ]
    }
  },
  methods: {
    abc() {
      console.log('aaaa')
    },
    getTutors() {
      // 获取所有非导师
      var _this = this;
      Util.ajax({
        url: '/adminapi/users/all',
        method: 'get',
        success: function(result) {
          if (result.error == 0) {
            var tutors = []
            for (let te of result.result) {
              tutors.push({value: te.id, label: te.name})
            }
            // 获取二位数组的下标
            let key_tutors = Util.getArrayKey('id', _this.formFields, 'name');
            _this.formFields[key_tutors]['options'] = tutors;

            if (_this.$route.params.id != undefined) {
              _this.formFields[key_tutors]['disabled'] = true
            }
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
      var url = '/adminapi/tutors'
      var method = 'post'
      if (_this.$route.params.id != undefined) {
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
            _this.$router.push('/tutorManage/index')
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
    getItem(code) {
      this.menuActivity = code;
    }
  },
  mounted: function() {

  },
  created() {
    var _this = this

    _this.getTutors();

    if (_this.$route.params.id != undefined) {
      Util.ajax({
        url: '/adminapi/tutors/' + _this.$route.params.id,
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
