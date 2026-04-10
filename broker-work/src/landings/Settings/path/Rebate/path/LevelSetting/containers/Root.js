import { connect } from 'react-redux';
import LevelSetting from '../components/Root';
import { showTipsModal } from 'commonActions/actions';
import { submit } from 'redux-form';

import {
  getLevelList,
  addLevel,
  editLevel,
  deleteLevel,
  getUserCountDetail,
  updateCurrentLevel,
  getDefaultLevel,
  updateDefaultLevel,
  getDefaultLevelList
} from '../controls/actions';

export default connect(
  ({
    settings: {
      rebate: { level }
    },
    common
  }) => {
    return {
      brandInfo: common.brandInfo,
      levelList: level.level_list,
      userCountList: level.user_count_list,
      currentLevel: level.current_level,
      defaultLevel: level.defaultLevel,
      defaultLevelList: level.defaultLevelList
    };
  },
  {
    showTipsModal,
    getLevelList,
    editLevel,
    addLevel,
    deleteLevel,
    updateCurrentLevel,
    getUserCountDetail,
    submit,
    getDefaultLevel,
    updateDefaultLevel,
    getDefaultLevelList
  }
)(LevelSetting);
