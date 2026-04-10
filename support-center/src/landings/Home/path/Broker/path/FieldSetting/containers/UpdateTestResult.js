import { connect } from "react-redux";
import UpdateTestResult from "../components/UpdateTestResult";
import { submit } from "redux-form";
import {
  getTestResult,
  updateTestResult,
  storeResultScore
} from "../controls/actions";
import { showTopAlert } from "common/actions";

export default connect(
  ({ brokerFieldSetting: { testResult } }) => ({
    testResult
  }),
  {
    submitForm: submit,
    getTestResult,
    updateTestResult,
    showTopAlert,
    storeResultScore
  }
)(UpdateTestResult);
