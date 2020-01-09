<template>
  <div class="sm-form">
    <Form ref="formValidate" :inline="form.inline" :model="formVal" :rules="formRule" :label-width="120">

      <template v-for="(field, index) in currentFields">
        <template v-if="field.type == 'group' && field.children && Array.isArray(field.children)">
          <FormItem v-if="showFormItem(field, index, null)" :label="field.label" :prop="field.name">
            <Row>
              <template v-for="(child, ind) in field.children">
                <Col :span="getSpan(field.children.length)">
                  <FormItem v-if="showFormItem(child, index, field)" :prop="child.name">
                    <sm-field
                      v-model="formVal[child.name]"
                      :field="child"
                      >
                    </sm-field>
                  </FormItem>
                </Col>
                <Col v-if="ind < (field.children.length - 1)" span="2">&nbsp;</Col>
              </template>
            </Row>
          </FormItem>
        </template>
        <template v-else>
          <FormItem v-if="showFormItem(field, index, null)" :label="field.label" :prop="field.name">
            <sm-field
              v-model="formVal[field.name]"
              :field="field"
              :key="index"
              >
              <template :slot="field.name + '-prepend'">
                <slot :name="field.name + '-prepend'">
                </slot>
              </template>

              <template :slot="field.name + '-append'">
                <slot :name="field.name + '-append'">
                </slot>
              </template>

              <template :slot="field.name + '-prefix'">
                <slot :name="field.name + '-prefix'">
                </slot>
              </template>

              <template :slot="field.name + '-suffix'">
                <slot :name="field.name + '-suffix'">
                </slot>
              </template>

              <template v-if="field.type == 'switch'">
                <span :slot="field.name + '-open'">
                  <slot :name="field.name + '-open'">
                  </slot>
                </span>
                <span :slot="field.name + '-close'">
                  <slot :name="field.name + '-close'">
                  </slot>
                </span>
              </template>

              <template v-if="field.type == 'select' || field.type == 'select-mult'">
                <template :slot="field.name + '-option'">
                  <slot :name="field.name + '-option'">

                  </slot>
                </template>
              </template>

              <template v-if="field.type == 'rate'">
                <template :slot="field.name + '-rate'">
                  <slot :name="field.name + '-rate'" :rate="formVal[field.name]">
                    <span style="color: #f5a623">{{ formVal[field.name] }}</span>
                  </slot>
                </template>
              </template>
            </sm-field>
          </FormItem>
        </template>
      </template>

      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  import Util from '../../libs/util';
  import {defFields, defRules} from './field'

  export default {
    props: {
      form: {
        default: function () {
          return {};
        }
      },
      value: {
        default: function () {
          return {};
        }
      },
      fields: {
        default: []
      },
    },
    data() {
      return {
        curFields: [],    // 留作修改 field 用
        formVal: {},
        rules:null
      }
    },
    watch: {
      value: {
        deep: true,
        handler: function (newVal){
          this.setFormVal();
        }
      }
    },
    computed: {
      currentFields () {
        let newFields = [];
        let fields = this.fields;

        for (let field of fields) {
          if (field.type == 'group' && field.children && Array.isArray(field.children)) {
            var newGroups = [];
            for (let child of field.children) {
              newGroups = this.setFields(child, newGroups);
            }
            field.children = newGroups;
            newFields.push(field);
          } else {
            newFields = this.setFields(field, newFields);
          }
        }

        return newFields;
      },
      formRule () {     // 验证规则
        if (this.rules) return this.rules;
        let fields = this.currentFields;
        let formRule = {};
        for (let field of fields) {
          if (field.type == 'group' && field.children && Array.isArray(field.children)) {
            for (let child of field.children) {
              formRule = this.setRule(child, formRule);
            }
          } else {
            formRule = this.setRule(field, formRule);
          }
        }
        this.rules = formRule;
        return formRule;
      }
    },
    methods: {
      setFormVal () {             // 初始化表单默认值
        let fields = this.fields;
        let formVal = {};

        for (let field of fields) {
          if (field.type == 'group' && field.children && Array.isArray(field.children)) {
            for (let child of field.children) {
              formVal = this.setDefault(child, formVal);
            }
          } else {
            formVal = this.setDefault(field, formVal);
          }
        }

        this.formVal = formVal;
      },
      setFields (field, newFields) {
        let defField = (defFields[field.type] != undefined) ? defFields[field.type] : [];
        field = Util.extend(defFields[field.type], field);
        newFields.push(field);

        if (field.type == 'password' && (field.noconfirm == undefined || field.noconfirm == false)) {
          var confirmField = JSON.parse(JSON.stringify(field));
          confirmField.name = confirmField.name + '_confirmation';
          confirmField.label = "确认" + confirmField.label;
          confirmField.placeholder = "请输入确认" + confirmField.label;
          newFields.push(confirmField);
        }

        return newFields;
      },
      setDefault (field, formVal) {
        let value = this.value;
        let defaultVal = this.defaultVal(field.type);

        if (field.type == 'number') {
          field.value = Number(field.value);
        }
        formVal[field.name] = value[field.name] ? value[field.name] : (field.value ? field.value : defaultVal);
        if (field.type == 'password' && (field.noconfirm == undefined || field.noconfirm == false)) {
          formVal[field.name + "_confirmation"] = '';
        }

        return formVal;
      },
      setRule (field, formRule) {
        // 判断验证规则，与默认规则合并
        if ((field.required == undefined || !field.required) && field.rule == undefined) {
          return formRule;
        }

        let defRule = (defRules[field.type] != undefined) ? JSON.parse(JSON.stringify(defRules[field.type])) : [];

        // 完全自定义 rule
        if (field.rule) {
          formRule[field.name] = Util.extend(defRule, field.rule);
          return formRule;
        }

        let required = field.required;
        // 完全默认
        if (typeof required == 'boolean') {
          formRule[field.name] = defRule;
          return formRule;
        }

        // 简写模式，进行合并
        if (typeof required == 'object') {
          for (var i in required) {
            // 如果是數組
            if (Array.isArray(defRule)) {
              defRule.filter((rule, index, defRule) => {
                rule[i] = required[i];
                return rule;
              })

              continue;
            }

            // 如果是對象
            if (typeof defRule == 'object') {
              defRule[i] = required[i];
              continue;
            }
          }
        }
        formRule[field.name] = defRule;

        return formRule;
      },
      defaultVal (type) {       // 根据表单类型设置 默认值
        let defaultVal = '';
        switch(type) {
          case 'text':
          case 'color':
          case 'date':
          case 'datetime':
          case 'year':
          case 'month':
            defaultVal = '';
            break;
          case 'number':
          case 'rate':
          case 'checkbox-only':
          case 'switch':    // 同 checkbox-only
            defaultVal = 0;
            break;
          case 'tags':
          case 'checkbox':
          case 'select-mult':
          case 'transfer':
          case 'cascader':
          case 'daterange':
          case 'datetimerange':
            defaultVal = [];
            break;
        }

        return defaultVal;
      },
      getSpan (length) {
        switch (length) {
          case 1:
            var span = 24;
            break;
          case 2:
            var span = 11;
            break;
          case 3:
            var span = 6;
            break;
          case 4:
            var span = 4;
            break;
          default:
            var span = 4;
        }

        return span;
      },
      showFormItem(field, index, parent) {      // 当前字段 或者当前字段父字段 的下标
        var isShow = false;
        if (field.showFun) {
          isShow = field.showFun(field, this.formVal);
        } else {
          isShow = !field.showIf || (field.showIf && this.formVal[field.showIf]);
        }

        return isShow;
      },
      getValue () {
        return this.formVal;
      },
      handleSubmit(name) {
        console.log(this.formVal)
        console.log(this.formRule)
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$emit('submit', this.formVal)
            // this.$Message.success('Success!');
          } else {
            this.$Message.error('Fail!');
          }
        })
      },
      handleReset(name) {
        // this.$refs[name].resetFields();
      }
    },
    created () {
      this.setFormVal();
    }
  };
</script>

<style scoped>
.sm-form {
    float: left;
}
</style>
