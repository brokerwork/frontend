//简单实现 处理了Object Array Date的引用类型
export const deepCopy = toCopy => {
  const type = Object.prototype.toString.call(toCopy);
  if (type === '[object Object]') {
    const result = {};
    for (let key in toCopy) {
      result[key] = deepCopy(toCopy[key]);
    }
    return result;
  } else if (type === '[object Array]') {
    return toCopy.map(item => deepCopy(item));
  } else if (type === '[object Date]') {
    return new Date(toCopy);
  } else {
    return toCopy;
  }
};

export const deepExtend = (extendTarget, ...toExtend) => {
  const extendList = toExtend.map(item => deepCopy(item));
  return Object.assign(extendTarget, ...extendList);
};
