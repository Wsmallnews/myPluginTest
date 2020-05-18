<template>
  <div class="download">
    <i-switch
      :value="item.is_download"
      size="large"
      :true-value="1"
      :false-value="0"
      @on-change="onChange"
      >
      <span slot="open">开启</span>
      <span slot="close">关闭</span>
    </i-switch>

    <div style="height: 20px;"></div>

    <div class="download-div">
      <List class="download-list" v-if="list.length">
        <ListItem v-for="(item, index) in list" :key="index">
          <ListItemMeta
            :title="item.file_name">
            <img class="file-icon" slot="avatar" :src="getFileicon(item)" alt="">
          </ListItemMeta>
          <template slot="action">
            <li>
              <Icon type="md-trash" style="font-size: 30px;" @click="fileDelete(item)" />
            </li>
          </template>
        </ListItem>
      </List>
    </div>

    <sm-field
      :field="{name: 'download', type: 'upload-file', width: '300px', height: '50px', 'on-change': downloadOk}"
      />
  </div>
</template>

<script>
import Util from '@/libs/util'

import doc from '@/assets/images/fileicons/doc.png';
import xls from '@/assets/images/fileicons/xls.png';
import pdf from '@/assets/images/fileicons/pdf.png';
import ppt from '@/assets/images/fileicons/ppt.png';
import zip from '@/assets/images/fileicons/zip.png';
import file from '@/assets/images/fileicons/file.png';

export default {
  name: 'download',
  props: {
    type: {
      default: 'business'
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
    }
  },
  watch: {
    itemId (value) {
      if (value) {
        this.getList();
      }
    }
  },
  methods: {
    onChange(is_download) {
      var _this = this

      Util.ajax({
        url: 'adminapi/downloads/setDownload',
        method: 'patch',
        data: {type: this.type, item_id: this.itemId, is_download: is_download},
        success: function(result) {
          if (result.error == 0) {
            _this.$Notice.success({ title: '提示', desc: '设置成功' });
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
    getFileicon(item) {
      if (Util.inArray(item.file_type, ['doc', 'docx'])) {
        return doc;
      } else if (Util.inArray(item.file_type, ['xls', 'xlsx', 'csv'])) {
        return xls;
      } else if (Util.inArray(item.file_type, ['ppt', 'pptx'])) {
        return ppt;
      } else if (Util.inArray(item.file_type, ['pdf'])) {
        return pdf;
      } else if (Util.inArray(item.file_type, ['zip', 'rar'])) {
        return zip;
      } else {
        return file;
      }

      return inArray
    },
    getList () {
      var _this = this;

      Util.ajax({
        url: 'adminapi/downloads',
        method: 'get',
        data: {type: this.type, item_id: this.itemId},
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
    downloadOk(info) {
      var _this = this;
      console.log(info);
      let download = {
        type: this.type,
        item_id: this.itemId,
        file_name: info.name,
        file_url: info.url,
        file_size: info.size
      }
      // 上传文件
      Util.ajax({
        url: 'adminapi/downloads',
        method: 'post',
        data: download,
        success: function(result) {
          if (result.error == 0) {
            _this.$Notice.success({
              title: '提示',
              desc: '上传成功'
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
    fileDelete (item) {
      var _this = this;

      _this.$Modal.confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk: function () {
          Util.ajax({
            url: 'adminapi/downloads/' + item.id,
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
    }
  },
  created () {
    if (this.itemId) {
      this.getList();
    }
  }
}


</script>


<style scoped>
.download-list {
  background-color: #FFFFFF;
  padding: 10px;
  width: 500px;
  margin-bottom: 20px;
}

.file-icon {
  width: 35px;
  height: 35px;
}
</style>
