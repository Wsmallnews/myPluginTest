<template lang="html">
  <div class="gift-logs-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
      <template slot="formItem">
        <Form-item prop="type">
          <Select v-model="listConf.searchParams.type" placeholder="兑换类型">
            <Option value="business" key="business">薪商学</Option>
            <Option value="classroom" key="classroom">薪课堂</Option>
          </Select>
        </Form-item>

        <Form-item prop="item_id">
          <Input type="text" v-model="listConf.searchParams.item_id" placeholder="课程 ID"></Input>
        </Form-item>
        <Form-item prop="item_name">
          <Input type="text" v-model="listConf.searchParams.item_name" placeholder="课程名称"></Input>
        </Form-item>
        
        <Form-Item prop="created_at">
          <sm-field
            v-model="listConf.searchParams.created_at"
            :field="{type: 'datetimerange', placeholder: '生成时间'}"
            />
        </Form-item>
      </template>

      <template slot="formBtn" >
        <Button type="primary" @click="jumpPage({ path: '/giftLogManage/add' })"><Icon type="plus-round"></Icon>生成兑换码</Button>
        <Button type="primary" @click="setInvalid"><Icon type="plus-round"></Icon>设为失效</Button>
      </template>
    </myTable>
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
        currentRow:{},
        listConf: {
          url: "/adminapi/giftLogs",
          searchParams: {
            type: "",
            item_id: "",
            item_name: "",
            created_at: []
          },
          item: [],
          columns: [
            {type: 'index', align: 'center', width:100, fixed: 'left'},
            {title: '兑换类型', align: 'center', width: 100, key: 'type_name'},
            {title: '课程ID', align: 'center', width: 80, key: 'item_id'},
            {title: '课程名称', align: 'center', width: 170, key: 'item_name'},
            {title: '兑换码数量', align: 'center', width: 100, key: 'num'},
            {title: '已兑换数量', align: 'center', width: 100, key: 'receive_num'},
            {title: '生成时间', align: 'center', width: 150, key: 'created_at'},
            {title: '失效时间', align: 'center', width: 150, key: 'invalid_at', render: (h, params) => {
              return params.row.invalid_at == null ? h('span', '未失效') : h('span', params.row.invalid_at);
            }},
            {title: '备注', align: 'center', minWidth: 180, key: 'remark'},
            {title: '操作',
              key: 'action',
              align: 'center',
              width: 80,
              fixed: 'right',
              render: (h, params) => {
                let btn = [];
                btn.push(
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'md-list-box'
                    },
                    domProps: {
                      title: '查看兑换码列表',
                    },
                    style: {
                      marginRight: '5px',
                      marginBottom: '5px'
                    },
                    on: {
                      click: () => {
                        var id = params.row.id
                        this.jumpPage('/giftLogManage/userGift/' + id)
                      }
                    }
                  }),
                );

                return h('div', btn)
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
      setInvalid () {
        var _this = this;
        if (!this.currentRow.id) {
          this.$Notice.error({
            title: '提示',
            desc: "请先选择一条记录"
          });
          return false;
        }

        if (this.currentRow.invalid_at != null) {
          this.$Notice.error({
            title: '提示',
            desc: "当前记录已失效，不需要重复设置"
          });
          return false;
        }

        this.$Modal.confirm({
          title: '提示',
          content: '确定要将记录设为失效吗？',
          onOk: function () {
            Util.ajax({
              url: '/adminapi/giftLogs/'+ _this.currentRow.id +'/invalid',
              method: 'patch',
              success: function(result) {
                if (result.error == 0) {
                  _this.$Notice.success({
                    title: '提示',
                    desc: "处理成功"
                  });
                  _this.$refs.listTable.listLoad();
                } else {
                  _this.$Notice.error({
                    title: '提示',
                    desc: result.info
                  });
                }
              }
            })
          },
          onCancel: function () {
            _this.$Notice.error({ title: '提示', desc: '操作取消' })
          }
        })
      },
    },
    created: function () {
      var _this = this;
    },
    mounted: function (){
    },
  }
</script>

<style lang="css">
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
