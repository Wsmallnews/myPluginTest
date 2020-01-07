<template lang="html">
  <div class="classroom-teach-comments-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" @setTotal="(total) => {totalComment = total}" @startSearch="() => {getCommentStatic()}" :noSearch="noSearch" >
      <template slot="formItem" >
        <Form-item prop="classroom_content_id">
          <Select style="width:200px" v-model="listConf.searchParams.classroom_content_id" clearable placeholder="薪课堂课时">
            <Option v-for="(classroomContent, index) in classroomContents" :key="index" :label="classroomContent.name" :value="classroomContent.id" ></Option>
          </Select>
        </Form-item>
      </template>

      <template slot="other">
        <div v-if="statics.length" style="width: 100%;background: #FFFFFF;padding: 20px;margin-bottom: 20px;border-radius: 10px;">
        <Alert type="info">共 {{ totalComment }} 人参与了评论</Alert>
          <div v-for="(stat, index) in statics">
            <h3>{{ index + 1 }}）{{ stat.subject_title }} {{ stat.total }} 人参与评论</h3>
            <div style="height: 30px;line-height: 30px;">
              <div style="float: left; width: 100px;">A、{{ stat.option_a }} </div>
              <div style="float: left; width: 400px;">
                <Progress :percent="((stat.option_a_total / stat.total) * 100)" active :stroke-width="20" text-inside ></Progress>
              </div>
              <div style="clear:both;"></div>
            </div>
            <div style="height: 30px;line-height: 30px;">
              <div style="float: left; width: 100px;">B、{{ stat.option_b }} </div>
              <div style="float: left; width: 400px;">
                <Progress :percent="((stat.option_b_total / stat.total) * 100)" active :stroke-width="20" text-inside ></Progress>
              </div>
              <div style="clear:both;"></div>
            </div>
            <div style="height: 30px;line-height: 30px;" >
              <div style="float: left; width: 100px;">C、{{ stat.option_c }} </div>
              <div style="float: left; width: 400px;">
                <Progress :percent="((stat.option_c_total / stat.total) * 100)" active :stroke-width="20" text-inside ></Progress>
              </div>
              <div style="clear:both;"></div>
            </div>
            <div style="height: 5px;"></div>
          </div>
        </div>
      </template>

      <template slot="list" slot-scope="{ item, loading}">
        <List v-if="loading || item.length > 0" item-layout="vertical" style="background: #FFFFFF;padding: 20px;border-radius: 10px;overflow: hidden;" :loading="loading">
          <ListItem  v-for="(it, index) in item" :key="index">
            <template v-if="it.user">
              <ListItemMeta :avatar="it.user.avatar" :title="it.user.name" :description="it.created_at"/>
            </template>

            {{ it.content }}
            <template slot="action">
              <li>
                <a type="text" style="color: #57a3f;" @click="deleteConf(it.id)">删除</a>
              </li>
            </template>
          </ListItem>
        </List>
        <div v-if="!loading && item.length <= 0" style="padding: 20px; text-align: center;background: #FFFFFF;border-radius: 10px;" >还没有评价</div>
      </template>
    </myTable>
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
      statics: [],
      totalComment: 0,
      classroomContents: [],
      noSearch: true,
      currentRow: {},
      teachers: [],
      tags: [],
      listConf: {
        url: '/adminapi/classroomTeachComments',
        searchParams: {
          classroom_id: this.$route.params.classroom_id ? this.$route.params.classroom_id : 0,
          classroom_content_id: this.$route.params.classroom_content_id ? this.$route.params.classroom_content_id : 0
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
    deleteConf: function (id) {
      var _this = this
      _this.$Modal.confirm({
        title: '提示',
        content: '确定删除吗？删除之后不可恢复!',
        onOk: function () {
          _this.classroomTeachCommentDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    classroomTeachCommentDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/classroomTeachComments/' + id,
        method: 'DELETE',
        success: function (result) {
          if (result.error == 0) {
            _this.$Notice.success({ title: '提示', desc: '删除成功' })
            _this.$refs.listTable.listLoad()
            _this.getCommentStatic();
          } else {
            _this.$Notice.error({ title: '提示', desc: result.info })
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
    getCommentStatic() {
      // 获取所有老师
      var _this = this;
      Util.ajax({
        url: '/adminapi/classroomTeachComments/commentStatic',
        method: 'get',
        data: this.listConf.searchParams,
        success: function(result) {
          if (result.error == 0) {
            _this.statics = result.result;
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
  },
  created: function () {
    var _this = this

    if (this.$route.params.classroom_content_id) {
      this.noSearch = true
    } else {
      this.noSearch = false
      this.getClassroomContents(this.$route.params.classroom_id);
    }

    _this.getCommentStatic();
  },
  mounted: function () {
  }
}
</script>

<style lang="css">
</style>
