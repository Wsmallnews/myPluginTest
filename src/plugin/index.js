import List from './components/list';
import Field from './components/field';
import Form from './components/form';
import Upload from './components/upload';
import Editor from './components/editor';
import Markdown from './components/markdown';
import Tags from './components/tags';
import Util from './libs/util';

const sm = {
  SmList: List,
  SmField: Field,
  SmForm: Form,
  SmUpload: Upload,
  SmEditor: Editor,
  SmMarkdown: Markdown,
  SmTags: Tags
}


const install = function (Vue, opts = {}) {
  if (install.installed) return;

  Object.keys(sm).forEach(key => {
    Vue.component(key, sm[key]);
  });

  Vue.prototype.$smUtil = Util;
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}


const API = {
  version: process.env.VERSION,
  install,
  ...sm
}

export default API;
