export const defFields = {
  custom: {
    type: 'custom',
    name: 'custom',
    value: "",        // 默认值
    label: "自定义"
  },
  group: {            // 填充，避免报错
    type: 'group',
    name: 'group',
    value: "",        // 默认值
    label: "表单组"
  },
  markdown: {
    type: 'markdown',
    name: 'markdown',
    value: "",        // 默认值
    label: "笔记"
  },
  editor: {
    type: 'editor',
    name: 'editor',
    value: "",        // 默认值
    label: "详情"
  },
  upload: {
    type: 'upload',
    name: 'image',
    value: "",        // 默认值
    label: "上传封面",
    width: "375px",
    height: "150px",
    noEdit: false
  },
  'upload-album': {
    type: 'upload-album',
    name: 'upload-album',
    value: [],        // 默认值
    label: "上传相册",
    noEdit: false
  },
  'upload-detail': {
    type: 'upload-detail',
    name: 'images',
    label: "上传详情",
    width: "375px",
    height: "150px",
    noEdit: false
  },
  search: {
    type: 'search',
    name: 'keyword',
    value: "",
    label: "搜索",
    placeholder: "请输入关键字",
    "enter-button": true,    // 显示搜索图标，如果没有该选项，则只显示 搜索图标，没有按钮
    "enter-button": "搜索",
    readonly: false,
    disabled: false
  },
  text: {
    type: 'text',
    name: 'text',
    value: "",
    label: "内容",
    maxlength: 30,
    placeholder: "请输入内容",
    // readonly: false,
    // disabled: false,
    // prefix: "ios-contact",
    // suffix: "ios-search"
  },
  number: {
    type: 'number',
    name: 'number',
    value: 0,
    label: "",
    placeholder: "请输入数字"
  },
  email: {
    type: 'email',
    name: 'email',
    label: "邮箱",
    placeholder: "请输入邮箱"
  },
  password: {
    type: 'password',
    name: 'password',
    label: "密码",
    placeholder: "请输入密码",
    prefix: 'md-lock',
    noconfirm: false,    // 不需要确认密码
  },
  password_confirmation: {
    type: 'password_confirmation',
    name: 'password_confirmation',
    label: "确认密码",
    placeholder: "请输入确认密码",
    prefix: 'md-lock'
  },
  textarea: {
    type: 'textarea',
    name: 'desc',
    value: "",
    label: "描述",
    rows: 4,
    autosize: { minRows: 4, maxRows: 6 },
    maxlength: 200,
    'show-word-limit': true,
    placeholder: "请输入描述",
    // readonly: false,
    // disabled: false
  },
  radio: {
    type: 'radio',
    name: 'status',
    label: "状态",
    group: {
      // type: 'button',
      // vertical: true,
    },
    radios: [
      // {label: "未审核", value: 0, border: true},
      // {label: "已审核", value: 1, border: false},
      // {label: "已驳回", value: -1, border: true}
    ]
  },
  checkbox: {
    type: 'checkbox',
    name: 'checkbox',
    label: "复选框组",
    value: [],
    checkboxs: [
      // {label: "打球", value: "boll", border: true},
      // {label: "玩游戏", value: "gaming", border: false},
      // {label: "睡觉", value: "sleep", border: true}
    ]
  },
  'checkbox-only': {
    type: 'checkbox-only',
    name: 'checkbox-only',
    label: "复选框",
    value: 1,
    // disabled: false
  },
  switch: {
    type: 'switch',
    name: 'switch',
    label: "开关",
    // disabled: false,
    // 'true-color': "#c71e1e",
    // 'false-color': "#8e8787"
  },
  select: {
    type: 'select',
    name: 'category',
    label: "分类",
    placeholder: "请选择分类",
    filterable: true,
    'not-found-text': "没有匹配结果",
    clearable: true,
    // prefix: 'md-lock',
    // disabled: false,
    options: [
      // {label: "打球", value: '1', disabled: false},
      // {label: "打游戏", value: '2', disabled: false},
    ],
    optionGroups: []
  },
  'select-mult': {
    type: 'select-mult',
    name: 'category_mult',
    label: "多选分类",
    value: [],
    placeholder: "请选择多个分类",
    disabled: false,
    clearable: true,
    filterable: true,
    'max-tag-count': 2,
    'max-tag-placeholder': function (num) {
      return '更多 + ' + num;
    },
    optionGroups: []
  },
  transfer: {
    type: 'transfer',
    name: 'transfer_route',
    label: "选择穿梭框",
    value: [],
    placeholder: "请选择选择穿梭框",
    filterable: true,
    data: []
  },
  color: {
    type: 'color',
    name: 'pick_color',
    value: "",
    label: "选择颜色",
    editable: true,
    // disabled: false,
    alpha: false,
    hue: true,
    recommend: true,
    colors: []
  },
  rate: {
    type: 'rate',
    name: 'pick_rate',
    value: 0,
    label: "选择评分",
    disabled: false,
    character: '',
    icon: ''
  },
  date: {
    type: 'date',
    name: 'date_picker',
    label: "选择日期",
    value: '',
    placeholder: "请选择日期",
    placement: "bottom-start",
    clearable: true,
    editable: true,
    transfer: false,
    // disabled: false,
    // options: {
    //   disabledDate (date) {
    //     return date && date.valueOf() < Date.now() - 86400000;
    //   }
    // },
    'show-week-numbers': false,
    confirm: false
  },
  datetime: {
    type: 'datetime',
    name: 'datetime_picker',
    label: "选择时间",
    value: '',
    placeholder: "请选择时间",
    placement: "bottom-start"
  },
  daterange: {
    type: 'daterange',
    name: 'daterange_picker',
    label: "选择日期区间",
    value: [],
    placeholder: "请选择日期区间",
    clearable: true
  },
  datetimerange: {
    type: 'datetimerange',
    name: 'datetimerange_picker',
    label: "选择日期时间区间",
    value: [],
    placeholder: "请选择日期时间区间",
    clearable: true,
  },
  time: {
    type: 'time',
    name: 'time_picker',
    label: "选择时间",
    value: '',
    format: 'HH:mm:ss',
    placeholder: "请选择时间",
    steps: [],
    'disabled-hours': [],
    'disabled-minutes': [],
    'disabled-seconds': [],
    'hide-disabled-options': false,
    confirm: false,
    placement: "bottom-start"
  },
  timerange: {
    type: 'timerange',
    name: 'timerange_picker',
    label: "选择时间区间",
    value: [],
    placeholder: "请选择时间区间",
    clearable: true
  },
  cascader: {
    type: 'cascader',
    name: 'cascader',
    label: "级联列表",
    value: [],
    placeholder: "请选择级联列表",
    filterable: true,
    clearable: true,
    // disabled: true,
    "change-on-select": true,
    data: []
  },
  tags: {
    type: 'tags',
    name: 'mytag',
    value: [],        // 默认值
    label: "选择标签",
    tags: []
  },
}


export const defRules = {
  custom: {
    required: true,       // 必填
  },
  group: {
    required: true,       // 填充，避免报错
  },
  markdown: {
    required: true,
    message: 'markdown 不能为空',
    trigger: 'blur'
  },
  editor: {
    required: true,
    message: '详情不能为空',
    trigger: 'blur'
  },
  upload: {
    required: true,
    message: '请上传封面',
    trigger: 'blur'
  },
  'upload-album': [
    {
      required: true,
      type: 'array',
      min: 1,
      message: '请上传详情',
      trigger: 'change'
    },{
      type: 'array',
      max: 9,
      message: '最多上传九张图片',
      trigger: 'change'
    }
  ],
  'upload-detail': [
    {
      required: true,
      type: 'array',
      min: 1,
      message: '请上传详情',
      trigger: 'change'
    },{
      type: 'array',
      max: 9,
      message: '最多上传九张图片',
      trigger: 'change'
    }
  ],
  search: {
    required: true,
    message: '搜索关键字不能为空',
    trigger: 'blur'
  },
  text: {
    required: true,
    message: '名称不能为空',
    trigger: 'blur'
  },
  number: {
    required: true,
    message: '请输入正确的数字',
    min: 1,
    max: 100,
    trigger: 'blur',
    type: 'number'
  },
  email: [{
      required: true,
      message: '邮箱不能为空',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: 'blur'
    }
  ],
  password: {
    required: true,
    message: '请输入正确的密码格式',
    min: 6,
    max: 16,
    trigger: 'blur'
  },
  password_confirmation: {
    required: true,
    message: '请输入正确的密码格式',
    min: 6,
    max: 16,
    trigger: 'blur'
  },
  textarea: {
    required: true,
    message: '描述内容不能为空',
    trigger: 'blur'
  },
  radio: {
    required: true,
    message: '请选择状态',
    trigger: 'change'
  },
  checkbox: [
    {
      required: true,
      type: 'array',
      min: 1,
      message: '请选择兴趣',
      trigger: 'change'
    },{
      type: 'array',
      max: 999,
      message: '最多选择 999 个兴趣',
      trigger: 'change'
    }
  ],
  'checkbox-only': {
    required: true,
    type: 'number',
    min: 1,
    message: '必须选中复选框',
    trigger: 'change'
  },
  switch: {
    required: true,
    type: 'number',
    min: 1,
    message: '必须开启开关',
    trigger: 'change'
  },
  select: {
    required: true,
    message: '请选择分类',
    trigger: 'change'
  },
  'select-mult': [
    {
      required: true,
      type: 'array',
      min: 1,
      message: '请选择多选分类',
      trigger: 'change'
    },{
      type: 'array',
      max: 999,
      message: '最多选择 999 个分类',
      trigger: 'change'
    }
  ],
  transfer: [
    {
      required: true,
      type: 'array',
      min: 1,
      message: '请选择',
      trigger: 'change'
    },{
      type: 'array',
      max: 999,
      message: '最多选择 999 个',
      trigger: 'change'
    }
  ],
  color: {
    required: true,
    message: '请选择颜色',
    trigger: 'change'
  },
  rate: {
    required: true,
    type: 'number',
    message: '请选择评分',
    min: 0.5,
    max: 5,
    trigger: 'change'
  },
  date: {
    required: true,
    message: '请选择日期',
    trigger: 'change'
  },
  datetime: {
    required: true,
    message: '请选择时间',
    trigger: 'change'
  },
  daterange: [
    {
      required: true,
      type: 'array',
      min: 2,
      message: '请选择日期区间',
      trigger: 'change'
    },{
      type: 'array',
      max: 2,
      message: '请选择日期区间',
      trigger: 'change'
    }
  ],
  datetimerange: [
    {
      required: true,
      type: 'array',
      min: 2,
      message: '请选择日期时间区间',
      trigger: 'change'
    },{
      type: 'array',
      max: 2,
      message: '请选择日期时间区间',
      trigger: 'change'
    }
  ],
  time: {
    required: true,
    message: '请选择时间',
    trigger: 'change'
  },
  timerange: [
    {
      required: true,
      type: 'array',
      min: 2,
      message: '请选择时间区间',
      trigger: 'change'
    },{
      type: 'array',
      max: 2,
      message: '请选择时间区间',
      trigger: 'change'
    }
  ],
  cascader: [
    {
      required: true,
      type: 'array',
      min: 1,
      message: '请选择路由',
      trigger: 'change'
    },{
      type: 'array',
      max: 3,
      message: '最多选择三个路由',
      trigger: 'change'
    }
  ],
  tags: [
    {
      required: true,
      type: 'array',
      min: 1,
      message: '请选择标签',
      trigger: 'change'
    },{
      type: 'array',
      max: 5,
      message: '标签最多选择 5 个',
      trigger: 'change'
    }
  ],
}
