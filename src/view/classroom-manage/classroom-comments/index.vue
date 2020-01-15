<template lang="html">
  <div class="classroom-comments-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" :noSearch="noSearch">
      <template slot="formItem" >
        <Form-item prop="classroom_id">
          <Select style="width:200px" v-model="listConf.searchParams.classroom_id" clearable placeholder="薪课堂" @on-change="selectClassroom">
            <Option v-for="(classroom, index) in classrooms" :key="index" :label="classroom.name" :value="classroom.id" ></Option>
          </Select>
        </Form-item>
        <Form-item prop="classroom_content_id">
          <Select style="width:200px" v-model="listConf.searchParams.classroom_content_id" clearable placeholder="薪课堂课时">
            <Option v-for="(classroomContent, index) in classroomContents" :key="index" :label="classroomContent.name" :value="classroomContent.id" ></Option>
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
            <div v-if="it.reply" style="margin: 20px 0 0 30px;padding: 10px;background: #f5f5f5;border-radius: 10px;">
              讲师回复：{{ it.reply.content }}
            </div>

            <template slot="extra"> 
              <span v-if="it.status == 1" style="color: #333333;">{{ it.status_msg ? '处理原因：' + it.status_msg + ' - ' : '' }}{{ it.status_name }}</span>
              <span v-if="it.status == -1" style="color: #ff0000;">{{ it.status_msg ? '处理原因：' + it.status_msg + ' - ' : '' }}{{ it.status_name }}</span>
              <Button type="primary" size="small" v-if="it.status == 0" @click="showStatus(it)">审核</Button>
            </template>

            <template slot="action">
              <li>
                点赞 {{ it.love_num }}
              </li>
              <li v-if="it.reply == null">
                <a type="text" style="color: #57a3f;" @click="showReply(it)"> 回复 </a>
              </li>
              <li>
                <Icon type="md-star" style="font-size: 18px" :style="qulityStyle(it.is_quality)" />
                <a v-if="it.is_quality" type="text" style="color: #57a3f;" @click="setQulity(it.id, 0)">取消精选</a>
                <a v-else type="text" style="color: #57a3f;" @click="setQulity(it.id, 1)">设为精选</a>
              </li>
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
      replyShow: false,
      saveLoading: false,
      replyInfo: '',
      replyForm: {
        id: 0,
        classroom_id: 0,
        classroom_content_id: 0,
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

      classrooms: [],
      classroomContents: [],
      noSearch: true,
      currentRow: {},
      teachers: [],
      tags: [],
      listConf: {
        url: '/adminapi/classroomComments',
        searchParams: {
          classroom_id: this.$route.params.classroom_id ? this.$route.params.classroom_id : 0,
          classroom_content_id: this.$route.params.classroom_content_id ? this.$route.params.classroom_content_id : 0,
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
          _this.classroomCommentDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    classroomCommentDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/classroomComments/' + id,
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
        url: '/adminapi/classroomComments/' + id + '/setQuality',
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
    selectClassroom (classroom_id) {
      this.getClassroomContents(classroom_id);
    },
    getClassrooms() {
      // 获取所有老师
      var _this = this;
      Util.ajax({
        url: '/adminapi/classrooms/all',
        method: 'get',
        success: function(result) {
          if (result.error == 0) {

            _this.classrooms = result.result;
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
    getClassroomContents(classroom_id) {
      // 获取所有老师
      var _this = this;
      Util.ajax({
        url: '/adminapi/classroomContents/all',
        method: 'get',
        data: {classroom_id: classroom_id},
        success: function(result) {
          if (result.error == 0) {
            _this.classroomContents = result.result;
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
      if (item.reply != null) {
        this.$Notice.error({
          title: '提示',
          desc: "当前留言已回复"
        });
        return false;
      }
      this.replyForm.id = item.id;
      this.replyForm.classroom_id = item.classroom_id;
      this.replyForm.classroom_content_id = item.classroom_content_id;
      this.replyInfo = item.content;
      this.replyShow = true;
    },
    cancel: function () {
      this.replyShow = false;
      this.replyForm.id = 0;
      this.replyForm.classroom_id = 0;
      this.replyForm.classroom_content_id = 0;
      this.replyForm.content = '';
      this.replyInfo = "";
    },
    ok: function () {
      var _this = this;
      _this.$refs['replyForm'].validate((valid) => {
        if (valid) {
          _this.saveLoading = true;
          Util.ajax({
            url: '/adminapi/classroomComments/'+ _this.replyForm.id +'/reply',
            method: 'post',
            data: {classroom_id: this.replyForm.classroom_id, classroom_content_id: this.replyForm.classroom_content_id, content: this.replyForm.content},
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
            url: '/adminapi/classroomComments/'+ _this.statusForm.id +'/statusOper',
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
    }
  },
  created: function () {
    var _this = this

    if (this.$route.params.classroom_id && this.$route.params.classroom_content_id) {
      this.noSearch = true
    } else {
      this.noSearch = false
      this.getClassrooms();
    }
  },
  mounted: function () {
  }
}
</script>

<style lang="css">
</style>
