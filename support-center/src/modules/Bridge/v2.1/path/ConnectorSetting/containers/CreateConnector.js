import { connect } from "react-redux";
import CreateConnector from "../components/CreateConnector";
import { createConnector } from "../controls/actions";
import { submit } from "redux-form";
import { showTopAlert } from "common/actions";

export default connect(null, {
  submitForm: submit,
  createConnector,
  showTopAlert
})(CreateConnector);
