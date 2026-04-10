import { connect } from "react-redux";
import UpdateQuestionModal from "../components/UpdateQuestionModal";
import { submit } from "redux-form";
import { updateQuestion } from "../controls/actions";
import { showTopAlert } from "common/actions";

export default connect(
  ({ brokerFieldSetting: { notEnabledQuestionList } }) => ({
    notEnabledQuestionList
  }),
  {
    submitForm: submit,
    updateQuestion,
    showTopAlert
  }
)(UpdateQuestionModal);
