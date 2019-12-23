<template>
  <div class="my-field">

    <!-- *、form 表单中的 内联 表单
    *、表单验证，触发事件 trigger（图片，等...）
    *、根据一个表单的值，隐藏表单 -->


    <Form ref="formValidate" :inline="form.inline" :model="formVal" :rules="formRule" :label-width="80">

      <FormItem label="DatePicker">
        <Row>
          <Col span="11">
            <DatePicker type="date" placeholder="Select date" ></DatePicker>
          </Col>
          <Col span="2" style="text-align: center">-</Col>
          <Col span="11">
            <TimePicker type="time" placeholder="Select time" ></TimePicker>
          </Col>
        </Row>
      </FormItem>

      <template v-for="field in currentFields">
        <FormItem v-if="field.type == 'text'" :label="field.label" :prop="field.name">
          <Input
            v-model="formVal[field.name]"
            :readonly="field.readonly"
            :disabled="field.disabled"
            :autofocus="field.autofocus"
            :maxlength="field.maxlength"
            :prefix="field.prefix"
            :suffix="field.icon ? field.icon : field.suffix"
            :placeholder="field.placeholder"
            @on-enter="field['on-enter']" @on-click="field['on-click']" @on-change="field['on-change']" @on-focus="field['on-focus']"
            @on-blur="field['on-blur']" @on-keyup="field['on-keyup']" @on-keydown="field['on-keydown']" @on-keypress="field['on-keypress']"
            @on-search="field['on-search']" @on-clear="field['on-clear']"
            >
            <template slot="prepend">
              <slot :name="field.name + '-prepend'">
              </slot>
            </template>

            <template slot="append">
              <slot :name="field.name + '-append'">
              </slot>
            </template>

            <template slot="prefix">
              <slot :name="field.name + '-prefix'">
              </slot>
            </template>

            <template slot="suffix">
              <slot :name="field.name + '-suffix'">
              </slot>
            </template>
          </Input>
        </FormItem>

        <FormItem v-if="field.type == 'textarea'" :label="field.label" :prop="field.name">
          <Input
            type="textarea"
            v-model="formVal[field.name]"
            :readonly="field.readonly"
            :disabled="field.disabled"
            :autofocus="field.autofocus"
            :rows="field.rows"
            :autosize="field.autosize"
            :maxlength="field.maxlength"
            :show-word-limit="field['show-word-limit']"
            :placeholder="field.placeholder"
            @on-enter="field['on-enter']" @on-click="field['on-click']" @on-change="field['on-change']" @on-focus="field['on-focus']"
            @on-blur="field['on-blur']" @on-keyup="field['on-keyup']" @on-keydown="field['on-keydown']" @on-keypress="field['on-keypress']"
            @on-search="field['on-search']" @on-clear="field['on-clear']"
            >
          </Input>
        </FormItem>

        <FormItem v-if="field.type == 'search'" :label="field.label" :prop="field.name">
          <Input
            search
            v-model="formVal[field.name]"
            :readonly="field.readonly"
            :disabled="field.disabled"
            :autofocus="field.autofocus"
            :enter-button="field['enter-button']"
            :rows="field.rows"
            :autosize="field.autosize"
            :maxlength="field.maxlength"
            :show-word-limit="field['show-word-limit']"
            :placeholder="field.placeholder"
            @on-enter="field['on-enter']" @on-click="field['on-click']" @on-change="field['on-change']" @on-focus="field['on-focus']"
            @on-blur="field['on-blur']" @on-keyup="field['on-keyup']" @on-keydown="field['on-keydown']" @on-keypress="field['on-keypress']"
            @on-search="field['on-search']" @on-clear="field['on-clear']"
            >
          </Input>
        </FormItem>

        <FormItem v-if="field.type == 'number'" :label="field.label" :prop="field.name">
          <InputNumber
            v-model="formVal[field.name]"
            :readonly="field.readonly"
            :disabled="field.disabled"
            :autofocus="field.autofocus"
            :placeholder="field.placeholder"
            @on-enter="field['on-enter']" @on-click="field['on-click']" @on-change="field['on-change']" @on-focus="field['on-focus']"
            @on-blur="field['on-blur']" @on-keyup="field['on-keyup']" @on-keydown="field['on-keydown']" @on-keypress="field['on-keypress']"
            @on-search="field['on-search']" @on-clear="field['on-clear']"
            >
          </InputNumber>
        </FormItem>

        <FormItem v-if="field.type == 'email'" :label="field.label" :prop="field.name">
          <Input
            v-model="formVal[field.name]"
            :readonly="field.readonly"
            :disabled="field.disabled"
            :autofocus="field.autofocus"
            :placeholder="field.placeholder"
            :prefix="field.prefix"
            :suffix="field.icon ? field.icon : field.suffix"
            @on-enter="field['on-enter']" @on-click="field['on-click']" @on-change="field['on-change']" @on-focus="field['on-focus']"
            @on-blur="field['on-blur']" @on-keyup="field['on-keyup']" @on-keydown="field['on-keydown']" @on-keypress="field['on-keypress']"
            @on-search="field['on-search']" @on-clear="field['on-clear']"
            >
            <template slot="prepend">
              <slot :name="field.name + '-prepend'">
              </slot>
            </template>

            <template slot="append">
              <slot :name="field.name + '-append'">
              </slot>
            </template>

            <template slot="prefix">
              <slot :name="field.name + '-prefix'">
              </slot>
            </template>

            <template slot="suffix">
              <slot :name="field.name + '-suffix'">
              </slot>
            </template>
          </Input>
        </FormItem>

        <template v-if="field.type == 'password'">
          <FormItem :label="field.label" :prop="field.name">
            <Input
              v-model="formVal[field.name]"
              :readonly="field.readonly"
              :disabled="field.disabled"
              :autofocus="field.autofocus"
              :placeholder="field.placeholder"
              :prefix="field.prefix"
              :suffix="field.icon ? field.icon : field.suffix"
              @on-enter="field['on-enter']" @on-click="field['on-click']" @on-change="field['on-change']" @on-focus="field['on-focus']"
              @on-blur="field['on-blur']" @on-keyup="field['on-keyup']" @on-keydown="field['on-keydown']" @on-keypress="field['on-keypress']"
              @on-search="field['on-search']" @on-clear="field['on-clear']"
              >
              <template slot="prepend">
                <slot :name="field.name + '-prepend'">
                </slot>
              </template>

              <template slot="append">
                <slot :name="field.name + '-append'">
                </slot>
              </template>

              <template slot="prefix">
                <slot :name="field.name + '-prefix'">
                </slot>
              </template>

              <template slot="suffix">
                <slot :name="field.name + '-suffix'">
                </slot>
              </template>
            </Input>
          </FormItem>
          <FormItem v-if="field.noconfirm == undefined || field.noconfirm == false" :label="'确认' + field.label" :prop="field.name + '_confirmation'">
            <Input
              v-model="formVal[field.name + '_confirmation']"
              :readonly="field.readonly"
              :disabled="field.disabled"
              :placeholder="'请输入确认' + field.label"
              :prefix="field.prefix"
              :suffix="field.icon ? field.icon : field.suffix"
              @on-enter="field['on-enter']" @on-click="field['on-click']" @on-change="field['on-change']" @on-focus="field['on-focus']"
              @on-blur="field['on-blur']" @on-keyup="field['on-keyup']" @on-keydown="field['on-keydown']" @on-keypress="field['on-keypress']"
              @on-search="field['on-search']" @on-clear="field['on-clear']"
              >
              <template slot="prepend">
                <slot :name="field.name + '-prepend'">
                </slot>
              </template>

              <template slot="append">
                <slot :name="field.name + '-append'">
                </slot>
              </template>

              <template slot="prefix">
                <slot :name="field.name + '-prefix'">
                </slot>
              </template>

              <template slot="suffix">
                <slot :name="field.name + '-suffix'">
                </slot>
              </template>
            </Input>
          </FormItem>
        </template>

        <FormItem v-if="field.type == 'radio'" :label="field.label" :prop="field.name">
          <RadioGroup
            v-model="formVal[field.name]"
            :type="field.group != undefined ? field.group.type : null"
            :vertical="field.group ? field.group.vertical : false"
            >
              <Radio v-for="radio in field.radios"
                :label="radio.value"
                :disabled="radio.disabled"
                :border="radio.border"
                >
                {{ radio.label }}
              </Radio>
          </RadioGroup>
        </FormItem>


        <FormItem v-if="field.type == 'checkbox'" :label="field.label" :prop="field.name">
          <CheckboxGroup
            v-model="formVal[field.name]"
            @on-change="field['on-change']"
            >
            <Checkbox v-for="checkbox in field.checkboxs"
              :label="checkbox.value"
              :disabled="checkbox.disabled"
              :border="checkbox.border"
              >
              {{ checkbox.label }}
            </Checkbox>
          </CheckboxGroup>
        </FormItem>

        <FormItem v-if="field.type == 'checkbox-only'" :label="field.label" :prop="field.name">
          <Checkbox
            v-model="formVal[field.name]"
            :disabled="field.disabled"
            :border="field.border"
            :true-value="1"
            :false-value="0"
            @on-change="field['on-change']"
            >
          </Checkbox>
        </FormItem>

        <FormItem v-if="field.type == 'switch'" :label="field.label" :prop="field.name">
          <i-switch
            v-model="formVal[field.name]"
            :disabled="field.disabled"
            :true-value="1"
            :false-value="0"
            :true-color="field['true-color']"
            :false-color="field['false-color']"
            :before-change="field['before-change']"
            @on-change="field['on-change']"
            >
            <span slot="open">
              <slot :name="field.name + '-open'">
              </slot>
            </span>
            <span slot="close">
              <slot :name="field.name + '-close'">
              </slot>
            </span>
          </i-switch>
        </FormItem>

        <FormItem v-if="field.type == 'select' || field.type == 'select-mult'" :label="field.label" :prop="field.name">
          <Select
            v-model="formVal[field.name]"
            :not-found-text="field['not-found-text']"
            :disabled="field.disabled"
            :clearable="field.clearable"
            :filterable="field.filterable"
            :placeholder="field.placeholder"
            :prefix="field.prefix"
            :max-tag-count="field['max-tag-count']"
            :max-tag-placeholder ="field['max-tag-placeholder']"
            :multiple="field.type == 'select-mult'"
            @on-change="field['on-change']"
            >
            <template v-if="field.optionGroups">
              <OptionGroup v-for="options in field.optionGroups" :label="options.label">
                <Option
                  v-for="option in options.options"
                  :value="option.value"
                  :label="option.label"
                  :disabled="option.disabled"
                  >
                  <template>
                    <slot :name="field.name + '-option'">
                      <!-- 自定义选项内容 -->
                    </slot>
                  </template>
                </Option>
              </OptionGroup>
            </template>
            <template v-else>
              <Option
                v-for="option in field.options"
                :value="option.value"
                :label="option.label"
                :disabled="option.disabled"
                >
                <template>
                  <slot :name="field.name + '-option'">
                    <!-- 自定义选项内容 -->
                  </slot>
                </template>
              </Option>
            </template>

            <template slot="prefix">
              <slot :name="field.name + '-prefix'">
              </slot>
            </template>
          </Select>
        </FormItem>

        <!-- 穿梭框 -->
        <FormItem v-if="field.type == 'transfer'" :label="field.label" :prop="field.name">
          <Transfer
            :data="field.data"
            :target-keys="formVal[field.name]"
            :titles="field.titles"
            :list-style="field.listStyle"
            :filterable="field.filterable"
            @on-change="(targetKeys, direction, moveKeys) => {onTransferChange(targetKeys, direction, moveKeys, field)}"
            >
          </Transfer>
        </FormItem>

        <!-- 颜色选择器 -->
        <FormItem v-if="field.type == 'color'" :label="field.label" :prop="field.name">
          <ColorPicker
            v-model="formVal[field.name]"
            :disabled="field.disabled"
            :editable="field.editable"
            :alpha="field.alpha"
            :hue="field.hue"
            :recommend="field.recommend ? field.recommend : true"
            :colors="field.colors"
            @on-change="field['on-change']"
            />
        </FormItem>


        <!-- 评分 -->
        <FormItem v-if="field.type == 'rate'" :label="field.label" :prop="field.name">
          <Rate
            v-model="formVal[field.name]"
            :disabled="field.disabled"
            :character="field.character"
            :icon="field.icon"
            :allow-half="field['allow-half'] ? field['allow-half'] : true"
            :show-text="field['show-text'] ? field['show-text'] : true"
            @on-change="field['on-change']"
            >
            <slot :name="field.name + '-rate'" :rate="formVal[field.name]">
              <span style="color: #f5a623">{{ formVal[field.name] }}</span>
            </slot>
          </Rate>
        </FormItem>

        <!-- 级联 -->
        <FormItem v-if="field.type == 'cascader'" :label="field.label" :prop="field.name">
          <Cascader
            v-model="formVal[field.name]"
            :data="field.data"
            :trigger="field.trigger"
            :disabled="field.disabled"
            :filterable="field.filterable"
            :clearable="field.clearable"
            :placeholder="field.placeholder"
            :transfer="field.transfer"
            :change-on-select="field['change-on-select']"
            :render-format="field['render-format']"
            @on-change="field['on-change']"
            >
          </Cascader>
        </FormItem>


        <!-- 日期选择框 -->
        <FormItem
          v-if="isDatePicker(field.type)"
          :label="field.label" :prop="field.name">
          <DatePicker
            :value="formVal[field.name]"
            :type="field.type"
            :format="getDateTimeFormat(field)"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :clearable="field.clearable"
            :readonly="field.readonly"
            :editable="field.editable"
            :transfer="field.transfer"
            :placement="field.placement"
            :options="field.options"
            :show-week-numbers="field['show-week-numbers']"
            :start-date="field['start-date']"
            :confirm="field['confirm']"
            style="width: 200px"
            @on-change="(val, type) => {onDateChange(val, type, field)}"
            >
          </DatePicker>
        </FormItem>

        <!-- 时间选择框 -->
        <FormItem
          v-if="isTimePicker(field.type)"
          :label="field.label" :prop="field.name">
          <TimePicker
            :value="formVal[field.name]"
            :type="field.type"
            :format="getDateTimeFormat(field)"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :clearable="field.clearable"
            :readonly="field.readonly"
            :editable="field.editable"
            :steps="field.steps"
            :disabled-hours="field['disabled-hours']"
            :disabled-minutes="field['disabled-minutes']"
            :disabled-seconds="field['disabled-seconds']"
            :hide-disabled-options="field['hide-disabled-options']"
            :confirm="field.confirm"
            :transfer="field.transfer"
            :placement="field.placement"
            :options="field.options"
            :show-week-numbers="field['show-week-numbers']"
            :start-date="field['start-date']"
            style="width: 200px"
            @on-change="(val, type) => {onDateChange(val, type, field)}"
            >
          </TimePicker>
        </FormItem>

        <FormItem v-if="field.type == 'upload'" :label="field.label" :prop="field.name">
          <sm-upload
            :ref="field.name + '-upload'"
            v-model="formVal[field.name]"
            :multiple="false"
            :filename="field.filename ? field.filename : 'FileContent'"
            :upload-url="field.uploadUrl"
            :data="field.data"
            :headers="field.headers"
            :format="field.format"
            :defaultImgs="field.defaultImgs"
            :width="field.width"
            :height="field.height"
            :handleResult="field.handleResult"
            :no-edit="field.noEdit ? field.noEdit : false"
            >
          </sm-upload>
        </FormItem>

        <FormItem v-if="field.type == 'upload-album' || field.type == 'upload-detail'" :label="field.label" :prop="field.name">
          <sm-upload
            :ref="field.name + '-upload-mul'"
            v-model="formVal[field.name]"
            :multiple="true"
            :mul-type="field.type == 'upload-detail' ? 'detail' : 'album'"
            :filename="field.filename ? field.filename : 'FileContent'"
            :upload-url="field.uploadUrl"
            :data="field.data"
            :headers="field.headers"
            :format="field.format"
            :defaultImgs="field.defaultImgs"
            :width="field.width"
            :height="field.height"
            :handleResult="field.handleResult"
            :no-edit="field.noEdit ? field.noEdit : false"
            @on-change="field['on-change']"
            >
          </sm-upload>
        </FormItem>

        <FormItem v-if="field.type == 'editor'" :label="field.label" :prop="field.name">
          <sm-editor
            :ref="field.name + '-editor'"
            v-model="formVal[field.name]"
            :localCache="false"
            :width="field.width"
            :height="field.height"
            @on-change="field['on-change']"
            />
        </FormItem>

        <FormItem v-if="field.type == 'markdown'" :label="field.label" :prop="field.name">
          <sm-markdown
            :ref="field.name + 'markdown'"
            v-model="formVal[field.name]"
            :localCache="false"
            :options="field.options"
            :width="field.width"
            :height="field.height"
            @on-change="field['on-change']"
            />
        </FormItem>
      </template>

      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  import Util from '../../libs/util';
  import dateUtil from 'view-design/src/utils/date';

  export default {
    props: {
      form: {
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
        formVal: {},
        // ruleValidate: {
        //   name: [{
        //     required: true,
        //     message: 'The name cannot be empty',
        //     trigger: 'blur'
        //   }],
        //   mail: [{
        //       required: true,
        //       message: 'Mailbox cannot be empty',
        //       trigger: 'blur'
        //     },
        //     {
        //       type: 'email',
        //       message: 'Incorrect email format',
        //       trigger: 'blur'
        //     }
        //   ],
        //   city: [{
        //     required: true,
        //     message: 'Please select the city',
        //     trigger: 'change'
        //   }],
        //   gender: [{
        //     required: true,
        //     message: 'Please select gender',
        //     trigger: 'change'
        //   }],
        //   interest: [{
        //       required: true,
        //       type: 'array',
        //       min: 1,
        //       message: 'Choose at least one hobby',
        //       trigger: 'change'
        //     },
        //     {
        //       type: 'array',
        //       max: 2,
        //       message: 'Choose two hobbies at best',
        //       trigger: 'change'
        //     }
        //   ],
        //   date: [{
        //     required: true,
        //     type: 'date',
        //     message: 'Please select the date',
        //     trigger: 'change'
        //   }],
        //   time: [{
        //     required: true,
        //     type: 'string',
        //     message: 'Please select time',
        //     trigger: 'change'
        //   }],
        //   desc: [{
        //       required: true,
        //       message: 'Please enter a personal introduction',
        //       trigger: 'blur'
        //     },
        //     {
        //       type: 'string',
        //       min: 20,
        //       message: 'Introduce no less than 20 words',
        //       trigger: 'blur'
        //     }
        //   ]
        // }
      }
    },
    computed: {
      // formVal () {      // 表单输入
      //   let fields = this.fields;
      //   let formVal = {};
      //   for (let field of fields) {
      //     let defaultVal = this.setDefault(field.type)
      //     formVal[field.name] = field.value ? field.value : defaultVal;
      //   }
      //   return formVal;
      // },
      currentFields () {
        let fields = this.fields;
        fields.filter((field, index, data) => {
          field = this.setDefaultFunc(field)
          return field
        })

        return fields;
      },
      formRule () {     // 验证规则
        let fields = this.fields;
        let formRule = {};
        for (let field of fields) {
          if (!field.rule) {
            continue;
          }
          formRule[field.name] = field.rule;

          if (field.type == 'password' && (field.noconfirm == undefined || field.noconfirm == false)) {
            // 如果是密码字段，增加确认密码字段
            formRule[field.name + "_confirmation"] = {
              required: true,
              message: '请输入确认密码',
              trigger: 'blur'
            };
          }
        }
        console.log(formRule)
        return formRule;
      }
    },
    watch: {
      fields () {
        this.setFormVal();
      }
    },
    methods: {
      setFormVal () {             // 初始化表单默认值
        let fields = this.fields;
        let formVal = {};
        for (let field of fields) {
          let defaultVal = this.setDefault(field.type);
          if (field.type == 'number' || field.type == 'color') {
            field.value = Number(field.value);
          }
          formVal[field.name] = field.value ? field.value : defaultVal;
          if (field.type == 'password') {
            formVal[field.name + "_confirmation"] = '';
          }
        }
        console.log(formVal);
        this.formVal = formVal;
      },
      setDefault (type) {       // 根据表单类型设置 默认值
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
      setDefaultFunc (field) {
        field['on-enter'] = field['on-enter'] ? field['on-enter'] : function () {};
        field['on-click'] = field['on-click'] ? field['on-click'] : function () {};
        field['on-change'] = field['on-change'] ? field['on-change'] : function () {};
        field['on-focus'] = field['on-focus'] ? field['on-focus'] : function () {};
        field['on-blur'] = field['on-blur'] ? field['on-blur'] : function () {};
        field['on-keyup'] = field['on-keyup'] ? field['on-keyup'] : function () {};
        field['on-keydown'] = field['on-keydown'] ? field['on-keydown'] : function () {};
        field['on-keypress'] = field['on-keypress'] ? field['on-keypress'] : function () {};
        field['on-search'] = field['on-search'] ? field['on-search'] : function () {};
        field['on-clear'] = field['on-clear'] ? field['on-clear'] : function () {};

        return field;
      },
      isDatePicker (type) {
        const types = ['date', 'daterange', 'datetime', 'datetimerange', 'year', 'month'];

        return types.indexOf(type) >= 0;
      },
      isTimePicker (type) {
        const types = ['time', 'timerange'];

        return types.indexOf(type) >= 0;
      },
      isDate(type) {
        const types = ['date', 'datetime', 'year', 'month'];
        return types.indexOf(type) >= 0;
      },
      isDateRange(type) {
        const types = ['daterange', 'datetimerange'];
        return types.indexOf(type) >= 0;
      },
      getDateTimeFormat(field) {
        if (field.format != undefined && field.format != '') {
          return field.format;
        }

        let format = 'yyyy-MM-dd';
        switch(field.type) {
          case 'date':
          case 'daterange':
            format = 'yyyy-MM-dd';
            break;
          case 'datetime':
          case 'datetimerange':
            format = 'yyyy-MM-dd HH:mm:ss'
            break;
          case 'month':
            format = 'yyyy-MM';
            break;
          case 'year':
            format = 'yyyy';
            break;
          case 'time':
          case 'timerange':
            format = 'HH:mm:ss';
            break;
        }
        return format;
      },
      onDateChange (value, type, field) {   // value 格式化的值，type 日期选择框类型，field 表单名字
        this.formVal[field.name] = value;
        field['on-change'](value);    // 触发父组件回调方法
      },
      onTransferChange (targetKeys, direction, moveKeys, field) {
        this.formVal[field.name] = targetKeys;
        field['on-change'](targetKeys, direction, moveKeys);    // 触发父组件回调方法
      },
      handleSubmit(name) {
        console.log(this.formVal)
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!');
          } else {
            this.$Message.error('Fail!');
          }
        })

        // console.log(typeof this.formVal.date_picker);
        // this.filterFormVal();
      },
      // filterFormVal() {
      //   for (let field of this.currentFields) {
      //     // if (this.isDatePicker(field.type)) {
      //     //   this.filterDate(field);
      //     // }
      //   }
      // },
      // dateToFormat (date, format) {
      //   let formatDate = dateUtil.format(date, format);
      //   return formatDate;
      // },
      // filterDate(field) {
      //   if (this.isDateRange(field.type)) {
      //     var formatDate = [];
      //
      //     for (let val of this.formVal[field.name]) {
      //       if (typeof val == 'object') {
      //         formatDate.push(this.dateToFormat(val, this.getDateTimeFormat(field)));
      //       }
      //     }
      //     console.log(formatDate);
      //     // this.formVal[field.name] = formatDate;
      //   } else {
      //     if (typeof this.formVal[field.name] == 'object') {
      //       this.formVal[field.name] = this.dateToFormat(this.formVal[field.name], this.getDateTimeFormat(field));
      //     }
      //   }
      // },
      handleReset(name) {
        // this.$refs[name].resetFields();
      }
    },
    created () {
      this.setFormVal();
      console.log('on-' + 'date_picker' + '-change');
    }
  };
</script>

<style scoped>
.my-field {
    float: left;
}
</style>
