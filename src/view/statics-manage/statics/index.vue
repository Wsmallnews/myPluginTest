<template lang="html">
  <div class="statics-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
      <template slot="formItem">
        <Form-item prop="type">
          <Select v-model="listConf.searchParams.type" placeholder="搜索类型">
            <Option value="all" key="all">全部类型</Option>
            <Option value="activity" :key="0">薪活动</Option>
            <Option value="business" :key="1">薪商学</Option>
            <Option value="classroom" :key="-1">薪课堂</Option>
          </Select>
        </Form-item>
        <Form-item prop="name">
          <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索活动/商学/课堂名称"></Input>
        </Form-item>
        <Form-item prop="teach_name">
          <Input type="text" v-model="listConf.searchParams.teach_name" placeholder="搜索讲师姓名"></Input>
        </Form-item>
        <Form-item prop="teach_id">
          <Input type="text" v-model="listConf.searchParams.teach_id" placeholder="搜索讲师 ID"></Input>
        </Form-item>
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
          url: "/adminapi/statics",
          searchParams: {
            type: "",
            name: "",
            teach_id: "",
            teach_name: ""
          },
          item: [],
          columns: [
            {type: 'index', align: 'center', width:100, fixed: 'left'},
            {title: '类型', align: 'center', width: 100, key: 'type_name'},
            {title: '名称', align: 'center', width: 170, key: 'name'},
            {title: '讲师姓名', align: 'center', width: 100, key: 'teach_name'},
            {title: '讲师 ID', align: 'center', width: 80, key: 'teach_id'},
            {title: 'VIP 线下报名收入', align: 'center', width: 135, key: 'offline_vip_money_total_format', render:(h, params)=>{
              return (params.row.type == 'activity' || params.row.type == 'total') ? h('span', params.row.offline_vip_money_total) : h('span', '--');
            }},
            {title: 'VIP 订阅直播收入', align: 'center', width: 135, key: 'vip_money_total'},
            {title: '普通会员线下收入', align: 'center', width: 135, key: 'offline_general_money_total_format', render:(h, params)=>{
              return (params.row.type == 'activity' || params.row.type == 'total') ? h('span', params.row.offline_general_money_total) : h('span', '--');
            }},
            {title: '普通会员订阅直播收入', align: 'center', width: 140, key: 'general_money_total'},
            {title: '优惠券减免金额', align: 'center', width: 120, key: 'coupon_money_total'},
            {title: '合计收入', align: 'center', width: 120, key: 'total'},
            {title: '讲师分成', align: 'center', width: 120, key: 'teach_money_total'},
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
