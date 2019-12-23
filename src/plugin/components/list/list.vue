<template>
  <div class="table-index">
    <Form ref="search" inline v-if="!noSearch">
      <slot name="formItem" >

      </slot>

      <Form-item>
        <Button type="primary" icon="ios-search" @click="listSearch()">搜索</Button>
        <Button @click="listSearchReset()" style="margin-left: 8px">重置</Button>
      </Form-item>
    </Form>

    <div class="oper-div">
      <!-- 操作数据，添加等 -->
      <div class="oper-data">
        <slot name="formBtn">

        </slot>
      </div>

      <div class="oper-table">
        <!-- 操作表格 设置列导出等 -->
        <Dropdown trigger="click" transfer-class-name="menu-down">
          <Tooltip content="导出" placement="top">
            <Button type="primary" class="oper-table-btn" icon="md-download"></Button>
          </Tooltip>
          <template slot="list">
            <Button type="text" icon="md-download" :loading="exportLoading" @click="exportData(0)">导出当前页</Button>
            <Button type="text" icon="md-download" :loading="exportLoading" @click="exportData(1)">导出全部</Button>
          </template>
        </Dropdown>

        <Dropdown trigger="click" transfer-class-name="menu-columns" placement="bottom-end">
          <Tooltip content="设置列" placement="top-end">
            <Button type="primary" class="oper-table-btn" icon="md-cog"></Button>
          </Tooltip>
          <template slot="list">
            <CheckboxGroup v-model="checkedColumns" >
              <Checkbox v-for="(column, index) in setColumns" :key="index" :label="column.label" >{{ column.title }}</Checkbox>
            </CheckboxGroup>
          </template>
        </Dropdown>
      </div>
      <div class="clear"></div>
    </div>

    <Table
      ref="table"
      :row-class-name="rowClassName"
      :loading="loading"
      :highlight-row="lighlightRow"
      :border="border"
      :stripe="stripe"
      :columns="currentColumns"
      :height="height"
      :max-height="maxHeight"
      :data="item"
      @on-row-click="listSelect"
      @on-sort-change="listChangeSort"
      @on-selection-change="listCheckboxChange"
      >

      <!-- slot 自定义 columns 样式，自动解析 columns 中带 slot 字段的列，动态设置 slot; 也可以直接在 table columns 写 render 函数 -->
      <template v-for="columns in slotColumns" slot-scope="{ row, index }" :slot="columns.column">
        <template v-if="columns.editable">
          <!-- 如果是可编辑 columns -->
          <Input type="text" v-model="editColumnsForm[columns.column]" v-if="editIndex === index" />



          <span v-else>{{ row[columns.column] }}</span>
        </template>
        <template v-else>
          <!-- 不可编辑 columns，可在调用页面 传入该字段的 slot, 同样回传 slot-scope -->
          <slot :name="columns.column" :row="row" :index="index">
            <template v-if="columns.column_type == 'image'">
              <img
                :src="row[columns.column]"
                class="slot-image"
                @click="showImg = true;currentShowImg = row[columns.column];"
                />
            </template>
            <template v-else-if="columns.column_type == 'images'">
              <img
                v-for="(image, index) in row[columns.column]"
                :src="image"
                :style="{ marginLeft: (index == 0 ? '0' : '5px') }"
                @click="showImg = true;currentShowImg = image;"
                class="slot-image"
                />
            </template>
            <template v-else>
              <span>{{ row[columns.column] }}</span>
            </template>
          </slot>
        </template>
      </template>

      <template slot-scope="{ row, index }" slot="fastedit">
        <div v-if="editIndex === index">
          <Button @click="handleSave(index)">保存</Button>
          <Button @click="editIndex = -1">取消</Button>
        </div>
        <div v-else>
          <Button @click="handleEdit(row, index)">操作</Button>
        </div>
      </template>
    </Table>

    <div style="margin: 10px;overflow: hidden" v-if="pagestatus">
      <div style="float: right;">
        <Page
          :total="total"
          :current="current"
          :page-size="cListConf.pageSize"
          :show-elevator="showElevator"
          :page-size-opts="pageSizeOpts"
          :show-sizer="showSizer"
          :show-total="showTotal"
          @on-change="listChangePage"
          @on-page-size-change="listChangeSize"
          >
        </Page>
      </div>
    </div>

    <!-- show images -->
    <Modal
      v-model="showImg"
      width="730"
      :mask-closable="false"
      :footer-hide="true"
      title="查看图片"
      >
      <img :src="currentShowImg" style="width: 700px" />
    </Modal>
  </div>
</template>
<script>
/**
 * myTable 接口文档
 * author: smallnews
 * props {
  *      listConf: {
  *          url:    接口地址
  *          searchParams: 搜索条件
  *          rowClass: 根据状态显示对应的字体颜色
  *          columns:    列表所有字段
  *      }
  *      noSearch:     是否有搜索框
  *      isHandStart:  是否手动加载第一页
  *      isExport:    是否导出
 * }
 *
 * event: {
 *      setTotal: 加载第一页的时候 返回 总条数
 *      searchReset: 重置事件
 *      select: 选择一行的事件
 *      checkboxChange: 复选框多选事件（批量操作）
 *      export:   导出
 * }
 */


  import Util from '../../libs/util';

  export default {
    props: {
      listConf: {
        default: function () {
          return {};
        }
      },
      noSearch: {
        default: false
      },
      isHandStart: {
        default: false
      },
      pagestatus: {
        default: true
      },
      border: {
        default: true
      },
      height: {
        type: [Number, String]
      },
      maxHeight: {
        type: [Number, String]
      }
    },
    data () {
      return {
        loading: false,
        lighlightRow: true,
        // border: false,
        stripe: true,
        showSizer: true,    // 显示每页条数下拉框
        showTotal: true,
        showElevator: true,
        pageSizeOpts: [10, 30, 50, 100],
        defaultListConf: {
          url: "",
          pageSize: 10,
          searchParams: {},
          rowClass: []
        },
        originSearchParams: {},
        checkedColumns: [],
        item: [],
        total: 0,
        current: 1,
        queryParams: {},
        onePage: false,
        editIndex: 0,
        exportLoading: false,
        showImg: false,       // 查看图片
        currentShowImg: ""
      }
    },
    computed: {
      cListConf () {    // 合并 默认配置
        return Util.extend(this.defaultListConf, this.listConf);
      },
      setColumns () {   // 设置可以隐藏的 列 复选框列表
        let columns = this.listConf.columns;
        let setColumns = [];
        for (let item of columns) {
          if (item.key != undefined && item.title != undefined) {
            setColumns.push({label: item.key, title: item.title});
          }
        }

        return setColumns;
      },
      currentColumns () {   // 当前 table 显示的列
        let columns = this.listConf.columns;

        columns = columns.filter((item) => {
          return (item.key == undefined || Util.inArray(item.key, this.checkedColumns))
        });

        if (this.editColumnsForm.length > 1) {
          columns.push({
            title: '快速编辑',
            width: 100,
            align: 'center',
            slot: 'fastedit',
            fixed: 'right',
          })
        }

        return columns;
      },
      slotColumns () {    // 动态生成 自定义columns 的 slot
        let columns = this.listConf.columns;
        let slotColumns = [];
        for (let item of columns) {
          if (item.slot != undefined && item.slot != '') {
            slotColumns.push({
              column: item.slot,
              column_type: (item.column_type != undefined ? item.column_type : ''),
              editable: (item.editable != undefined ? item.editable : false)
            });
          }
        }

        return slotColumns;
      },
      editColumnsForm () {
        let slotColumns = this.slotColumns;
        let editColumnsForm = [];
        for (let item of slotColumns) {
          if (item.editable) {
            editColumnsForm.push(item.column);
          }
        }

        return editColumnsForm;
      },
      rowClass () {
        return this.listConf.rowClass != undefined ? this.listConf.rowClass : [];
      }
    },
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
      rowClassName (row, index) {
        for (let item of this.rowClass) {
          if (row[item.name] == item.value) {
            return 'table-' + item.type + '-row';
          }
        }

        return "";
      },

      getColumnsDataKey () {
        let key = this.$route.name ? this.$route.name : this.$route.path
        return key;
      },
      setCheckedColumns () {
        Util.getData(this.getColumnsDataKey()).then((item) => {
          if (item != null && item.length > 0) {
            // 有缓存
            this.checkedColumns = item;
          } else {
            // 没有缓存，默认全部显示
            for (let item of this.listConf.columns) {
              if (item.key != undefined && item.title != undefined) {
                this.checkedColumns.push(item.key)    // 默认全选中，如果需要做本地缓存，本行删除失效
              }
            }
          }

        })
      },
      exportData(isAll) {
        this.$emit('export', {isAll: isAll})
      },
      exportCsv: function(options, opt = {}) {
        let route = this.$route;
        let columnsCB = options.columnsCB;
        let dataCB = options.dataCB;

        delete options.columnsCB;
        delete options.dataCB;

        let filename = options.filename != undefined ? options.filename : '';
        if (filename == '') {
          filename = route.meta != undefined ? (route.meta.title ? route.meta.title : '导出数据') : '导出数据';
        }
        var defaultOptions = {
          filename: filename,
          original: true,
          columns: columnsCB != undefined ? this.currentColumns.filter(columnsCB) : this.currentColumns,
        }

        // opt 里面不能包含 data
        defaultOptions = Util.extend(defaultOptions, opt)

        // 全部数据
        if (options.isAll) {
          this.exportLoading = true;
          var oldPageSize = this.queryParams['page_size'];
          this.queryParams['page_size'] = 99999999999;

          this.listLoadData((result) => {
            this.exportLoading = false;
            // 将 page_size 还原
            this.queryParams['page_size'] = oldPageSize;

            if (!result.error) {
              var data = result.result;
              var item = data.data;

              defaultOptions.data = dataCB != undefined ? item.filter(dataCB) : item;
              this.$refs.table.exportCsv(defaultOptions);
            }
          });
        } else {
          defaultOptions.data = dataCB != undefined ? this.item.filter(dataCB) : this.item;
          this.$refs.table.exportCsv(defaultOptions);
        }
      }
    },
    watch: {
      checkedColumns (val) {
        Util.setData(this.getColumnsDataKey(), val)
      }
    },
    created: function () {
      this.setCheckedColumns();

      // this.setEditColumns();

      // 如果远程 url 地址为空，则数据使用传过来的 data
      if (this.listConf.url == undefined || this.listConf.url == '') {
        this.item = this.listConf.data ? this.listConf.data : [];
      } else {
        if (!this.isHandStart) {
          this.listInit();
        }
      }
    },
    mounted: function (){
      // 复制 搜索初始值
      this.originSearchParams = JSON.parse(JSON.stringify(this.listConf.searchParams));
    }
  };
</script>

<style scoped>
.table-index {
  margin: 20px;
}
.oper-div{
	margin-bottom: 10px;
}
.oper-data {
  float: left;
  width: 80%;
}
.oper-table {
  float: right;
}
.ivu-table-header{
	color: #FFFFFF !important;
}
.oper-div button {
  margin: 0 5px;
}

.ivu-checkbox-group-item {
  display: block;
  padding: 5px 15px;
}
.clear {
  clear: both;
}
.slot-image {
  width: 60px;
  height: 60px;
  margin-top: 5px;
  cursor: pointer;
}
</style>

<style>
.ivu-table .table-info-row td{
  color: #2db7f5;
}
.ivu-table .table-error-row td{
  color: #ed3f14;
}
.ivu-table .table-warning-row td{
  color: #ff6600;
}
.ivu-table .table-disabled-row td{
  color: #929292;
}
.menu-down {
  max-width: 130px;
}
.menu-columns {
  width: 130px;
}
.oper-table-btn {
  margin: 0px !important;
}
.columns-image .ivu-table-cell {
  padding: 0px;
}
</style>
