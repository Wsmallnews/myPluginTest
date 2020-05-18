<template lang="html">
  <div class="classroom-comments-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" :noSearch="noSearch">
      <template slot="formItem" >
        <Form-item prop="business_id">
          <Select style="width:200px" v-model="listConf.searchParams.business_id" clearable placeholder="薪商学">
            <Option v-for="(business, index) in businesss" :key="index" :label="business.name" :value="business.id" ></Option>
          </Select>
        </Form-item>
        <Form-item prop="status">
          <Select style="width:200px" v-model="listConf.searchParams.status" clearable placeholder="留言审核状态">
            <Option label="全部(留言)" value="all" ></Option>
            <Option label="未审核" :value="0" ></Option>
            <Option label="审核通过" :value="1" ></Option>
            <Option label="未过审" :value="-1" ></Option>
          </Select>
        </Form-item>
      </template>

      <template slot="list" slot-scope="{ item, loading}">
        <List v-if="loading || item.length > 0" item-layout="vertical" style="background: #FFFFFF;padding: 20px;border-radius: 10px;overflow: hidden;" :loading="loading">
          <ListItem  v-for="(it, index) in item" :key="index">
            <template v-if="it.user">
              <ListItemMeta :avatar="it.user.avatar" :title="it.user.name" :description="it.created_at"/>
            </template>

            {{ it.content }}

            <div v-if="it.image_arr.length">
              <img class="comment-img" v-for="(img, ix) in it.image_arr" :key="ix" :src="img" @click="showBigImg(img)" />
            </div>

            <div v-if="it.replies.length" style="margin: 20px 0 0 10px;padding: 10px;background: #f5f5f5;border-radius: 5px;">
              <template v-for="(e, d) in it.replies">
                <div class="reply-div" :key="d">
                  <p class="reply-list" :key="d">
                    <span class="reply-name" v-if="e.user">
                      {{e.user.name}}
                      <span v-if="e.reply_user" class="reply-name">
                        <span style="color: #515a6e;"> 回复 </span>
                        {{ e.reply_user.name }}</span></span>
                    ：{{ e.content }}
                    <Icon type="md-chatboxes" class="reply-reply" title="回复" @click="showReply(e)" />
                    <Icon type="md-trash" class="reply-delete" title="删除" @click="deleteConf(e.id)" />
                  </p>
                  <div v-if="e.image_arr.length" :key="d + 10000">
                    <img class="reply-img" v-for="(re, rex) in e.image_arr" :key="rex + 1000" :src="re" @click="showBigImg(re)" />
                  </div>
                  <div v-if="d < (it.replies.length - 1)" style="border-bottom: 1px dashed #ccc;"></div>
                </div>
              </template>
            </div>

            <template slot="extra">
              <span v-if="it.status == 1" style="color: #333333;">{{ it.status_msg ? '处理原因：' + it.status_msg + ' - ' : '' }}{{ it.status_name }}</span>
              <span v-if="it.status == -1" style="color: #ff0000;">{{ it.status_msg ? '处理原因：' + it.status_msg + ' - ' : '' }}{{ it.status_name }}</span>
            </template>

            <template slot="action">
              <li v-if="it.status == 0">
                <Button type="primary" size="small" @click="showStatus(it)">审核</Button>
              </li>
              <li>
                点赞 {{ it.love_num }}
              </li>
              <li>
                <a type="text" style="color: #57a3f;" @click="showReply(it)"> 回复 </a>
              </li>
              <!-- <li>
                <Icon type="md-star" style="font-size: 18px" :style="qulityStyle(it.is_quality)" />
                <a v-if="it.is_quality" type="text" style="color: #57a3f;" @click="setQulity(it.id, 0)">取消精选</a>
                <a v-else type="text" style="color: #57a3f;" @click="setQulity(it.id, 1)">设为精选</a>
              </li> -->
              <li>
                <a type="text" style="color: #57a3f;" @click="deleteConf(it.id)">删除</a>
              </li>
            </template>
          </ListItem>
        </List>
        <div v-if="!loading && item.length <= 0" style="padding: 20px; text-align: center;background: #FFFFFF;border-radius: 10px;" >还没有留言</div>
      </template>
    </myTable>

    <Modal v-model="replyShow" :closable='false' :mask-closable=false :width="600">
      <h3 slot="header" style="color:#2D8CF0">回复留言</h3>
      <h6 style="margin-bottom: 20px;">回复评论：{{ replyInfo }}</h6>
      <Form ref="replyForm" :model="replyForm" :label-width="100" label-position="right" :rules="replyValidate">
        <Form-item label="回复内容" prop="content">
          <Input v-model="replyForm.content" type="textarea" :autosize="{minRows: 6,maxRows: 6}" placeholder="请输入回复内容"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" :loading="saveLoading" @click="ok">回复</Button>
      </div>
    </Modal>

    <Modal v-model="statusShow" :closable='false' :mask-closable=false :width="400">
      <h3 slot="header" style="color:#2D8CF0">处理留言</h3>
      <!-- <h3 style="color: #ffad33;margin-bottom: 10px;">{{ statusInfo }}</h3> -->
      <Form ref="statusForm" :model="statusForm" :label-width="100" label-position="right" :rules="statusValidate">
        <Form-item label="处理备注" prop="status_msg">
          <Input v-model="statusForm.status_msg" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入处理备注"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="statusCancel">取消</Button>
        <Button type="warning" :loading="statusSaveLoading" @click="statusError">审核驳回</Button>
        <Button type="primary" :loading="statusSaveLoading" @click="statusOk">审核通过</Button>
      </div>
    </Modal>

    <Modal v-model="bigImgShow" :closable="true" :mask-closable="true" :footer-hide="true" :styles="{top: '20px'}" width="700">
      <img :src="bigImg" style="width: 670px;margin-top: 30px;" alt="">
    </Modal>
  </div>
</template>

<script>
import Util from '@/libs/util'
import myTable from '@/view/includes/myTable'

export default {
  components: {
    myTable
  },
  data () {
    return {
      bigImgShow: false,
      bigImg: '',
      replyShow: false,
      saveLoading: false,
      replyInfo: '',
      replyForm: {
        id: 0,
        business_id: 0,
        content: ''
      },
      replyValidate: {
        content: [
          { required: true, message: '请输入回复内容', trigger: 'blur' }
        ],
      },

      statusShow: false,
      statusSaveLoading: false,
      statusInfo: '',
      statusForm: {
        id: 0,
        status: 1,
        status_msg: ''
      },
      statusValidate: {
      },

      businesss: [],
      noSearch: true,
      currentRow: {},
      teachers: [],
      tags: [],
      listConf: {
        url: '/adminapi/businessComments',
        searchParams: {
          business_id: this.$route.params.business_id ? this.$route.params.business_id : 0,
          status: ''
        },
        item: []
      },
      deleteId: 0
    }
  },
  computed: {

  },
  methods: {
    selectRow: function (index) {
      this.currentRow = index
    },
    searchReset: function (originParams) {
      this.listConf.searchParams = Util.extend(this.listConf.searchParams, originParams)
    },
    jumpPage: function (path) {
      this.$router.push(path)
    },
    qulityStyle (is_quality) {
      if (is_quality) {
        return {
          color: '#f27613'
        }
      }
    },
    deleteConf: function (id) {
      var _this = this
      _this.$Modal.confirm({
        title: '提示',
        content: '确定删除吗？删除之后不可恢复!',
        onOk: function () {
          _this.businessCommentDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    businessCommentDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/businessComments/' + id,
        method: 'DELETE',
        success: function (result) {
          if (result.error == 0) {
            _this.$Notice.success({ title: '提示', desc: '删除成功' })
            _this.$refs.listTable.listLoad()
          } else {
            _this.$Notice.error({ title: '提示', desc: result.info })
          }
        }
      })
    },
    setQulity: function (id, is_quality) {
      var _this = this
      var msg = is_quality ? '确定设为精选吗？第一次设置精选将赠送优惠券' : '确定取消精选吗？';
      _this.$Modal.confirm({
        title: '提示',
        content: msg,
        onOk: function () {
          _this.qulity(id, is_quality)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' });
        }
      })
    },
    qulity (id, is_quality) {
      var _this = this
      Util.ajax({
        url: '/adminapi/businessComments/' + id + '/setQuality',
        method: 'patch',
        data: {is_quality: is_quality},
        success: function (result) {
          if (result.error == 0) {
            _this.$Notice.success({ title: '提示', desc: '设置成功' })
            _this.$refs.listTable.listLoad()
          } else {
            _this.$Notice.error({ title: '提示', desc: result.info })
          }
        }
      })
    },
    getBusiness() {
      // 获取所有老师
      var _this = this;
      Util.ajax({
        url: '/adminapi/business/all',
        method: 'get',
        success: function(result) {
          if (result.error == 0) {

            _this.businesss = result.result;
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
    showReply (item) {
      // if (item.reply != null) {
      //   this.$Notice.error({
      //     title: '提示',
      //     desc: "当前留言已回复"
      //   });
      //   return false;
      // }
      this.replyForm.id = item.id;
      this.replyForm.business_id = item.business_id;
      this.replyInfo = item.content;
      this.replyShow = true;
    },
    cancel: function () {
      this.replyShow = false;
      this.replyForm.id = 0;
      this.replyForm.business_id = 0;
      this.replyForm.content = '';
      this.replyInfo = "";
    },
    ok: function () {
      var _this = this;
      _this.$refs['replyForm'].validate((valid) => {
        if (valid) {
          _this.saveLoading = true;
          Util.ajax({
            url: '/adminapi/businessComments/'+ _this.replyForm.id +'/reply',
            method: 'post',
            data: {business_id: this.replyForm.business_id, content: this.replyForm.content},
            success: function(result) {
              _this.saveLoading = false;
              if (result.error == 0) {
                _this.$Notice.success({
                  title: '提示',
                  desc: "回复成功"
                });
                _this.cancel();
                _this.$refs.listTable.listLoad();
              } else {
                _this.$Notice.error({
                  title: '提示',
                  desc: result.info
                });
              }
            }
          })
        }
      });
    },
    showStatus (item) {
      if (item.status != 0) {
        this.$Notice.error({
          title: '提示',
          desc: "当前留言已处理，请不要重复处理"
        });
        return false;
      }
      this.statusForm.id = item.id;
      this.statusInfo = "正在处理";
      this.statusShow = true;
    },
    statusCancel: function () {
      this.statusShow = false;
      this.statusForm.status = 0;
      this.statusForm.status_msg = "";
      this.statusInfo = "";
    },
    statusOk () {
      this.statusForm.status = 1;
      this.statusOper();
    },
    statusError () {
      this.statusForm.status = -1;
      this.statusOper();
    },
    statusOper: function () {
      var _this = this;
      _this.$refs['statusForm'].validate((valid) => {
        if (valid) {
          _this.statusSaveLoading = true;
          Util.ajax({
            url: '/adminapi/businessComments/'+ _this.statusForm.id +'/statusOper',
            method: 'patch',
            data: {status: this.statusForm.status, status_msg: this.statusForm.status_msg},
            success: function(result) {
              _this.statusSaveLoading = false;
              if (result.error == 0) {
                _this.$Notice.success({
                  title: '提示',
                  desc: "处理成功"
                });
                _this.statusCancel();
                _this.$refs.listTable.listLoad();
              } else {
                _this.$Notice.error({
                  title: '提示',
                  desc: result.info
                });
              }
            }
          })
        }
      });
    },
    showBigImg (src) {
      this.bigImg = src;
      this.bigImgShow = true;
    },
  },
  created: function () {
    var _this = this

    if (this.$route.params.business_id) {
      this.noSearch = true
    } else {
      this.noSearch = false
      this.getBusiness();
    }
  },
  mounted: function () {
  }
}
</script>

<style lang="css">
.reply-list {
  line-height: 25px;
  position: relative;
}

.reply-name {
  color: #57a3f3;
}

.reply-reply {
  position: absolute;
  right: 23px;
  top: 4px;
  font-size: 18px;
  color: #cccccc;
}

.reply-delete {
  position: absolute;
  right: 0px;
  top: 3px;
  font-size: 18px;
  color: #cccccc;
}
.comment-img {
  width: 50px;
  margin: 5px;
}
.reply-img {
  width: 30px;
  margin: 2px;
}
</style>
