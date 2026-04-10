import { connect } from "react-redux";
import UpdateSymbol from "../components/UpdateSymbol";
import { updateSymbol, getServerSymbol } from "../controls/actions";
import { submit } from "redux-form";
import { showTopAlert } from "common/actions";

export default connect(
  ({ twappFollowOrder: { symbol: { groupList, currentServerId } } }) => ({
    groupList,
    currentServerId
  }),
  {
    updateSymbol,
    submitForm: submit,
    showTopAlert,
    getServerSymbol
  }
)(UpdateSymbol);
