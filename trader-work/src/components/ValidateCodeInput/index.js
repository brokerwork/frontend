import { connect } from "react-redux";
import Root from "./ValidateCodeInput";
import { sendValidateCode } from "@/actions/Personal/userInfo";

export default connect(
  state => {
    return null;
  },
  {
    sendValidateCode
  }
)(Root);
