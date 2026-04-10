import { createAction } from 'redux-actions';
import { get, post, all } from 'utils/ajax';
import {
  BALANCE_TYPE,
  DEPOSIT_PROFIT_BALANCE_UNIT,
  DISTRIBUTION_BALANCE_TYPE,
  DISTRIBUTION_MODE2_BALANCE_TYPE,
  DISTRIBUTION_BALANCE_UNIT,
  CYCLE_LEVEL_LIST
} from '../constant';
// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'SETTINGS_';

export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const GET_SERVER_SYMBOLS = `${PRE_FIX}GET_SERVER_SYMBOLS`;
export const GET_ACCOUNT_LIST = `${PRE_FIX}GET_ACCOUNT_LIST`;
export const GET_LEVEL_LIST = `${PRE_FIX}GET_LEVEL_LIST`;
export const GET_BALANCE_UNIT = `${PRE_FIX}GET_BALANCE_UNIT`;
export const GET_BALANCE_TYPE = `${PRE_FIX}GET_BALANCE_TYPE`;
export const GET_GROUP_LIST = `${PRE_FIX}GET_GROUP_LIST`;
export const GET_SERVER_GROUP_LIST = `${PRE_FIX}GET_SERVER_GROUP_LIST`;
export const GET_COMMISSION_TYPE = `${PRE_FIX}GET_COMMISSION_TYPE`;
export const GET_BASIC_RESOURCE = `${PRE_FIX}GET_BASIC_RESOURCE`;
export const GET_DEPOSIT_BASIC_RESOURCE = `${PRE_FIX}GET_DEPOSIT_BASIC_RESOURCE`;
export const GET_DIRSTRIBUTION_BASIC_RESOURCE = `${PRE_FIX}GET_DIRSTRIBUTION_BASIC_RESOURCE`;
export const GET_DIRSTRIBUTION_MODE2_BALANCE_TYPE = `${PRE_FIX}GET_DIRSTRIBUTION_MODE2_BALANCE_TYPE`;
export const CHECK_RULE_DETAIL = `${PRE_FIX}CHECK_RULE_DETAIL`;
export const CHECK_PARAMETER = `${PRE_FIX}CHECK_PARAMETER`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getServerList = createAction(GET_SERVER_LIST, () =>
  get({
    url: '/v1/account/dropdown/mt4/servers'
  })
);

export const getServerSymbols = createAction(GET_SERVER_SYMBOLS, () =>
  get({
    url: '/v1/report/setting/serverSymbols'
  })
);

export const getAccountList = createAction(GET_ACCOUNT_LIST, () =>
  get({
    url: '/v1/account/manage/userGroup/info'
  })
);

export const getLevelList = createAction(GET_LEVEL_LIST, () =>
  get({
    url: '/v1/level/list'
  })
);

export const getBalanceUnit = createAction(GET_BALANCE_UNIT, () =>
  get({
    url: '/v1/tenants/metadata/field/option/balanceUnit'
  })
);

export const getBalanceType = createAction(
  GET_BALANCE_TYPE,
  () => BALANCE_TYPE
);

export const getGroupList = createAction(GET_GROUP_LIST, () =>
  get({
    url: '/v2/report/setting/symbolGroup/list'
  })
);

export const getServerGroupList = createAction(GET_SERVER_GROUP_LIST, () =>
  get({
    url: '/v1/report/setting/serverGroups'
  })
);

export const getCommissionType = createAction(GET_COMMISSION_TYPE, () =>
  get({
    url: '/v1/tenants/metadata/field/option/commissionDepositType'
  })
);

export const getBasicResource = createAction(GET_BASIC_RESOURCE, () => {
  return all([
    get({ url: '/v1/report/setting/serverGroups' }),
    get({ url: '/v2/report/setting/symbolGroup/list' }),
    { data: BALANCE_TYPE, result: true, mcode: 'm0000000' },
    get({ url: '/v1/tenants/metadata/field/option/balanceUnit' }),
    get({ url: '/v1/level/list' }),
    get({ url: '/v1/account/manage/userGroup/info' }),
    get({ url: '/v1/report/setting/serverSymbols' })
  ]);
});

export const getDepositBasicResource = createAction(
  GET_DEPOSIT_BASIC_RESOURCE,
  () =>
    all([
      get({ url: '/v1/report/setting/serverGroups' }),
      get({ url: '/v1/tenants/metadata/field/option/commissionDepositType' }),
      { data: DEPOSIT_PROFIT_BALANCE_UNIT, result: true, mcode: 'm0000000' },
      get({ url: '/v1/level/list' }),
      get({ url: '/v1/account/manage/userGroup/info' }),
      get({ url: '/v1/tenants/metadata/field/option/profitType' })
    ])
);

export const getDistributionBasicResource = createAction(
  GET_DIRSTRIBUTION_BASIC_RESOURCE,
  () =>
    all(
      [
        get({ url: '/v1/report/setting/serverGroups' }),
        get({ url: '/v2/report/setting/symbolGroup/list' }),
        { data: DISTRIBUTION_BALANCE_TYPE, result: true },
        { data: DISTRIBUTION_BALANCE_UNIT, result: true },
        get({ url: '/v1/level/list' }),
        get({ url: '/v1/account/manage/userGroup/info' }),
        get({ url: '/v1/report/setting/serverSymbols' }),
        { data: CYCLE_LEVEL_LIST, result: true },
        get({ url: '/v1/tenants/metadata/field/option/parentSubRelation' }),
        get({
          url: '/v1/tenants/metadata/field/option/distributionCommissionType'
        }),
        get({
          url: '/v1/tenants/metadata/field/option/distributionPipCommissionType'
        }),
        get({
          url:
            '/v1/tenants/metadata/field/option/distributionIndiCommissionType'
        }),
        get({ url: '/v1/tenants/metadata/field/option/parentDirSubRelation' }),
        get({ url: '/v1/tenants/metadata/field/option/subSubRelation' }),
        get({ url: '/v1/tenants/metadata/field/option/multiSubRelation' }),
        get({ url: '/v1/tenants/metadata/field/option/multiCommissionType' })
      ],
      [
        'serverGroup',
        'symbolGroup',
        'balanceType',
        'balanceUnit',
        'levelList',
        'userGroup',
        'serverSymbol',
        'cycleLevel',
        'parentSubRelation',
        'distributionCommissionType',
        'distributionPipCommissionType',
        'distributionIndiCommissionType',
        'parentDirSubRelation',
        'subSubRelation',
        'multiSubRelation',
        'multiCommissionType'
      ]
    )
);

// 获取分销交易返佣模式二的结算方式
export const getDistributionMode2BalanceType = createAction(
  GET_DIRSTRIBUTION_MODE2_BALANCE_TYPE,
  isMode2 =>
    isMode2 ? DISTRIBUTION_MODE2_BALANCE_TYPE : DISTRIBUTION_BALANCE_TYPE
);

export const checkRuleDetail = createAction(CHECK_RULE_DETAIL, id =>
  post({
    url: `/v1/report/setting/rule/deleteCheck/${id}`
  })
);

export const checkParameter = createAction(CHECK_PARAMETER, id =>
  post({
    url: `/v1/report/setting/ruleDetail/deleteCheck/${id}`
  })
);
