<template>
  <div class="upload-index">
    <template v-if="multiple && mulType == 'album'">
      <div class="upload-list" v-for="(item,index) in uploadList">
        <template v-if="item.status === 'finished'">
          <img :src="item.url + '?x-oss-process=image/resize,m_fill,h_100,w_100'">
          <div class="upload-cover">
            <Icon type="ios-eye-outline" @click.native="handlePreview(item)"></Icon>
            <Icon v-if="!noEdit" type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" status="active" :percent="item.percentage" :stroke-width="10" text-inside></Progress>
        </template>
      </div>
    </template>

    <!-- noEdit 模式如果是单图上传，要显示出来 upload,但是是 disabled -->
    <Upload
      v-show="!noEdit || !multiple"
      :disabled="noEdit"
      ref="upload"
      :action="uploadUrl"
      :multiple="multiple"
      :headers="headers"
      :type="type"
      :data="data"
      :name="filename"
      :with-credentials="withCredentials"
      :show-upload-list="showUploadList"
      :default-file-list="defaultList"
      :max-size="maxSize"
      :format="format"
      :before-upload="handleBeforeUpload"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :style="[uploadStyle, displayInline]"
      >
      <!-- style="display: inline-block;" -->
      <div>
        <template v-if="!multiple">
          <template v-if="uploadList.length">
            <div class="upload-sim" :style="uploadStyle" v-for="(item,index) in uploadList">
              <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="upload-cover">
                  <Icon type="ios-eye-outline" @click.stop="handlePreview(item)"></Icon>
                  <Icon v-if="!noEdit" type="ios-trash-outline" @click.stop="handleRemove(item)"></Icon>
                </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" status="active" :percent="item.percentage" :stroke-width="10" text-inside></Progress>
              </template>
            </div>
          </template>
          <template v-else>
            <div :style="uploadStyle">
              <Icon type="ios-camera" size="20" ></Icon>
            </div>
          </template>
        </template>

        <template v-else>
          <div :style="uploadStyle">
            <Icon type="ios-camera" size="20"></Icon>
          </div>
        </template>
      </div>
    </Upload>

    <!-- 相册多图在上传按钮下边 -->
    <div v-if="multiple && mulType == 'detail'" class="upload-box">
      <div class="upload-detail" v-for="(item,index) in uploadList">
        <template v-if="item.status === 'finished'">
          <img :src="item.url">
          <div class="upload-cover">
            <Icon type="ios-eye-outline" @click.native="handlePreview(item)"></Icon>
            <Icon v-if="!noEdit" type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" status="active" :percent="item.percentage" :stroke-width="10" text-inside></Progress>
        </template>
      </div>
    </div>

    <div v-if="multiple && mulType == 'custom'" class="upload-custom">
      <slot name="mul-custom" :uploadList="uploadList">

      </slot>
    </div>

    <Modal title="查看图片" v-model="maxVisible">
      <img :src="maxImgUrl" v-if="maxVisible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>

  export default {
    props: {
      multiple: {
        default: false
      },
      mulType: {
        default: 'album',           // album:相册，detail: 详情，custom: 自定义
      },
      imgNum: {  // 最多上传多少张，多选有效
        default: 10
      },
      uploadUrl: {
        default: window.publicPath + "api/myUpload"
      },
      data: {
        default: function () {
  	      return {
            file_type: "defaults"
          };
  			}
      },
      value: {
        type: [String, Array],
        default: ''
      },
      headers: {
        default: function () {
          return {}
        }
      },
      format: {
        default: function () {
          return ['jpg','jpeg','png', 'gif'];
        }
      },
      filename: {
        default: "file",
      },
      maxSize: {
        default: 10240,      // 10M,
      },
      type: {
        default: "drag",
      },
      width: {
        default: '58px'
      },
      height: {
        default: '58px'
      },
      noEdit: {
        default: false
      },
      handleResult: {
        default: null
      }
    },
    data () {
      return {
        showUploadList: false,
        maxVisible: false,
        maxImgUrl: '',
        uploadList: [],
        withCredentials: false,
      }
    },
    computed: {
      defaultList () {
        var defaultImgs = this.value;
        var newImgs = [];

        if (defaultImgs == '' || defaultImgs == null) {

        } else if (typeof defaultImgs == 'string') {
          newImgs[0] = {name: "default_0", url: defaultImgs};
        } else if (defaultImgs[0] != undefined) {
          if (defaultImgs[0]['name'] == undefined) {   // 初始化成 name ,url 下标模式
            for (var i in defaultImgs) {
              newImgs[i] = {name: "default_" + i, url: defaultImgs[i]}; // 生成一个 唯一名称
            }
          } else {
            newImgs = defaultImgs;
          }
        }
        return newImgs;
      },
      uploadStyle () {
        return {
          width: this.width,
          height: this.height,
          'line-height': this.height,
        }
      },
      displayInline () {
        return {
          display: (this.mulType == 'album' ? 'inline-block' : 'block')
        }
      }
      // uploadShow () {
      //   if (this.noEdit) {
      //     // 不可编辑
      //     if (this.multiple) {  // 多选，隐藏上传按钮
      //       return false;
      //     } else {
      //       if (this.defaultList.length > 0) {
      //         return true;
      //       } else {
      //         return false;
      //       }
      //     }
      //   }
      //   return true;
      // }
    },
    watch: {
      value (newVal, oldVal) {
        this.initDefaultImgs();
      }
    },
    methods: {
      handleBeforeUpload (file) {
        const img_length = this.multiple ? this.imgNum : 1;
        const check = this.uploadList.length < img_length;

        if (!check && this.multiple) {
          this.$Notice.warning({
            title: '最多只能上传 '+ img_length +' 张图片。'
          });
        }

        return check || !this.multiple;
      },
      handleProgress (event, file, fileList) {
        if (!this.multiple) {
          this.uploadList = [file];     // 重置，显示进度条
        }
      },
      handleSuccess (response, file, fileList) {
        // response 服务端返回，file 处理之后的结果，res == file.response;
        if (this.handleResult) {
          var fileResult = this.handleResult(response);  // {error: 0, error_msg: 'error != 0 时错误信息', filename: '文件完整路径'}
          if (fileResult.error == 0) {
            file = Util.extend(file, fileResult);
            if (!this.multiple) {
              this.uploadList = [file];
            }

            this.emitInput();
          } else {
            this.$Notice.warning({
              title: '图片上传失败',
              desc: fileResult.error_msg
            });
          }
        } else {
          if (response.error == 0) {
            file.url = response.filename;
            if (!this.multiple) {
              this.uploadList = [file];
            }
            this.emitInput();
          }else {
            this.$Notice.warning({
              title: '图片上传失败',
              desc: response.info
            });
          }
        }
      },
      handleFormatError (file, fileList) {
        // file 原始文件内容，包括，原始文件名， 修改时间大小，类型
        var format_str = " ";
        var format = this.format;
        for (var i in format) {
          format_str += format[i] + " ";
        }
        this.$Notice.warning({
          title: '图片格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传'+ format_str +'格式的图片。'
        });
      },
      handleMaxSize (file, fileList) {
        this.$Notice.warning({
          title: '超出图片大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 10M。'
        });
      },
      handleError (error, file, fileList) {
        console.log('error');
        this.$Notice.warning({
          title: '图片上传失败'
        });
      },
      handleRemove (file) {
        const fileList = this.uploadList;
        this.uploadList.splice(fileList.indexOf(file), 1);
        this.emitInput();
      },
      handlePreview (file) {
        this.maxImgUrl = file['url'];
        this.maxVisible = true;
      },
      emitInput() {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$emit('input', this.imgList())
            this.$emit('on-change', this.imgList())
          }, 500)
        })
      },
      imgList () {
        var imgList = this.uploadList;

        if (this.multiple) {
          var newImgs = [];
          for (var i in imgList) {
              newImgs[i] = imgList[i]['url'];
          }
        } else {
          var newImgs = imgList[0] != undefined ? imgList[0]['url'] : '';
        }

        return newImgs;
      },
      imgNameList () {
        var imgList = this.uploadList;

        if (this.multiple) {
          var newImgs = [];
          for (var i in imgList) {
              newImgs[i] = {name: imgList[i]['name'], url: imgList[i]['url']};
          }
        } else {
          var newImgs = imgList[0] != undefined ? imgList[0]['url'] : '';
        }

        return newImgs;
      },
      imgFullList () {
        if (!this.multiple) {
          return this.uploadList[0] != undefined ? this.uploadList[0]['url'] : '';
        }
        return this.uploadList;
      },
      initDefaultImgs () {
        var _this = this;
        _this.$nextTick(() => {
          _this.uploadList = _this.$refs.upload.fileList;
        });
      }
    },
    created: function () {
    },
    mounted: function (){
      var _this = this;

      _this.initDefaultImgs();
    }
  };
</script>

<style scoped>
  .upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }


  .upload-list img{
    width: 100%;
    height: 100%;
  }
  .upload-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .upload-list:hover .upload-cover{
    display: block;
  }
  .upload-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .upload-sim{
    text-align: center;
    border-radius: 4px;
    padding: 2px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
  }
  .upload-sim img {
    border-radius: 4px;
    width: 100%;
    height: 100%;
  }
  .upload-sim:hover .upload-cover{
    display: block;
  }

  .upload-box {
    width: 375px;
    height: 667px;
    overflow: auto;
    margin-top: 10px;
    border: 1px dashed #dcdee2;
  }
  .upload-detail {
    position: relative;
  }

  .upload-detail img {
    margin: 0;
    padding: 0;
    width: 100%;
  }
  .upload-detail:hover .upload-cover{
    display: block;
  }
</style>
<style>
  .ivu-progress .ivu-progress-bg {
    line-height: 10px !important;
  }
</style>
