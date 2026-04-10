import RateSetting from './RateSetting';
import { connect } from 'react-redux';
import { showTipsModal } from 'common/actions';
import { saveAccountConfig } from '../../controls/actions';
class Deposit extends PureComponent {
  render() {
    return (
      <div>
        <RateSetting {...this.props} />
      </div>
    );
  }
}
export default connect(
  state => {
    const allFormValues = state.form;
    return {
      allFormValues,
      accountGroups: state.traderCommon.accountGroups,
      versionRights: state.common.versionRights
    };
  },
  { showTipsModal, saveAccountConfig }
)(Deposit);
