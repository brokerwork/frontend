import _ from 'lodash';

/**
 * 键值重命名 用于后端数据字段变更,但是内容不变的情况
 * @param {Array or Object} data {key1: 11, key3: 22}
 * @param {Array} rule [{from: 'key1', to: 'key2', remove: 'key3', handle: function() {}}]
 * [from, to]将字段key1另命名为key2, [remove]删除key3, [handle]通过handle处理数据, 将处理结果返回做为新的值
 * @param {Boolean} reverse 用于反转from to, 便于将转换后的字段名再组装回原有的字段名
 * 返回 {key2: 11}
 */
export default function keyTransfer({ data, rule = [], reverse = false }) {
  if (_.isArray(data)) {
    data.forEach(ii => {
      keyTransfer({ data: ii, rule, reverse });
    });
  } else if (_.isObject(data)) {
    // 修改字段名
    rule.forEach(ii => {
      let { from, to, remove, handle } = ii;
      // 删除字段
      if (_.isString(remove) && remove in data) {
        delete data[remove];
      }
      if (_.isString(from) && _.isString(to)) {
        // 反转字段名
        if (reverse) {
          [from, to] = [to, from];
        }
        if (from in data) {
          if (_.isFunction(handle)) {
            data[from] = handle(data[from], data, from);
          }
          data[to] = data[from];
          // 如果有处理函数, 将传传给处理函数, 并奖处理后的值做为to新的值
          delete data[from];
        }
      }
    });
    // 查找子结构, 是否还有其他 对象或者数组, 递归修改
    for (let k in data) {
      if (_.isArray(data[k]) || _.isObject[data[k]]) {
        keyTransfer({ data: data[k], rule, reverse });
      }
    }
  }
  return data;
}
