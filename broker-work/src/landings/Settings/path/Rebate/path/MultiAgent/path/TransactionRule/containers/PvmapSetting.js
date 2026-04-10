import { connect } from 'react-redux';
import PvmapSetting from '../components/PvmapSetting';
import { showTipsModal } from 'commonActions/actions';
import { submit } from 'redux-form';
import {
  getPVmapList,
  createPVmap,
  updatePVmap,
  removePVmap
} from '../controls/actions';

export default connect(
  ({
    settings: {
      rebate: {
        multiAgent: { transactionRule }
      },
      base: { server_symbols }
    }
  }) => {
    return {
      serverSymbols: server_symbols,
      pvmapList: transactionRule.pvmap_list
    };
  },
  {
    showTipsModal,
    getPVmapList,
    createPVmap,
    updatePVmap,
    removePVmap,
    submitForm: submit
  }
)(PvmapSetting);
