import Cookies from 'js-cookie'
import $ from 'jquery';
import LocalForage from 'localforage';

let util = {};

export const extend = function(objFirst, objSecond, mergeArray) {
  let newObj = JSON.parse(JSON.stringify(objFirst));    // 防止浅拷贝
  if (typeof objSecond === 'object' && !isNaN(objSecond.length)) { // 如果 第二个对象 是数组对象
    if (mergeArray == undefined || mergeArray == null) {
      newObj = objSecond; // 直接覆盖
    } else {
      newObj = newObj.concat(objSecond);
    }
  } else {
    for (var s in objSecond) {
      if (newObj[s] == undefined || (typeof newObj[s] != 'object' && typeof objSecond[s] === 'object')) { // 如果 objFrist 不存在, 或者类型不一致 ，直接赋值,
        newObj[s] = objSecond[s];
      } else if (typeof objSecond[s] === 'object' && !isNaN(objSecond[s].length)) { // 如果 是数组对象，直接赋值,默认前面也是数组对象
        if (mergeArray == undefined || mergeArray == null) { // 不合并数组
          newObj[s] = objSecond[s]; // 默认直接赋值
        } else {
          newObj[s] = newObj[s].concat(objSecond[s]); // 合并
        }
      } else if (typeof objSecond[s] === 'object') { // 如果是对象
        newObj[s] = util.extend(newObj[s], objSecond[s], mergeArray);
      } else { // 直接赋值
        newObj[s] = objSecond[s];
      }
    }
  }

  return newObj;
}

util.extend = extend;



/**
 * 设置 cookie
 */
export const setCookie = function(name, value, obj) {
  obj = obj == undefined ? { expires: config.cookieExpires } : obj;
  return Cookies.set(name, value, obj)
}

util.setCookie = setCookie;


/**
 * 获取 cookie
 */
export const getCookie = function(name) {
  var data = Cookies.get(name);
  try {
    data = JSON.parse(data);
  }catch (e) {
    data = data
  }

  return data;
}
util.getCookie = getCookie;


/**
 * 移除 cookie
 */
export const removeCookie = function(name) {
  Cookies.remove(name)
}
util.removeCookie = removeCookie;


/**
 * 添加缓存
 */
export const setData = function (name, value) {
  return new Promise((resolve, reject) => {
    LocalForage.setItem(name, value, function(err){
      if (err == null) {
        resolve();
      } else {
        toast('数据错误');
      }
    });
  });
}
util.setData = setData


export const getData = function(name) {
  return new Promise((resolve, reject) => {
    LocalForage.getItem(name, function(err, value) {
      if (err == null) {
        resolve(value)
      } else {
        toast('数据错误');
      }
    });
  });
}
util.getData = getData

export const removeData = function(name) {
  return new Promise((resolve, reject) => {
    LocalForage.removeItem(name, function(err) {
      if (err == null) {
        resolve(value)
      } else {
        toast('数据错误');
      }
    });
  });
}
util.removeData = removeData



/**
 * inArray，仅支持 一维二维 数组
 * name 要查找的字符串
 * obj 数组，一维数组，或者二维数组
 * field 如果是二维数组，要比较的二维数组中的 key 值
 */
export const inArray = function(name, obj, field = '') {
  if ($.inArray(name, obj) >= 0) {
    return true;
  } else {
    for (var i in obj) {
      if (field != '' && obj[i][field] == name) {
        return true;
      }
    }
  }

  return false;
}
util.inArray = inArray;





export const test = function () {
  alert(123)
}

util.test = test;
export default util;
