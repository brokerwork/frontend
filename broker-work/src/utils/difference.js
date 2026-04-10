import { transform, isEqual, isObject } from 'lodash';
/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export default function difference(object, base) {
  const keys1 = Object.keys(object);
  const keys2 = Object.keys(base);
  if (keys1.length < keys2.length) {
    [object, base] = [base, object];
  }
  return transform(object, function(result, value, key) {
    if (!isEqual(value, base[key])) {
      result[key] =
        isObject(value) && isObject(base[key])
          ? difference(value, base[key])
          : value;
    }
  });
}
