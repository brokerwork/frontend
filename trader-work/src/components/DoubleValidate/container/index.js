import { connect } from "react-redux";
import Root from "../components/Root";
import * as actions from "@/actions/Personal/userInfo";
import { getFaData, configAccess } from "@/actions/Common/common";

import _ from "lodash";

export default connect(
  ({ common, login }) => {
    return {
      validateSettingData: common.validateSettingData,
      configAcessResult: _.isEmpty(common.configAcessResult)
        ? login.configAcessResult
        : common.configAcessResult
    };
  },
  {
    ...actions,
    getFaData,
    configAccess
  }
)(Root);
