import { handleActions } from 'redux-actions';
import { GET_SERVER_SYMBOL, UPDATE_CURRENT_SERVER_ID } from './actions';
import i18n from 'utils/i18n';

export const serverList = handleActions(
  {
    [GET_SERVER_SYMBOL]: (state, { type, payload }) => {
      return payload.servers.map(item => ({
        serverId: item.serverId,
        serverName: item.serverName
      }));
    }
  },
  []
);

export const groupList = handleActions(
  {
    [GET_SERVER_SYMBOL]: (state, { payload }) => {
      return payload.servers.reduce((value, currentValue) => {
        value[currentValue.serverId] = currentValue.groups.map(
          item => item.groupName
        );

        return value;
      }, {});
    }
  },
  {}
);

export const stdSymbolList = handleActions(
  {
    [GET_SERVER_SYMBOL]: (state, { payload }) => {
      return payload.servers.reduce((value, currentValue) => {
        value[currentValue.serverId] = currentValue.groups.reduce(
          (group, currentGroup) => {
            group[currentGroup.groupName] = currentGroup.stdSymbols;

            return group;
          },
          {}
        );

        return value;
      }, {});
    }
  },
  {}
);

export const tenantSymbolList = handleActions(
  {
    [GET_SERVER_SYMBOL]: (state, { payload }) => {
      return payload.servers.reduce((value, currentValue) => {
        value[currentValue.serverId] = currentValue.groups.reduce(
          (group, currentGroup) => {
            const options = currentGroup.tenantSymbols.map(item => ({
              ...item,
              label: item.symbolName,
              value: item.symbolName
            }));
            options.unshift({
              label: i18n['general.default_select'],
              value: ''
            });
            group[currentGroup.groupName] = options;

            return group;
          },
          {}
        );

        return value;
      }, {});
    }
  },
  {}
);

export const currentServerId = handleActions(
  {
    [GET_SERVER_SYMBOL]: (state, { payload }) => {
      return state
        ? state
        : payload.servers && payload.servers.length
          ? payload.servers[0].serverId
          : '';
    },
    [UPDATE_CURRENT_SERVER_ID]: (state, { payload }) => payload
  },
  ''
);
