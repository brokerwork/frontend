import { connect } from 'react-redux';
import ImportModal from '../components/ImportModal';
import { showTipsModal, showTopAlert } from 'commonActions/actions';
import {
  checkImportContentSuccess,
  selectImportFile,
  executeImport
} from '../controls/actions';

export default connect(
  ({
    customMgmt: {
      customers: { checkImportContentResult, importFile, importResult }
    }
  }) => ({
    checkImportContentResult,
    importFile,
    importResult
  }),
  {
    selectImportFile,
    checkImportContentSuccess,
    executeImport,
    showTipsModal,
    showTopAlert
  }
)(ImportModal);
