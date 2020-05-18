<template>
  <div class="question">
    <div class="btns">
      <Button type="primary" @click="questionAdd"><Icon type="md-paper-plane" />添加题目</Button>
    </div>

    <div style="height: 20px;"></div>

    <div class="question-list" v-if="list.length">
      <div class="question-content" v-for="(item, index) in list" :key="index">
        <h4>{{index + 1}}、{{ item.title }}</h4>
        <div style="height: 10px;"></div>
        <div class="option-div" v-if="item.question_type == 'choise'">
          <p class="option-p" v-for="(it, id) in item.option_array" :key="id">
            {{ it.name }}、 {{it.content}}
          </p>
          <div style="height: 10px;"></div>
        </div>

        <template >
          <RadioGroup
            v-model="item.answer"
            type="button"
            >
              <Radio v-for="(it, id) in item.option_array"
                :key="id"
                :label="it.name"
                :disabled="item.answer != it.name"
                >
                <template v-if="item.question_type == 'choise'">
                  {{ it.name }}
                </template>
                <template v-else>
                  {{ it.content }}
                </template>
              </Radio>
          </RadioGroup>
        </template>
        <div style="height: 20px;"></div>
        <p>题目解析：{{ item.analysis }}</p>

        <div class="question-oper">
          <Icon type="md-brush" class="oper-icon" title="删除" @click="questionEdit(item)" />
          <Icon type="md-trash" class="oper-icon" title="编辑" @click="questionDelete(item)" />
        </div>
      </div>
    </div>

    <Modal v-model="showAddEdit" :closable="true" :mask-closable="false" :footer-hide="true" :width="700" :height="400" :styles="{top: '20px'}">
      <h3 slot="header" style="color:#2D8CF0" v-if="formValidate.id">编辑题目</h3>
      <h3 slot="header" style="color:#2D8CF0" v-else>添加题目</h3>

      <sm-form ref="smForm" v-model="formValidate" :fields="formFields" @submit="handleSubmit">

      </sm-form>
    </Modal>


  </div>
</template>

<script>
import Util from '@/libs/util'

export default {
  name: 'download',
  props: {
    type: {
      default: 'business'
    },
    doType: {
      default: 'practice'
    },
    itemId: {
      default: 0
    },
    item: {
      default: {}
    }
  },
  data() {
    return {
      list: [],
      showAddEdit: false,
      question_answer: '',  // 临时存储正确答案
      formValidate: {
        id: 0,
        question_type: 'choise',
        title: '',
        options: [],
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        // set_answer_A: 0,
        // set_answer_B: 0,
        // set_answer_C: 0,
        // set_answer_D: 0,
        answer: '',
        analysis: ''
      },
      backupForm: {},
      formFields: [
        {
          type: 'radio',
          name: 'question_type',
          label: "题目类型",
          group: {
            type: 'button',
          },
          radios: [
            {label: "选择题", value: 'choise'},
            {label: "判断题", value: 'judgement'}
          ],
          placeholder: "请选择题目类型",
          required: {
            message: '请选择题目类型',
          },
          showFun: (field, formVal) => {
            return !this.isEdit;
          },
          'on-change': (val) => {
            this.formValidate.answer = (val == 'choise') ? '' : 'correct';
          }
        },
        {
          type: 'textarea',
          name: 'title',
          label: "题目",
          maxlength: 300,
          placeholder: "请输入题目",
          required: {
            message: '请输入题目',
          }
        },
        // {
        //   type: 'group',
        //   name: 'group',
        //   label: "选项A",
        //   showFun: this.isChoise,
        //   children: [
        //     {
        //       type: 'textarea',
        //       name: 'option_a',
        //       label: "选项内容",
        //       maxlength: 300,
        //       placeholder: "请输入选项A内容",
        //       required: {
        //         message: '请输入选项A内容',
        //       }
        //     },
        //     {
        //       type: "switch",
        //       name: 'set_answer_A',
        //       label: '设为答案',
        //       'on-change': (value) => {if (value) {
        //         this.setAnswer(value, 'A')
        //       }}
        //     },
        //   ]
        // },
        // {
        //   type: 'group',
        //   name: 'group',
        //   label: "选项B",
        //   showFun: this.isChoise,
        //   children: [
        //     {
        //       type: 'textarea',
        //       name: 'option_b',
        //       label: "选项B",
        //       maxlength: 300,
        //       placeholder: "请输入选项B内容",
        //       required: {
        //         message: '请输入选项B内容',
        //       }
        //     },
        //     {
        //       type: "switch",
        //       name: 'set_answer_B',
        //       label: '设为答案',
        //       'on-change': (value) => {this.setAnswer(value, 'B')}
        //     },
        //   ]
        // },
        // {
        //   type: 'group',
        //   name: 'group',
        //   label: "选项C",
        //   showFun: this.isChoise,
        //   children: [
        //     {
        //       type: 'textarea',
        //       name: 'option_c',
        //       label: "选项C",
        //       maxlength: 300,
        //       placeholder: "请输入选项C内容",
        //       required: {
        //         message: '请输入选项C内容',
        //       }
        //     },
        //     {
        //       type: "switch",
        //       name: 'set_answer_C',
        //       label: '设为答案',
        //       'on-change': (value) => {this.setAnswer(value, 'C')}
        //     },
        //   ]
        // },
        // {
        //   type: 'group',
        //   name: 'group',
        //   label: "选项D",
        //   showFun: this.isChoise,
        //   children: [
        //     {
        //       type: 'textarea',
        //       name: 'option_d',
        //       label: "选项D",
        //       maxlength: 300,
        //       placeholder: "请输入选项D内容",
        //       required: {
        //         message: '请输入选项D内容',
        //       }
        //     },
        //     {
        //       type: "switch",
        //       name: 'set_answer_D',
        //       label: '设为答案',
        //       'on-change': (value) => {this.setAnswer(value, 'D')}
        //     },
        //   ]
        // },
        {

          type: 'textarea',
          name: 'option_a',
          label: "选项A",
          maxlength: 300,
          placeholder: "请输入选项A内容",
          showFun: this.isChoise,
          required: {
            message: '请输入选项A内容',
          }
        },
        {
          type: 'textarea',
          name: 'option_b',
          label: "选项B",
          maxlength: 300,
          placeholder: "请输入选项B内容",
          showFun: this.isChoise,
          required: {
            message: '请输入选项B内容',
          }
        },
        {
          type: 'textarea',
          name: 'option_c',
          label: "选项C",
          maxlength: 300,
          placeholder: "请输入选项C内容",
          showFun: this.isChoise,
          required: {
            message: '请输入选项C内容',
          }
        },
        {
          type: 'textarea',
          name: 'option_d',
          label: "选项D",
          maxlength: 300,
          placeholder: "请输入选项D内容",
          showFun: this.isChoise,
          required: {
            message: '请输入选项D内容',
          }
        },
        {
          type: 'radio',
          name: 'answer',
          label: "答案",
          showFun: this.isChoise,
          group: {
            type: 'button',
          },
          radios: [
            {label: "选项A", value: 'A'},
            {label: "选项B", value: 'B'},
            {label: "选项C", value: 'C'},
            {label: "选项D", value: 'D'}
          ],
          placeholder: "请选择题目答案",
          required: {
            message: '请选择题目答案',
          },
          // 'on-change': (val) => {
          //   this.question_answer = val;
          // }
        },
        {
          type: 'radio',
          name: 'answer',
          label: "答案",
          showFun: this.isJudge,
          group: {
            type: 'button',
          },
          radios: [
            {label: "正确", value: 'correct'},
            {label: "错误", value: 'error'}
          ],
          placeholder: "请选择题目答案",
          required: {
            message: '请选择题目答案',
          },
          // 'on-change': (val) => {
          //   this.question_answer = val;
          // }
        },
        {
          type: 'textarea',
          name: 'analysis',
          label: "题目解析",
          maxlength: 300,
          placeholder: "请输入题目解析",
          required: {
            message: '请输入题目解析',
          }
        },
      ]
    }
  },
  watch: {
    doType (value) {
      if (value) {
        this.getList();
      }
    },
    itemId (value) {
      if (value) {
        this.getList();
      }
    }
  },
  computed: {
    isEdit () {
      return this.formValidate.id ? true : false
    }
  },
  methods: {
    getList () {
      var _this = this;

      Util.ajax({
        url: 'adminapi/questions',
        method: 'get',
        data: {type: this.type, do_type: this.doType, item_id: this.itemId},
        success: function(result) {
          if (result.error == 0) {
            _this.list = result.result;
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
    questionDelete (item) {
      var _this = this;

      _this.$Modal.confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk: function () {
          Util.ajax({
            url: 'adminapi/questions/' + item.id,
            method: 'delete',
            success: function(result) {
              if (result.error == 0) {
                _this.$Notice.success({
                  title: '提示',
                  desc: '删除成功'
                })
                _this.getList();    // 重新刷新课程资料列表
              } else {
                _this.$Notice.error({
                  title: '提示',
                  desc: result.info
                })
              }
            }
          })
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    questionAdd() {
      this.formValidate = JSON.parse(JSON.stringify(this.backupForm))
      this.showAddEdit = true;
    },
    questionEdit (item) {
      var _this = this;

      for (var i in _this.formValidate) {
        if (item.question_type == 'choise') {
          if (Util.inArray(i, ['option_a', 'option_b', 'option_c', 'option_d'])) {
            let opt = i.substr(-1,1).toUpperCase();

            for (let inf of item['option_array']) {
              if (inf.name == opt) {
                _this.formValidate[i] = inf.content
                break;
              }
            }

            continue;
          }
        } else {
          if (Util.inArray(i, ['option_a', 'option_b', 'option_c', 'option_d'])) {
            continue;
          }
        }

        if (i == 'options') {
          _this.formValidate[i] = []
        } else {
          _this.formValidate[i] = item[i]
        }
      }
      console.log(_this.formValidate);
      this.showAddEdit = true;
    },
    setAnswer(val, option) {
      console.log(val)
      // let current = 'set_answer_' + option;
      // let options = [
      //   'set_answer_A',
      //   'set_answer_B',
      //   'set_answer_C',
      //   'set_answer_D',
      // ]

      // if (val) {

      //   for (let o of options) {
      //     if (o != current) {
      //       console.log(o)
      //       this.formValidate[o] = 0;

      //     }
      //   }

      //   this.question_answer = option;
      // } else {
      //   this.question_answer = '';
      // }

      // console.log(this.formValidate)
    },
    isChoise(field, formVal) {
      if (formVal.question_type == 'choise') {
        return true;
      }
      return false
    },
    isJudge(field, formVal) {
      if (formVal.question_type == 'judgement') {
        return true;
      }
      return false
    },
    handleSubmit(vals) {
      var _this = this
      var values = Util.extend(this.formValidate, vals)
      values['type'] = this.type;
      values['item_id'] = this.itemId;
      values['do_type'] = this.doType;

      // 组合答案
      values.options = [];
      if (values['question_type'] == 'choise') {
        values.options.push({'name': 'A', 'content': values.option_a});
        values.options.push({'name': 'B', 'content': values.option_b});
        values.options.push({'name': 'C', 'content': values.option_c});
        values.options.push({'name': 'D', 'content': values.option_d});
      } else {
        values.options.push({'name': 'correct', 'content': '正确'})
        values.options.push({'name': 'error', 'content': '错误'})
      }

      var url = '/adminapi/questions'
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
            _this.showAddEdit = false;   // 关闭弹窗
            _this.getList();
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
  created () {
    if (this.itemId) {
      this.getList();
    }
  },
  mounted() {
    // 为编辑完再添加的时候 重新初始化 formValidate 做准备
    this.backupForm = JSON.parse(JSON.stringify(this.formValidate))
  }
}


</script>


<style scoped>
.question-list {
  background-color: #FFFFFF;
  padding: 10px;
  margin-bottom: 20px;
}

.file-icon {
  width: 35px;
  height: 35px;
}

.option-div {
  padding-left: 20px;
}

.option-p {
  line-height: 25px;
}

.question-content {
  padding: 10px;
  position: relative;
}

.question-oper {
  width: 50px;
  position: absolute;
  right: 0;
  top: 10px;
}

.oper-icon {
  font-size: 18px;
  padding-left: 5px;
  color: #cccccc;
}
</style>

<style>

.ivu-modal-body {
  /* display: inline-block; */
  /* height: 500px; */
  overflow: auto;
}

.ivu-col-span-3 {
  width: auto;
}
</style>
