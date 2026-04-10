import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'LINK_SETTING_';

export const GET_LINK_LIST = `${PRE_FIX}GET_LINK_LIST`;
export const GET_LINK_TYPE = `${PRE_FIX}GET_LINK_TYPE`;
export const REMOVE_LINK = `${PRE_FIX}REMOVE_LINK`;
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const GET_MT_GROUP_LIST = `${PRE_FIX}GET_MT_GROUP_LIST`;
export const CLEAR_MT_GROUP_LIST = `${PRE_FIX}CLEAR_MT_GROUP_LIST`;
export const CREATE_LINK = `${PRE_FIX}CREATE_LINK`;
export const UPDATE_CURRENT_PLATFORM = `${PRE_FIX}UPDATE_CURRENT_PLATFORM`;
export const GET_LINK_STATISTIC = `${PRE_FIX}GET_LINK_STATISTIC`;
export const CLEAR_LINK_STATISTIC = `${PRE_FIX}CLEAR_LINK_STATISTIC`;
export const GET_USER_GROUP_LIST = `${PRE_FIX}GET_USER_GROUP_LIST`;
export const GET_LEVERAGE_LIST = `${PRE_FIX}GET_LEVERAGE_LIST`;
export const CLEAR_LEVERAGE_LIST = `${PRE_FIX}CLEAR_LEVERAGE_LIST`;
export const CLEAR_USER_GROUP_LIST = `${PRE_FIX}CLEAR_USER_GROUP_LIST`;
export const GET_QRCODE = `${PRE_FIX}GET_QRCODE`;
export const UPDATE_CURRENT_STATUS = `${PRE_FIX}UPDATE_CURRENT_STATUS`;
export const DISABLED_LINK = `${PRE_FIX}DISABLED_LINK`;
export const UPDATE_LINK = `${PRE_FIX}UPDATE_LINK`;
export const GET_EDIT_LINK_DETAIL = `${PRE_FIX}GET_EDIT_LINK_DETAIL `;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getLinkList = createAction(
  GET_LINK_LIST,
  (platform, enable, type = 'StraightGuest,Agent,DirectRecommendation') =>
    get({
      url: '/v2/user/introduce/list',
      data: {
        platform,
        type,
        enable
      }
    })
);

export const getEditLinkDetail = createAction(GET_EDIT_LINK_DETAIL, id =>
  get({
    url: `/v1/user/introduce/${id}/detail`
  })
);

export const disabledLink = createAction(DISABLED_LINK, id =>
  post({
    url: `/v1/user/introduce/${id}/switch`
  })
);

export const getLinkType = createAction(GET_LINK_TYPE, () =>
  get({
    url: '/v1/user/introduce/parameterTypes'
  })
);

export const removeLink = createAction(REMOVE_LINK, id =>
  post({
    url: '/v1/user/introduce/delete',
    data: [id]
  })
);

export const getServerList = createAction(GET_SERVER_LIST, () => {
  return get({
    url: '/v1/account/dropdown/serverList'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);

    let copyData = res.data.concat();

    // copyData = copyData.map(item => {
    //   return {
    //     label: item.desc,
    //     value: item.serverId
    //     // value: {
    //     //   serverId: item.serverId,
    //     //   vendor: item.vendor
    //     // }
    //   };
    // });

    return Promise.resolve({
      ...res,
      data: copyData
    });
  });
});

// 获取MT组列表
export const getMTGroupList = createAction(
  GET_MT_GROUP_LIST,
  ({ vendor, serverId }) => {
    return get({
      url: '/v1/account/dropdown/groups',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    }).then(res => {
      if (!res.result) return Promise.resolve(res);

      let copyData = res.data.concat();

      copyData = copyData.map(item => {
        return {
          label: item,
          value: item
        };
      });

      return Promise.resolve({
        ...res,
        data: copyData
      });
    });
  }
);

export const clearMTGroupList = createAction(CLEAR_MT_GROUP_LIST);

export const clearUserGroupList = createAction(CLEAR_USER_GROUP_LIST);

export const clearLeverageList = createAction(CLEAR_LEVERAGE_LIST);

export const createLink = createAction(CREATE_LINK, link =>
  post({
    url: '/v1/user/introduce/addIntroduce',
    data: link
  })
);

export const updateLink = createAction(UPDATE_LINK, link =>
  post({
    url: '/v1/user/introduce/update',
    data: link
  })
);

export const updateCurrentPlatform = createAction(
  UPDATE_CURRENT_PLATFORM,
  platform => platform
);

export const updateCurrentStatus = createAction(
  UPDATE_CURRENT_STATUS,
  status => status
);

export const getLinkStatistic = createAction(GET_LINK_STATISTIC, id =>
  get({
    url: `/v1/user/introduce/${id}/statistic`
  })
);

export const getUserGroupList = createAction(
  GET_USER_GROUP_LIST,
  ({ vendor, serverId }) => {
    return get({
      url: '/v1/account/manage/userGroup/info',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    }).then(res => {
      if (!res.result) return Promise.resolve(res);

      let copyData = res.data.concat();

      copyData = copyData.map(item => {
        return {
          label: item.groupName || '',
          value: item.id
        };
      });

      return Promise.resolve({
        ...res,
        data: copyData
      });
    });
  }
);

export const getLeverageList = createAction(
  GET_LEVERAGE_LIST,
  ({ vendor, serverId }) => {
    return get({
      url: `/v1/tenants/metadata/field/option/leverage${
        vendor && vendor.toLowerCase() === 'mt5' ? '-mt5' : ''
      }`
    });
  }
);

export const clearLinkStatistic = createAction(CLEAR_LINK_STATISTIC);

export const getQrcode = createAction(GET_QRCODE, id =>
  get({
    url: `/v1/user/introduce/${id}/qrcode`
  })
);
