import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import {
  GET_SERVER_LIST,
  GET_LIST_COLUMNS,
  GET_FORM_COLUMNS,
  GET_RESOURCES,
  UPDATE_SERVER,
  NOTICE_DONE,
  GET_ACCOUNT_RANGE,
  GET_OWNER_INFO_MODULE,
  GET_ACCOUNT_COLUMNS
} from './actions';
import * as listReducers from '../path/List/controls/reducers';
import * as detailReducers from '../path/Detail/controls/reducers';
import { GET_CURRENT_USER_RIGHT, GET_USER_INFO } from 'commonActions/actions';
import { PRIVILEGE_TYPE } from '../path/List/constant';
import { getUserInfo } from 'utils/userInfo';
import { NOTICE_KEY, NOTICE_VERSION } from '../constant';
import i18n from 'utils/i18n';
import _ from 'lodash';

export const list = combineReducers({ ...listReducers });
export const detail = combineReducers({ ...detailReducers });

export const serverList = handleActions(
  {
    [GET_SERVER_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const listColumns = handleActions(
  {
    [GET_LIST_COLUMNS]: (state, { type, payload }) => payload.filterList,
    [GET_RESOURCES]: (state, { type, payload }) => {
      const copyed = _.cloneDeep(state);
      const {
        leverage = [],
        maxLeverage = [],
        currency = [],
        mtGroup = [],
        accountGroup = []
      } = payload;
      const list = {
        group: mtGroup,
        leverage,
        maxLeverage,
        currency,
        userGroup: accountGroup
      };
      return copyed.map(item => {
        return {
          ...item,
          optionList: list[item.key] || item.optionList
        };
      });
    }
  },
  []
);

export const sortListColumns = handleActions(
  {
    [GET_LIST_COLUMNS]: (state, { payload }) => payload.originList
  },
  []
);

export const formColumns = handleActions(
  {
    [GET_FORM_COLUMNS]: (state, { type, payload }) => payload,
    [GET_RESOURCES]: (state, { type, payload }) => {
      const copyed = _.cloneDeep(state);
      const {
        leverage = [],
        maxLeverage = [],
        currency = [],
        mtGroup = [],
        accountGroup = []
      } = payload;
      const list = {
        group: mtGroup,
        leverage,
        maxLeverage,
        currency,
        userGroup: accountGroup
      };

      for (let key in copyed) {
        copyed[key] = copyed[key].map(item => {
          return {
            ...item,
            optionList: list[item.key] || item.optionList
          };
        });
      }

      return copyed;
    },
    [GET_ACCOUNT_RANGE]: (state, { payload }) => {
      const copyed = _.cloneDeep(state);
      if (!copyed.accountInfo) {
        return [];
      }
      copyed.accountInfo = copyed.accountInfo.map(item => {
        return {
          ...item,
          placeHolder:
            item.key === 'login'
              ? `${i18n['account.create.account_range']} ${
                  payload.beginNo === 0
                    ? i18n['account.create.unlimited']
                    : payload.beginNo
                } ~ ${
                  payload.endNo === 0
                    ? i18n['account.create.unlimited']
                    : payload.endNo
                }`
              : item.placeHolder
        };
      });

      return copyed;
    }
  },
  {}
);

export const currentServer = handleActions(
  {
    [UPDATE_SERVER]: (state, { payload }) => payload,
    [GET_SERVER_LIST]: (state, { payload }) => payload[0]
  },
  {}
);

export const resources = handleActions(
  {
    [GET_RESOURCES]: (state, { payload }) => payload
  },
  {}
);

export const passwordRegular = handleActions(
  {
    [GET_FORM_COLUMNS]: (state, { payload }) => {
      return (
        payload.accountInfo.find(item => item.key === 'password').validateType
          .regular || ''
      );
    },
    [GET_RESOURCES]: (state, { payload }) => {
      if (payload.mtGroup && payload.vendor === 'MT5') {
        const result = {};

        payload.mtGroup.forEach(item => {
          if (item.passwordMinLength !== undefined) {
            result[item.value] = {
              reg: new RegExp(`^[0-9a-zA-Z]{${item.passwordMinLength},}$`, 'i'),
              minLength: item.passwordMinLength
            };
          }
        });

        return Object.keys(result).length ? result : state;
      }

      return state;
    }
  },
  {}
);

export const rights = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      const result = {};
      const privilegeRights = {
        baseInfo: 'BASE',
        financialInfo: 'FIN',
        certificatesInfo: 'ID',
        classificationInfo: 'CLASSIFICATION',
        appropriatenessTestInfo: 'APPROPRIATE',
        accountInfo: 'ACC',
        sensitive: 'SENSITIVE',
        balance: 'DW',
        leverage: 'LEVER',
        credit: 'CREDIT',
        password: 'PWD',
        group: 'MTG',
        accountGroup: 'GRP',
        trade: 'TRADE'
      };

      result.create = payload['ACCOUNT_OPEN'];
      result.detail = payload['ACCOUNT_SELECT'];
      result.update = {
        ownerInfo: payload['ACCOUNT_MODIFY-PERSONAL'],
        accountInfo: payload['ACCOUNT_MODIFY-DATA'],
        accountGroup: payload['ACCOUNT_MODIFY-MT-GRP'],
        group: payload['ACCOUNT_MODIFY-MT-GROUP'],
        leverage: payload['ACCOUNT_MODIFY-LEVER'],
        password: payload['ACCOUNT_MODIFY-PWD'],
        balance: payload['ACCOUNT_MODIFY-DW'],
        credit: payload['ACCOUNT_MODIFY-CREDIT'],
        readOnly: payload['ACCOUNT_MODIFY-ATS'],
        enable: payload['ACCOUNT_MALS'] && payload['ACCOUNT_MODIFY-DATA'],
        // 修改直属代理
        ownerShip: payload['ACCOUNT_MODIFY_OTHER_INFO']
      };
      result.remove = payload['ACCOUNT_DELETE'];
      result.createCustomer = payload['ACCOUNT_ADDCUSTOMER'];
      result.export = payload['ACCOUNT_EXPORT'];
      result.verify = payload['ACCOUNT_VERIFICATION'];
      result.sendMsg = payload['MESSAGE_SEND_OBJECT_ACCOUNT'];
      result.sendSms = payload['MESSAGE_SEND_TYPE_SMS'];
      result.sendMail = payload['MESSAGE_SEND_TYPE_EMAIL'];
      result.enable = payload['ACCOUNT_MALS'];
      result.batchWithdraw = payload['ACCOUNT_IMPORT-WITHDRAW'];
      result.batchDeposit = payload['ACCOUNT_IMPORT-DEPOSIT'];
      result.privilege = {};

      for (let key in privilegeRights) {
        result.privilege[key] = false;
      }

      PRIVILEGE_TYPE.forEach(item => {
        for (let key in privilegeRights) {
          if (payload[item.right]) {
            if (!result.privilege[item.value])
              result.privilege[item.value] = {};

            result.privilege[item.value][key] =
              payload[`${item.right}_${privilegeRights[key]}`];

            if (payload[`${item.right}_${privilegeRights[key]}`]) {
              result.privilege[key] = true;
            }
          }
        }
      });
      return result;
    }
  },
  {}
);

export const needShowNotice = handleActions(
  {
    [GET_USER_INFO]: (state, { type, payload }) =>
      localStorage.getItem(`${NOTICE_KEY}_${payload.id}`) !== NOTICE_VERSION,
    [NOTICE_DONE]: (state, { type, paylod }) => {
      const { id } = getUserInfo();

      localStorage.setItem(`${NOTICE_KEY}_${id}`, NOTICE_VERSION);

      return false;
    }
  },
  false
);

export const accountRange = handleActions(
  {
    [GET_ACCOUNT_RANGE]: (state, { payload }) => {
      return {
        beginNo: payload.beginNo,
        endNo: payload.endNo
      };
    }
  },
  {
    beginNo: 0,
    endNo: 0
  }
);

export const ownerInfoModule = handleActions(
  {
    [GET_OWNER_INFO_MODULE]: (state, { payload }) => payload
  },
  []
);
export const accountColumns = handleActions(
  {
    [GET_ACCOUNT_COLUMNS]: (state, { payload }) => payload
  },
  []
);
