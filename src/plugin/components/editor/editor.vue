<template>
  <div class="editor-wrapper">
    <!-- <div :id="editorId" ></div> -->
    <vue-neditor-wrap v-model="content" :config="myConfig" :destroy="false"></vue-neditor-wrap>
  </div>
</template>

<script>
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'
import Util from '../../libs/util'
import VueNeditorWrap from 'vue-neditor-wrap'

export default {
  name: 'Editor',
  data(){
    return{
      myConfig: {
        content:'',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: '/adminapi/myUpload',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: process.env.NODE_ENV === 'production' ? '/admin_dist/NEditor/' : '/NEditor/'
      },
      content:''
    }
  },
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
        return Util.inArray(val, ['html', 'text'])
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
    localCache: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '500px'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  components: {
    VueNeditorWrap
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  watch: {
    value (val) {
      this.content = val
      this.setHtml(val)
    },
    content(val){
      this.setHtml(val)
    }
  },
  methods: {
    setHtml (val) {
      // this.editor.txt.html(val)
      this.$emit('input', val)
      this.$emit('on-change', val)
    }
  },
  mounted () {
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.customConfig.onchange = (html) => {
      let text = this.editor.txt.text()
      if (this.localCache) localStorage.editorCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    this.editor.customConfig.onchangeTimeout = this.changeInterval
    this.editor.customConfig.uploadImgServer = window.publicPath + "api/myUpload";
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
