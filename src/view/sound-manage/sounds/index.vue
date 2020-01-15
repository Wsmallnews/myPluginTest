<template lang="html">
  <div class="sounds-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索薪声标题" ></Input>
        </Form-item>

        <Form-item prop="author_id">
          <Select style="width:200px" v-model="listConf.searchParams.author_id" clearable placeholder="作者">
            <Option v-for="(author, index) in authors" :key="index" :label="author.name" :value="author.id" ></Option>
          </Select>
        </Form-item>
        <Form-item prop="tag">
          <Select style="width:200px" v-model="listConf.searchParams.tag" clearable placeholder="标签">
            <Option v-for="(tag, index) in tags" :key="index" :label="tag.name" :value="tag.name" ></Option>
          </Select>
        </Form-item>
      </template>
      <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/soundManage/add' })"><Icon type="plus-round"></Icon>薪声添加</Button>
      </template>

      <template slot="list" slot-scope="{ item, loading}">
        <List v-if="loading || item.length > 0" item-layout="vertical" style="background: #FFFFFF;padding: 20px;border-radius: 10px;overflow: hidden;" :loading="loading">
          <ListItem v-for="(it, index) in item" :key="index">
            <template v-if="it.author">
              <ListItemMeta :avatar="it.author.avatar" :title="it.author.name" :description="it.created_at" />
            </template>

            {{ it.name }}
            <div class="tags" v-if="it.tag_arr.length">
              <div style="padding: 5px;"></div>
              <Tag
                v-for="(ie, ind) in it.tag_arr"
                :key="ind"
                :checkable="false"
                :checked="false"
                type="border"
                size="medium"
                color="primary"
                >
                {{ ie }}
              </Tag>
            </div>
            <template slot="action">
              <li>
                阅读 {{ it.view_num }}
              </li>
              <li>
                点赞 {{ it.love_num }}
              </li>
              <li>
                <a type="text" style="color: #57a3f;" @click="jumpPage({ path: '/soundManage/soundComments/' + it.id })">查看留言</a>
              </li>
              <li>
                <Icon type="md-star" style="font-size: 18px" :style="recommendStyle(it.is_recommend)" />
                <a v-if="it.is_recommend" type="text" style="color: #57a3f;" @click="recommendConf(it.id, 0)">取消推荐</a>
                <a v-else type="text" style="color: #57a3f;" @click="recommendConf(it.id, 1)">设为推荐</a>
              </li>
              <li>
                <a type="text" style="color: #57a3f;" @click="() => {detail = it; showDetail = true;}">详情</a>
              </li>
              <li>
                <a type="text" style="color: #57a3f;" @click="jumpPage({ path: '/soundManage/edit/' + it.id })">编辑</a>
              </li>
              <li>
                <a type="text" style="color: #57a3f;" @click="deleteConf(it.id)">删除</a>
              </li>
            </template>
          </ListItem>
        </List>
        <div v-if="!loading && item.length <= 0" style="padding: 20px; text-align: center;background: #FFFFFF;border-radius: 10px;" >还没有发布薪声</div>
      </template>
    </myTable>

    <Modal v-model="showDetail" :closable="true" :mask-closable=false :width="700">
      <h3 slot="header" style="color:#2D8CF0">薪声详情</h3>
      <div v-if="detail.name">
        <Row >
          <Col span="6" class="row-label">薪声名称：</Col>
          <Col span="18" class="row-content">{{ detail.name }}</Col>
        </Row>
        <Row v-if="detail.image">
          <Col span="6" class="row-label">薪声图片：</Col>
          <Col span="18" class="row-content">
            <img class="detail-images" style="width: 125px;height: 50px;" :src="detail.image" @click="showBigImg(detail.image)" />
          </Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">标签：</Col>
          <Col span="18" class="row-content">
            <Tag
                v-for="(item, ind) in detail.tag_arr"
                :key="ind"
                :checkable="false"
                :checked="false"
                type="border"
                size="medium"
                color="primary"
                >
                {{ item }}
              </Tag>
          </Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">作者：</Col>
          <Col span="18" class="row-content">
            <span v-if="detail.author">
              {{ detail.author.name }}({{detail.author.phone}})
            </span>
          </Col>
        </Row>
       
        <Row>
          <Col span="6" class="row-label">浏览量：</Col>
          <Col span="18" class="row-content">{{ detail.view_num }}</Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">点赞量：</Col>
          <Col span="18" class="row-content">{{ detail.love_num }}</Col>
        </Row>

        <Row>
          <Col span="6" class="row-label">推荐状态：</Col>
          <Col span="18" class="row-content">
            <span v-if="detail.is_recommend == 1">
              推荐
            </span>
            <span v-else>
              未推荐
            </span>
          </Col>
        </Row>
        <Row>
          <Col span="6" class="row-label">创建时间：</Col>
          <Col span="18" class="row-content">{{ detail.created_at }}</Col>
        </Row>

        <Row>
          <Col span="6" class="row-label">详情：</Col>
          <Col span="18" class="row-content" style="max-height: 300px;overflow-y:auto;" v-html="detail.content"></Col>
        </Row>
      </div>
    </Modal>

    <Modal v-model="bigImgShow" :closable="true" :mask-closable="true" :footer-hide="true" width="700">
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
      detail: {},
      showDetail: false,
      bigImgShow: false,
      bigImg: '',
      currentRow: {},
      authors: [],
      tags: [],
      listConf: {
        url: '/adminapi/sounds',
        searchParams: {
          name: '',
          author_id: 0,
          tag: ''
        },
        item: []
      },
      deleteId: 0
    }
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
    recommendStyle (is_recommend) {
      if (is_recommend) {
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
          _this.soundDel(id)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    soundDel (id) {
      var _this = this
      Util.ajax({
        url: '/adminapi/sounds/' + id,
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
    recommendConf: function (id, is_recommend) {
      var _this = this
      var msg = is_recommend ? '确定设为推荐吗？' : '确定取消推荐吗？';
      _this.$Modal.confirm({
        title: '提示',
        content: msg,
        onOk: function () {
          _this.setRecommend(id, is_recommend)
        },
        onCancel: function () {
          _this.$Notice.error({ title: '提示', desc: '操作取消' })
        }
      })
    },
    setRecommend (id, is_recommend) {
      var _this = this

      Util.ajax({
        url: '/adminapi/sounds/' + id + '/setRecommend',
        method: 'patch',
        data: {is_recommend: is_recommend},
        success: function (result) {
          if (result.error == 0) {
            _this.$Notice.success({title: '提示', desc: '操作成功'})
            _this.$refs.listTable.listLoad()
          } else {
            _this.$Notice.error({title: '提示', desc: result.info})
          }
        }
      })
    },
    getTeachers() {
      // 获取所有老师
      var _this = this;
      Util.ajax({
        url: '/adminapi/users/indexTeachAll',
        method: 'get',
        success: function(result) {
          if (result.error == 0) {

            _this.authors = result.result;
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
    getTags() {
      var _this = this;
      // 获取所有标签
      Util.ajax({
        url: '/adminapi/tags/all',
        method: 'get',
        data: {type: 'sound'},
        success: function(result) {
          if (result.error == 0) {
            _this.tags = result.result;
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
    showBigImg (src) {
      this.bigImg = src;
      this.bigImgShow = true;
    }
  },
  created: function () {
    var _this = this

    this.getTeachers();
    this.getTags();
  },
  mounted: function () {
  }
}
</script>

<style scoped>
.ivu-row {
  padding: 10px;
}
.row-label {
  text-align: right;
  padding-right: 10px;
}

.row-content {
  text-align: left;
  padding-left: 10px;
}
.detail-images {
  width: 80px;
  height: 80px;
  margin-right: 10px;
}
</style>
