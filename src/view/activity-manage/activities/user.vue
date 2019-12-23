<template lang="html">
  <div class="activity-user-index">
    <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" >
      <template slot="formItem" >
        <Form-item prop="name">
          <Select style="width:200px" v-model="listConf.searchParams.join_type" placeholder="报名类型">
            <Option label="全部" value="all" ></Option>
            <Option label="线下报名" value="offline" ></Option>
            <Option label="线上报名" value="online" ></Option>
          </Select>
        </Form-item>
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
      currentRow: {},
      listConf: {
        url: '/adminapi/activityUsers',
        searchParams: {
          activity_id: this.$route.params.id,
          join_type: 'all',
        },
        item: [],
        columns: [
          {type: 'index', align: 'center', width: 100, fixed: 'left'},
          {title: '报名用户', align: 'center', key: 'max_num',
            render: (h, params) => {
              if (params.row.user != null) {
                return h('span', params.row.user.name)
              }
            }},
          {title: '手机号', align: 'center', width: 150, key: 'max_num',
            render: (h, params) => {
              if (params.row.user != null) {
                return h('span', params.row.user.phone)
              }
            }},
          {title: '性别', align: 'center', width: 80, key: 'sex_name',
            render: (h, params) => {
              if (params.row.user != null) {
                return h('span', params.row.user.sex_name)
              }
            }},
          {title: '是否vip', align: 'center', width: 80, key: 'is_vip',
            render: (h, params) => {
              if (params.row.user != null) {
                return h('span', params.row.user.is_vip_name)
              }
            }},
          {title: '是否签到', align: 'center', width: 120, key: 'is_sign_name'},
          {title: '签到时间', align: 'center', width: 200, key: 'sign_at'},
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
