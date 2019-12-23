export const {
  methods: {
    listInit: function (){
      var _this = this;

      _this.queryParams['page'] = 1;
      _this.queryParams['page_size'] = _this.cListConf['pageSize'];

      _this.listLoad();
    },
    listLoadData: function (cb) {         // 只获取数据
      var _this = this;
      _this.listBaseRequest(cb);
    },
    listLoad: function () {      // 加载列表
      var _this = this;

      if (_this.loading) {    // 如果正在加载，返回
          return;
      }

      _this.loading = true;
      _this.listBaseRequest(function(result){
        if (!result.error){
          _this.loading = false;
          var data = result.result;
          _this.total = data.total;
          if (data.current_page == 1) {
            _this.$emit('setTotal', data.total);
          }

          _this.current = data.current_page;

          _this.onePage = _this.total <= _this.cListConf.pageSize;

          _this.item = data.data;
        }
      })
    },
    listBaseRequest: function (cb) {      // ajax 请求
      var _this = this;

      Util.extend(_this.queryParams, _this.cListConf['searchParams']);
      Util.ajax({
        url: _this.cListConf['url'],
        data : _this.queryParams,
        method:'get',
        success: function (result){
          if (cb != undefined) {
            cb(result);
            return true;
          }else {
            return result;
          }
        }
      });
    },
    listSearch: function(){         // 上下页
      var _this = this;

      _this.queryParams['page'] = 1;
      _this.listLoad();
    },
    listSearchReset () {                // 表单数据重置, name ,表单数据
      var _this = this;
      this.$emit('searchReset', this.originSearchParams);
    },
    listChangePage: function(page){         // 上下页
      var _this = this;

      _this.queryParams['page'] = page;
      _this.listLoad();
    },
    listChangeSize: function(size){         // 每页条数
      var _this = this;

      _this.queryParams['page'] = 1;
      _this.queryParams['page_size'] = size;
      _this.listLoad();
    },
    listChangeSort: function (sort) {
      var _this = this;

      _this.queryParams['page'] = 1;
      _this.queryParams['sort'] = sort.key;
      _this.queryParams['order'] = sort.order;
      _this.listLoad();
    },
    listSelect: function(index){
      this.$emit('select', index);
    },
    listCheckboxChange (selected) {
      this.$emit('checkboxChange', selected)
    },
  }
}
