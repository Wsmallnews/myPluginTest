<template>
  <div class="sm-Tags">
    <Tag
      v-for="(item, index) in tags"
      :key="index"
      checkable
      :checked="isChecked(item)"
      type="border"
      size="medium"
      color="primary"
      @on-change="(checked) => {onChange(checked, item)}"
      >
      {{ item.name }}
    </Tag>
  </div>
</template>

<script>
import Util from '../../libs/util'
export default {
  name: 'Tags',
  props: {
    value: {
      type: Array,
      default: []
    },
    tags: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      currentValue: []
    }
  },
  watch: {
    value (val) {
      this.currentValue = JSON.parse(JSON.stringify(val));
    }
  },
  methods: {
    setCurrentValue () {
      for (let i in this.currentValue) {
        if (!Util.inArray(this.currentValue[i], this.tags, 'name')) {
          this.currentValue.splice(i, 1)
        }
      }
    },
    isChecked(item) {
      if (Util.inArray(item.name, this.currentValue)) {
        return true;
      }

      return false;
    },
    switchType (item) {
      return this.isChecked(item) ? '' : 'border';
    },
    onChange (checked, item) {
      this.setCurrentValue();
      if (checked) {
        if (!Util.inArray(item.name, this.currentValue)) {
          this.currentValue.push(item.name)
        }
      } else {
        var index = this.currentValue.indexOf(item.name);
        this.currentValue.splice(index, 1)
      }

      this.$emit('on-change', this.currentValue, item)
    }
  },
  created () {
    this.currentValue = this.value
  }
}
</script>

<style scoped>
  .ivu-tag-border.ivu-tag-primary.ivu-tag-checked {
    background: #2d8cf0 !important;
  }
</style>
<style>
  .ivu-tag-border.ivu-tag-primary.ivu-tag-checked .ivu-tag-color-primary {
    color: #FFFFFF !important;
  }
</style>
