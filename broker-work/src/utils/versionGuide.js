const VERSION_GUIDE_KEY = 'VERSION_GUIDE_';
import versionGuideConf from 'components/VersionGuide/config';
let __injectedKeys = []; //当前页面中存在的引导
let __disComfirmedKeys; //已经确认国的引导

export const getKeys = userId => {
  //得到当前页面未确认的引导
  const disComfirmedKeys = getDisComfirmedKeys(userId);
  return disComfirmedKeys.filter(item => __injectedKeys.includes(item));
};

export const injecteKey = (userId, key) => {
  if (!key || __injectedKeys.includes(key));
  __injectedKeys.push(key);
  return getKeys(userId);
};

export const comfirmKey = (userId, key) => {
  let disComfirmedKeys = getDisComfirmedKeys(userId);
  const idx = disComfirmedKeys.findIndex(item => item === key);
  disComfirmedKeys.splice(idx, 1);
  setDisComfirmedKeys(userId, disComfirmedKeys);
  return getKeys(userId);
};

// privide functions
function getDisComfirmedKeys(userId) {
  //获得所有未确认的引导
  if (!__disComfirmedKeys) {
    __disComfirmedKeys =
      getDisComfirmedFromStorage(userId) || versionGuideConf.keys;
  }
  return __disComfirmedKeys.concat();
}

function setDisComfirmedKeys(userId, keys) {
  __disComfirmedKeys = keys.concat();
  setDisComfirmedToStorage(userId, __disComfirmedKeys);
}

function getDisComfirmedFromStorage(userId) {
  //从localStorage获得未确认引导
  const storageKey = `${VERSION_GUIDE_KEY}${userId}`;
  const str = localStorage.getItem(storageKey);
  const guideObj = JSON.parse(str);
  if (guideObj && guideObj.version === versionGuideConf.version) {
    return guideObj.keys;
  }
}

function setDisComfirmedToStorage(userId, keys) {
  const storageKey = `${VERSION_GUIDE_KEY}${userId}`;
  const str = JSON.stringify({ version: versionGuideConf.version, keys });
  localStorage.setItem(storageKey, str);
}
