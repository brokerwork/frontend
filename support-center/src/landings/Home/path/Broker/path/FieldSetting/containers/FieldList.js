import { connect } from "react-redux";
import FieldList from "../components/FieldList";
import {
  updateField,
  setFieldOrderNo,
  removeCustomizeField,
  disableField
} from "../controls/actions";
import { getBrandInfo } from '../../../controls/actions';
import { showTipsModal, showTopAlert } from "common/actions";

export default connect(
  ({ brokerFieldSetting: { fieldList, fieldType } }) => ({
    fieldList,
    fieldType
  }),
  {
    updateField,
    setFieldOrderNo,
    showTipsModal,
    showTopAlert,
    removeCustomizeField,
    disableField,
    getBrandInfo
  }
)(FieldList);
