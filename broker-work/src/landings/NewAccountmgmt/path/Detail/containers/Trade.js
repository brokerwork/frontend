import Trade from '../components/Trade';
import { connect } from 'react-redux';
import { getTradeList } from '../controls/actions';

export default connect(
  (
    {
      accountManagement: {
        currentServer,
        detail: { accountId, tradeList }
      }
    },
    props
  ) => ({
    currentServer,
    accountId,
    tradeList
  }),
  {
    getTradeList
  }
)(Trade);
