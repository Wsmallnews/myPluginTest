<template lang="html">
  <div class="sound-comments-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" :noSearch="true">
      <template slot="list" slot-scope="{ item, loading}">
        <List v-if="loading || item.length > 0" item-layout="vertical" style="background: #FFFFFF;padding: 20px;border-radius: 10px;overflow: hidden;" :loading="loading">
          <ListItem  v-for="(it, index) in item" :key="index">
            <template v-if="it.user">
              <ListItemMeta :avatar="it.user.avatar" :title="it.user.name" :description="it.created_at"/>
            </template>

            {{ it.content }}
            <div v-if="it.reply" style="margin: 20px 0 0 30px;padding: 10px;background: #f5f5f5;border-radius: 10px;">
              作者回复：{{ it.reply.content }}
            </div>
            <template slot="action">
              <li>
                喜欢 {{ it.love_num }}
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
      noSearch: true,
      currentRow: {},
      teachers: [],
      tags: [],
      listConf: {
        url: '/adminapi/soundComments',
        searchParams: {
          sound_id: this.$route.params.sound_id,
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
          _this.soundCommentDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    soundCommentDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/soundComments/' + id,
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
        url: '/adminapi/soundComments/' + id + '/setQuality',
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
    }
  },
  created: function () {
    var _this = this
  },
  mounted: function () {
  }
}
</script>

<style lang="css">
</style>
