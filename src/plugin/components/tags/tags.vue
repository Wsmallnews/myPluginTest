<template>
  <div class="sm-Tags">
    <Tag
      v-for="item in tags"
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
  name: 'Editor',
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
    }
  },
  watch: {
    value () {
      this.setValue();
    }
  },
  methods: {
    setValue () {
      for (let i in this.value) {
        if (!Util.inArray(this.value[i], this.tags, 'name')) {
          this.value.splice(i, 1)
        }
      }
    },
    isChecked(item) {
      if (Util.inArray(item.name, this.value)) {
        return true;
      }

      return false;
    },
    switchType (item) {
      return this.isChecked(item) ? '' : 'border';
    },
    onChange (checked, item) {
      if (checked) {
        if (!Util.inArray(item.name, this.value)) {
          this.value.push(item.name)
        }
      } else {
        var index = this.value.indexOf(item.name);
        this.value.splice(index, 1)
      }

      this.$emit('on-change', item, this.value)
    }
  },
  created () {
    this.setValue();
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
