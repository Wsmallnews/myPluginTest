<template>
  <div>
    欢迎来到游隼回收
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Util from '@/libs/util';

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
  },
  data() {
    return {
      inforCardData: [],
      achievementData: {},
      reimburData: {}
    }
  },
  created () {
    var _this = this;

  },
  mounted() {
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
