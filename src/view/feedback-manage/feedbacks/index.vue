<template lang="html">
  <div class="admin-logs-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
      <template slot="formItem">
        <Form-item prop="user_name">
          <Input type="text" v-model="listConf.searchParams.user_name" placeholder="搜索用户名"></Input>
        </Form-item>
        <Form-item prop="desc">
          <Input type="text" v-model="listConf.searchParams.desc" placeholder="反馈内容"></Input>
        </Form-item>
        <Form-item prop="status">
          <Select v-model="listConf.searchParams.status" placeholder="处理状态">
            <Option value="all" key="all">全部</Option>
            <Option :value="0" :key="0">未处理</Option>
            <Option :value="1" :key="1">已处理</Option>
          </Select>
        </Form-item>
      </template>
    </myTable>

    <Modal v-model="feedbackShow" :closable='false' :mask-closable=false :width="400">
      <h3 slot="header" style="color:#2D8CF0">处理</h3>
      <Form ref="feedbackForm" :model="feedbackForm" :label-width="100" label-position="right" :rules="passwordValidate">
        <Form-item label="处理备注" prop="note">
          <Input v-model="feedbackForm.note" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入处理备注"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelFeedback">取消</Button>
        <Button type="primary" :loading="saveLoading" @click="saveFeedback">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Util from '@/libs/util';
  import myTable from '@/view/includes/myTable';

  export default {
    components: {
      myTable
    },
    data () {
      return {
        feedbackShow: false,
        feedbackForm: {
          id: 0,
          note: ''
        },
        currentRow:{},
        typeAll: [],
        orderStatusAll: [],
        listConf: {
          url: "/adminapi/feedbacks",
          searchParams: {
          },
          item: [],
          columns: [
            {type: 'index', align: 'center', width:100, fixed: 'left'},
            {title: '用户名', align: 'center', width: 100, key: 'user_name', render:(h, params)=>{
              return params.row.user ? h('span', params.row.user.name) : h('span', '');
            }},
            {title: '联系姓名', align: 'center', width: 100, key: 'name'},
            {title: '联系电话', align: 'center', width: 110, key: 'phone'},
            {title: '联系微信', align: 'center', width: 100, key: 'wechat'},
            {title: '反馈内容', align: 'center', minWidth: 250, key: 'desc'},
            {title: '处理状态', align: 'center', width: 100, key: 'status_name'},
            {title: '处理备注', align: 'center', minWidth: 250, key: 'note'},
            {title: '反馈时间', align: 'center', width: 180, key: 'created_at'},
            {title: '处理时间', align: 'center', width: 180, key: 'updated_at'},
            {title: '操作',
              key: 'action',
              align: 'center',
              width: 80,
              fixed: 'right',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'md-build'
                    },
                    style: {
                      marginRight: '5px',
                      marginBottom: '5px'
                    },
                    on: {
                      click: () => {
                        var id = params.row.id
                        this.feedbackForm.id = id;
                        this.showFeedback();
                      }
                    }
                  })
                ])
              }
            }
          ]
        }
      }
    },
    methods: {
      selectRow: function(index){
        this.currentRow = index;
      },
      searchReset: function (originParams) {
        this.listConf.searchParams = Util.extend(this.listConf.searchParams, originParams);
      },
      jumpPage: function (path) {
        this.$router.push(path);
      },
      showFeedback () {
        this.feedbackShow = true;
      },
      cancelFeedback: function () {
        this.feedbackShow = false;
        this.feedbackForm.id = 0;
        this.feedbackForm.note = "";
      },
      saveFeedback: function () {
        var _this = this;
        _this.$refs['feedbackForm'].validate((valid) => {
          if (valid) {
            if (!_this.feedbackForm.id) {
              _this.$Notice.error({
                title: '提示',
                desc: "参数错误，请重试"
              });
              return false;
            }
            _this.saveLoading = true;
            Util.ajax({
              url: '/adminapi/feedbacks/'+ _this.feedbackForm.id +'/setStatus',
              method: 'patch',
              data: _this.feedbackForm,
              success: function(result) {
                _this.saveLoading = false;
                if (result.error == 0) {
                  _this.$Notice.success({
                    title: '提示',
                    desc: "处理成功"
                  });
                  _this.cancelFeedback();
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
    },
    mounted: function (){
    },
  }
</script>

<style lang="css">
</style>
