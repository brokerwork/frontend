import { Dialog } from 'lean-ui';
import UserSelector from 'components/UserSelector';
import i18n from 'utils/i18n';
import cs from './Ownership.less';

export default class OwnershipModal extends PureComponent {
  state = {
    user: {}
  };

  onSelect = user => {
    this.setState({
      user
    });
  };

  onSave = () => {
    const { onSave, onHide } = this.props;
    const { user } = this.state;
    if (!user._originData) {
      onHide();
      return;
    };
    onSave(user._originData);
  };

  render() {
    const { onHide, visible } = this.props;
    const { user } = this.state;

    return (
      <Dialog
        title={i18n['account.modify_ownership.modal_title']}
        visible={visible}
        onCancel={onHide}
        onOk={this.onSave}
        okText={i18n['general.apply']}
        cancelText={i18n['general.cancel']}
      >
        <div className="form-horizontal">
          <div className="form-group">
            <label className={`col-sm-4 control-label ${cs['label']}`}>
              {i18n['account.modify_ownership.label.account_ownership']}
            </label>
            <div className="col-sm-8">
              <UserSelector
                searchByField
                searchPlaceHolder={
                  i18n['account.user_selector.search.placehoder']
                }
                className={cs['dropdown']}
                value={user}
                onSelect={this.onSelect}
              />
            </div>
          </div>
          <div className="form-group">
            <div className={`col-sm-offset-4 col-sm-8 ${cs['tips']}`}>
              {i18n['account.modify_ownership.tips']}
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}
