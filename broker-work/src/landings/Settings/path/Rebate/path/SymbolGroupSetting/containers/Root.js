import { connect } from 'react-redux';
import { showTipsModal } from 'commonActions/actions';
import SymbolGroupSetting from '../components/Root';
import {
  createGroup,
  removeGroup,
  updateGroup,
  selectGroup,
  updateSelectedGroup,
  getMt5Symbols,
  sortGroup
} from '../controls/actions';
import {
  getServerSymbols,
  getGroupList
} from '../../../../../controls/actions';

export default connect(
  ({
    settings: {
      rebate: { symbolGroup },
      base: { group_list, server_symbols }
    }
  }) => {
    return {
      groupList: group_list,
      serverSymbols: server_symbols,
      selectedGroup: symbolGroup.selected_group,
      mt5Symbols: symbolGroup.mt5Symbols
    };
  },
  {
    getGroupList,
    getServerSymbols,
    createGroup,
    removeGroup,
    updateGroup,
    selectGroup,
    updateSelectedGroup,
    showTipsModal,
    getMt5Symbols,
    sortGroup
  }
)(SymbolGroupSetting);
