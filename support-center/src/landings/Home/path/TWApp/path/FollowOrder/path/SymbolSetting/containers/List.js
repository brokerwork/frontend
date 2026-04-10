import { connect } from "react-redux";
import List from "../components/List";
import { boundTenantSymbol, getServerSymbol } from "../controls/actions";
import { showTopAlert } from "common/actions";

export default connect(
  ({
    twappFollowOrder: {
      symbol: { stdSymbolList, tenantSymbolList, currentServerId }
    }
  }) => ({
    stdSymbolList,
    tenantSymbolList,
    currentServerId
  }),
  {
    boundTenantSymbol,
    showTopAlert,
    getServerSymbol
  }
)(List);
