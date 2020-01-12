<template lang="html">
  <div class="business-user-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" :noSearch="true">

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
      listConf: {
        url: '/adminapi/businessUsers',
        searchParams: {
          business_id: this.$route.params.id,
          join_type: 'all',
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '报名用户', align: 'center', minWidth: 120, key: 'max_num',
            render: (h, params) => {
              if (params.row.user != null) {
                return h('span', params.row.user.name)
              }
            }},
          {title: '手机号', align: 'center', minWidth: 150, key: 'max_num',
            render: (h, params) => {
              if (params.row.user != null) {
                return h('span', params.row.user.phone)
              }
            }},
          {title: '性别', align: 'center', width: 120, key: 'sex_name',
            render: (h, params) => {
              if (params.row.user != null) {
                return h('span', params.row.user.sex_name)
              }
            }},
          {title: '是否vip', align: 'center', width: 80, key: 'is_vip_name'},
          {title: '过期时间', align: 'center', width: 200, key: 'expired_at'},
          {title: '报名时间', align: 'center', width: 200, key: 'created_at'},
        ]
      }
    }
  },
  methods: {
    selectRow: function (index) {
      this.currentRow = index
    },
    searchReset: function (originParams) {
      this.listConf.searchParams = Util.extend(this.listConf.searchParams, originParams)
    },
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
