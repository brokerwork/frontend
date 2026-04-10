import { connect } from "react-redux";
import Question from "../components/Question";
import {
  getQuestionSummary,
  toggleQuestionSummaryStatus,
  operateQuestion,
  getDefaultQuesionList,
  setQuestionSequence,
  getTestResult,
  storeResultScore
} from "../controls/actions";
import { showTopAlert, showTipsModal } from "common/actions";

export default connect(
  ({ brokerFieldSetting: { questionSummary, testResult, resultScore } }) => ({
    questionSummary,
    testResult,
    resultScore
  }),
  {
    getQuestionSummary,
    toggleQuestionSummaryStatus,
    operateQuestion,
    getDefaultQuesionList,
    showTopAlert,
    showTipsModal,
    setQuestionSequence,
    getTestResult,
    storeResultScore
  }
)(Question);
