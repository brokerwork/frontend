import { connect } from "react-redux";
import UpdateConnector from "../components/UpdateConnector";
import { updateConnector } from "../controls/actions";
import { submit } from "redux-form";
import { showTopAlert } from "common/actions";

export default connect(null, {
  submitForm: submit,
  updateConnector,
  showTopAlert
})(UpdateConnector);
