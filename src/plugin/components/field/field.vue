<template>
  <div class="sm-field">
    <template v-if="currentField.type == 'text'">
      <Input
        v-model="currentValue"
        :readonly="currentField.readonly"
        :disabled="currentField.disabled"
        :autofocus="currentField.autofocus"
        :maxlength="currentField.maxlength"
        :prefix="currentField.prefix"
        :suffix="currentField.icon ? currentField.icon : currentField.suffix"
        :placeholder="currentField.placeholder"
        @on-enter="currentField['on-enter']" @on-click="currentField['on-click']" @on-change="currentField['on-change']" @on-focus="currentField['on-focus']"
        @on-blur="currentField['on-blur']" @on-keyup="currentField['on-keyup']" @on-keydown="currentField['on-keydown']" @on-keypress="currentField['on-keypress']"
        @on-search="currentField['on-search']" @on-clear="currentField['on-clear']"
        >
        <template :slot="currentField.name + '-prepend'">
          <slot :name="currentField.name + '-prepend'">
          </slot>
        </template>

        <template slot="append">
          <slot :name="currentField.name + '-append'">
          </slot>
        </template>

        <template slot="prefix">
          <slot :name="currentField.name + '-prefix'">
          </slot>
        </template>

        <template slot="suffix">
          <slot :name="currentField.name + '-suffix'">
          </slot>
        </template>
      </Input>
    </template>

    <template v-if="currentField.type == 'textarea'">
      <Input
        type="textarea"
        v-model="currentValue"
        :readonly="currentField.readonly"
        :disabled="currentField.disabled"
        :autofocus="currentField.autofocus"
        :rows="currentField.rows"
        :autosize="currentField.autosize"
        :maxlength="currentField.maxlength"
        :show-word-limit="currentField['show-word-limit']"
        :placeholder="currentField.placeholder"
        @on-enter="currentField['on-enter']" @on-click="currentField['on-click']" @on-change="currentField['on-change']" @on-focus="currentField['on-focus']"
        @on-blur="currentField['on-blur']" @on-keyup="currentField['on-keyup']" @on-keydown="currentField['on-keydown']" @on-keypress="currentField['on-keypress']"
        @on-search="currentField['on-search']" @on-clear="currentField['on-clear']"
        >
      </Input>
    </template>

    <template v-if="currentField.type == 'search'">
      <Input
        search
        v-model="currentValue"
        :readonly="currentField.readonly"
        :disabled="currentField.disabled"
        :autofocus="currentField.autofocus"
        :enter-button="currentField['enter-button']"
        :rows="currentField.rows"
        :autosize="currentField.autosize"
        :maxlength="currentField.maxlength"
        :show-word-limit="currentField['show-word-limit']"
        :placeholder="currentField.placeholder"
        @on-enter="currentField['on-enter']" @on-click="currentField['on-click']" @on-change="currentField['on-change']" @on-focus="currentField['on-focus']"
        @on-blur="currentField['on-blur']" @on-keyup="currentField['on-keyup']" @on-keydown="currentField['on-keydown']" @on-keypress="currentField['on-keypress']"
        @on-search="currentField['on-search']" @on-clear="currentField['on-clear']"
        >
      </Input>
    </template>

    <template v-if="currentField.type == 'number'">
      <InputNumber
        v-model="currentValue"
        :readonly="currentField.readonly"
        :disabled="currentField.disabled"
        :autofocus="currentField.autofocus"
        :placeholder="currentField.placeholder"
        @on-enter="currentField['on-enter']" @on-click="currentField['on-click']" @on-change="currentField['on-change']" @on-focus="currentField['on-focus']"
        @on-blur="currentField['on-blur']" @on-keyup="currentField['on-keyup']" @on-keydown="currentField['on-keydown']" @on-keypress="currentField['on-keypress']"
        @on-search="currentField['on-search']" @on-clear="currentField['on-clear']"
        >
      </InputNumber>
    </template>

    <template v-if="currentField.type == 'email'">
      <Input
        v-model="currentValue"
        :readonly="currentField.readonly"
        :disabled="currentField.disabled"
        :autofocus="currentField.autofocus"
        :placeholder="currentField.placeholder"
        :prefix="currentField.prefix"
        :suffix="currentField.icon ? currentField.icon : currentField.suffix"
        @on-enter="currentField['on-enter']" @on-click="currentField['on-click']" @on-change="currentField['on-change']" @on-focus="currentField['on-focus']"
        @on-blur="currentField['on-blur']" @on-keyup="currentField['on-keyup']" @on-keydown="currentField['on-keydown']" @on-keypress="currentField['on-keypress']"
        @on-search="currentField['on-search']" @on-clear="currentField['on-clear']"
        >
        <template slot="prepend">
          <slot :name="currentField.name + '-prepend'">
          </slot>
        </template>

        <template slot="append">
          <slot :name="currentField.name + '-append'">
          </slot>
        </template>

        <template slot="prefix">
          <slot :name="currentField.name + '-prefix'">
          </slot>
        </template>

        <template slot="suffix">
          <slot :name="currentField.name + '-suffix'">
          </slot>
        </template>
      </Input>
    </template>

    <template v-if="currentField.type == 'password' || currentField.type == 'password_confirmation'" >
      <Input
        v-model="currentValue"
        :readonly="currentField.readonly"
        :disabled="currentField.disabled"
        :autofocus="currentField.autofocus"
        :placeholder="currentField.placeholder"
        :prefix="currentField.prefix"
        :suffix="currentField.icon ? currentField.icon : currentField.suffix"
        @on-enter="currentField['on-enter']" @on-click="currentField['on-click']" @on-change="currentField['on-change']" @on-focus="currentField['on-focus']"
        @on-blur="currentField['on-blur']" @on-keyup="currentField['on-keyup']" @on-keydown="currentField['on-keydown']" @on-keypress="currentField['on-keypress']"
        @on-search="currentField['on-search']" @on-clear="currentField['on-clear']"
        >
        <template slot="prepend">
          <slot :name="currentField.name + '-prepend'">
          </slot>
        </template>

        <template slot="append">
          <slot :name="currentField.name + '-append'">
          </slot>
        </template>

        <template slot="prefix">
          <slot :name="currentField.name + '-prefix'">
          </slot>
        </template>

        <template slot="suffix">
          <slot :name="currentField.name + '-suffix'">
          </slot>
        </template>
      </Input>
    </template>

    <template v-if="currentField.type == 'radio'">
      <RadioGroup
        v-model="currentValue"
        :type="currentField.group != undefined ? currentField.group.type : null"
        :vertical="currentField.group ? currentField.group.vertical : false"
        >
          <Radio v-for="(radio, index) in currentField.radios"
            :key="index"
            :label="radio.value"
            :disabled="radio.disabled"
            :border="radio.border"
            >
            {{ radio.label }}
          </Radio>
      </RadioGroup>
    </template>


    <template v-if="currentField.type == 'checkbox'">
      <CheckboxGroup
        v-model="currentValue"
        @on-change="currentField['on-change']"
        >
        <Checkbox v-for="(checkbox, index) in currentField.checkboxs"
          :key="index"
          :label="checkbox.value"
          :disabled="checkbox.disabled"
          :border="checkbox.border"
          >
          {{ checkbox.label }}
        </Checkbox>
      </CheckboxGroup>
    </template>

    <template v-if="currentField.type == 'checkbox-only'">
      <Checkbox
        v-model="currentValue"
        :disabled="currentField.disabled"
        :border="currentField.border"
        :true-value="1"
        :false-value="0"
        @on-change="currentField['on-change']"
        >
      </Checkbox>
    </template>

    <template v-if="currentField.type == 'switch'">
      <i-switch
        v-model="currentValue"
        :disabled="currentField.disabled"
        :true-value="1"
        :false-value="0"
        :true-color="currentField['true-color']"
        :false-color="currentField['false-color']"
        :before-change="currentField['before-change']"
        @on-change="currentField['on-change']"
        >
        <span slot="open">
          <slot :name="currentField.name + '-open'">
          </slot>
        </span>
        <span slot="close">
          <slot :name="currentField.name + '-close'">
          </slot>
        </span>
      </i-switch>
    </template>

    <template v-if="currentField.type == 'select' || currentField.type == 'select-mult'">
      <Select
        v-model="currentValue"
        :not-found-text="currentField['not-found-text']"
        :disabled="currentField.disabled"
        :clearable="currentField.clearable"
        :filterable="currentField.filterable"
        :placeholder="currentField.placeholder"
        :prefix="currentField.prefix"
        :max-tag-count="currentField['max-tag-count']"
        :max-tag-placeholder ="currentField['max-tag-placeholder']"
        :multiple="currentField.type == 'select-mult'"
        @on-change="currentField['on-change']"
        >
        <template v-if="currentField.optionGroups && currentField.optionGroups.length">
          <OptionGroup v-for="(options, inds) in currentField.optionGroups" :key="inds" :label="options.label">
            <Option
              v-for="(option, ind) in options.options"
              :key="index"
              :value="option.value"
              :label="option.label"
              :disabled="option.disabled"
              >
              <template>
                <slot :name="currentField.name + '-option'">
                  <!-- 自定义选项内容 -->
                </slot>
              </template>
            </Option>
          </OptionGroup>
        </template>
        <template v-else>
          <Option
            v-for="(option, ind) in currentField.options"
            :key="ind"
            :value="option.value"
            :label="option.label"
            :disabled="option.disabled"
            >
            <template>
              <slot :name="currentField.name + '-option'">
                <!-- 自定义选项内容 -->
              </slot>
            </template>
          </Option>
        </template>

        <template slot="prefix">
          <slot :name="currentField.name + '-prefix'">
          </slot>
        </template>
      </Select>
    </template>

    <!-- 穿梭框 -->
    <template v-if="currentField.type == 'transfer'">
      <Transfer
        :data="currentField.data"
        :target-keys="currentValue"
        :titles="currentField.titles"
        :list-style="currentField.listStyle"
        :filterable="currentField.filterable"
        @on-change="(targetKeys, direction, moveKeys) => {onTransferChange(targetKeys, direction, moveKeys, currentField)}"
        >
      </Transfer>
    </template>

    <!-- 颜色选择器 -->
    <template v-if="currentField.type == 'color'">
      <ColorPicker
        v-model="currentValue"
        :disabled="currentField.disabled"
        :editable="currentField.editable"
        :alpha="currentField.alpha"
        :hue="currentField.hue"
        :recommend="currentField.recommend ? currentField.recommend : true"
        :colors="currentField.colors"
        @on-change="currentField['on-change']"
        />
    </template>


    <!-- 评分 -->
    <template v-if="currentField.type == 'rate'">
      <Rate
        v-model="currentValue"
        :disabled="currentField.disabled"
        :character="currentField.character"
        :icon="currentField.icon"
        :allow-half="currentField['allow-half'] ? currentField['allow-half'] : true"
        :show-text="currentField['show-text'] ? currentField['show-text'] : true"
        @on-change="currentField['on-change']"
        >
        <slot :name="currentField.name + '-rate'" :rate="currentValue">
          <span style="color: #f5a623">{{ currentValue }}</span>
        </slot>
      </Rate>
    </template>

    <!-- 级联 -->
    <template v-if="currentField.type == 'cascader'">
      <Cascader
        v-model="currentValue"
        :data="currentField.data"
        :trigger="currentField.trigger"
        :disabled="currentField.disabled"
        :filterable="currentField.filterable"
        :clearable="currentField.clearable"
        :placeholder="currentField.placeholder"
        :transfer="currentField.transfer"
        :change-on-select="currentField['change-on-select']"
        :render-format="currentField['render-format']"
        @on-change="currentField['on-change']"
        >
      </Cascader>
    </template>


    <!-- 日期选择框 -->
    <template v-if="isDatePicker(currentField.type)">
      <DatePicker
        :value="currentValue"
        :type="currentField.type"
        :format="getDateTimeFormat(currentField)"
        :placeholder="currentField.placeholder"
        :disabled="currentField.disabled"
        :clearable="currentField.clearable"
        :readonly="currentField.readonly"
        :editable="currentField.editable"
        :transfer="currentField.transfer"
        :placement="currentField.placement"
        :options="currentField.options"
        :show-week-numbers="currentField['show-week-numbers']"
        :start-date="currentField['start-date']"
        :confirm="currentField['confirm']"
        style="width: 200px"
        @on-change="(val, type) => {onDateChange(val, type, currentField)}"
        >
      </DatePicker>
    </template>

    <!-- 时间选择框 -->
    <template v-if="isTimePicker(currentField.type)">
      <TimePicker
        :value="currentValue"
        :type="currentField.type"
        :format="getDateTimeFormat(currentField)"
        :placeholder="currentField.placeholder"
        :disabled="currentField.disabled"
        :clearable="currentField.clearable"
        :readonly="currentField.readonly"
        :editable="currentField.editable"
        :steps="currentField.steps"
        :disabled-hours="currentField['disabled-hours']"
        :disabled-minutes="currentField['disabled-minutes']"
        :disabled-seconds="currentField['disabled-seconds']"
        :hide-disabled-options="currentField['hide-disabled-options']"
        :confirm="currentField.confirm"
        :transfer="currentField.transfer"
        :placement="currentField.placement"
        :options="currentField.options"
        :show-week-numbers="currentField['show-week-numbers']"
        :start-date="currentField['start-date']"
        style="width: 200px"
        @on-change="(val, type) => {onDateChange(val, type, currentField)}"
        >
      </TimePicker>
    </template>

    <template v-if="currentField.type == 'upload'">
      <sm-upload
        :ref="currentField.name + '-upload'"
        v-model="currentValue"
        :multiple="false"
        :filename="currentField.filename ? currentField.filename : 'FileContent'"
        :upload-url="currentField.uploadUrl"
        :data="currentField.data"
        :headers="currentField.headers"
        :format="currentField.format"
        :defaultImgs="currentField.defaultImgs"
        :width="currentField.width"
        :height="currentField.height"
        :handleResult="currentField.handleResult"
        :no-edit="currentField.noEdit ? currentField.noEdit : false"
        >
      </sm-upload>
    </template>

    <template v-if="currentField.type == 'upload-album' || currentField.type == 'upload-detail'">
      <sm-upload
        :ref="currentField.name + '-upload-mul'"
        v-model="currentValue"
        :multiple="true"
        :mul-type="currentField.type == 'upload-detail' ? 'detail' : 'album'"
        :filename="currentField.filename ? currentField.filename : 'FileContent'"
        :upload-url="currentField.uploadUrl"
        :data="currentField.data"
        :headers="currentField.headers"
        :format="currentField.format"
        :defaultImgs="currentField.defaultImgs"
        :width="currentField.width"
        :height="currentField.height"
        :handleResult="currentField.handleResult"
        :no-edit="currentField.noEdit ? currentField.noEdit : false"
        @on-change="currentField['on-change']"
        >
      </sm-upload>
    </template>

    <template v-if="currentField.type == 'editor'">
      <sm-editor
        :ref="currentField.name + '-editor'"
        v-model="currentValue"
        :localCache="false"
        :width="currentField.width"
        :height="currentField.height"
        @on-change="currentField['on-change']"
        />
    </template>

    <template v-if="currentField.type == 'markdown'">
      <sm-markdown
        :ref="currentField.name + '-markdown'"
        v-model="currentValue"
        :localCache="false"
        :options="currentField.options"
        :width="currentField.width"
        :height="currentField.height"
        @on-change="currentField['on-change']"
        />
    </template>

    <template v-if="currentField.type == 'tags'">
      <sm-tags
        :ref="currentField.name + '-tags'"
        :value="currentValue"
        :tags="currentField.tags"
        @on-change="currentField['on-change']"
        />
    </template>

  </div>
</template>
<script>
  import Util from '../../libs/util';

  export default {
    props: {
      value: {
        default: null
      },
      field: {
        type: [Object],
        default: function () {
          return {}
        }
      },
    },
    data() {
      return {
        currentValue: this.value
      }
    },
    watch: {
      value (val) {
        this.setCurrentValue(val);
      },
      currentValue (val) {
        this.$emit('input', val);
        this.$emit('on-change', val);
      }
    },
    computed: {
      currentField () {
        let field = this.field;

        field = this.setDefaultFunc(field)
        return field;
      }
    },
    methods: {
      setCurrentValue (val) {
        this.currentValue = val;
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
        this.currentValue = value;
        field['on-change'](value);    // 触发父组件回调方法
      },
      onTransferChange (targetKeys, direction, moveKeys, field) {
        this.currentValue = targetKeys;
        field['on-change'](targetKeys, direction, moveKeys);    // 触发父组件回调方法
      }
    },
    created () {
    }
  };
</script>

<style scoped>
.my-field {
    float: left;
}
</style>
