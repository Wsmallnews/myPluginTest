<template lang="html">
  <div class="partners-wallets-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" :no-search="true">
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
      currentRow: {},
      categorys: [],
      listConf: {
        url: '/adminapi/partnerWalletLogs',
        searchParams: {
          user_id: this.$route.params.user_id
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '用户名', align: 'center', key: 'user_name', render: (h, params) => {
            return h('span', params.row.user != null ? params.row.user.name : '');
          }},
          {title: '金额', align: 'center', key: 'money'},
          {title: '交易类型', align: 'center', key: 'type_name'},
          {title: '状态', align: 'center', key: 'add_name'},
          {title: '添加时间', align: 'center', key: 'created_at'},
        ]
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
