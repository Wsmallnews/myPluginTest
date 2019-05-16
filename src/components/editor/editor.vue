<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
  </div>
</template>

<script>
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'
import { oneOf } from '@/libs/tools'
import Util from '@/libs/util';

export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        return oneOf(val, ['html', 'text'])
      }
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  methods: {
    getHtml () {
      return this.editor.txt.html()
    },
    getText () {
      return this.editor.txt.text()
    },
    setHtml (val) {
      this.editor.txt.html(val)
    }
  },
  mounted () {
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.customConfig.onchange = (html) => {
      let text = this.editor.txt.text()
      if (this.cache) localStorage.editorCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    this.editor.customConfig.onchangeTimeout = this.changeInterval
    this.editor.customConfig.uploadImgServer = Util.apiUrl('/adminapi/myUpload', true);
    // 允许图片上传大小 50M
    this.editor.customConfig.uploadImgMaxSize = 50 * 1024 * 1024;
    // 上传文件名
    this.editor.customConfig.uploadFileName = 'FileContent';
    // 后端接口原因，一次只能上传一张
    this.editor.customConfig.uploadImgMaxLength = 1;
    // this.editor.customConfig.debug = true;
    // 自定义额外参数
    this.editor.customConfig.uploadImgParams = {
      file_type: "editors"
    }
    // 自定义 headers
    // this.editor.customConfig.uploadImgHeaders = {
    //
    // }

    this.editor.customConfig.customAlert = (info) => {
      this.$Notice.error({
        title: '提示',
        desc: info
      })
    }

    this.editor.customConfig.uploadImgHooks = {
      customInsert: (insertImg, result, editor) => {
        if (result.error == 0) {
          var url = result.filename
          insertImg(url)
        } else {
          this.$Notice.error({
            title: '提示',
            desc: result.info
          })
        }
      }
    }

    // create这个方法一定要在所有配置项之后调用
    this.editor.create()
    // 如果本地有存储加载本地存储内容
    let html = this.value || localStorage.editorCache
    if (html) this.editor.txt.html(html)
  }
}
</script>

<style>
</style>
